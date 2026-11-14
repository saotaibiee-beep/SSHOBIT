import { NextResponse } from 'next/server';
import { adminDb,paypalToken,paypalRequest,prices } from '@/lib/service-payments';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const {orderId}=await req.json();
  if(typeof orderId!=='string'||!/^[A-Z0-9]{8,30}$/.test(orderId))return NextResponse.json({error:'معرّف العملية غير صالح'},{status:400});
  const db=adminDb();
  const {data:r,error}=await db.from('service_intake_requests').select('id,service_code,price_usd,status,paypal_order_id').eq('paypal_order_id',orderId).single();
  if(error||!r)return NextResponse.json({error:'العملية غير مرتبطة بطلب'},{status:404});
  if(r.status==='paid'||r.status==='under_review'||r.status==='in_progress'||r.status==='completed')return NextResponse.json({ok:true,paid:true});
  if(r.status!=='awaiting_payment'||Number(r.price_usd)!==prices[r.service_code])return NextResponse.json({error:'حالة الطلب غير صالحة'},{status:409});
  const token=await paypalToken();
  let order=await paypalRequest('/v2/checkout/orders/'+encodeURIComponent(orderId),token,'GET');
  if(order.status==='APPROVED')order=await paypalRequest('/v2/checkout/orders/'+encodeURIComponent(orderId)+'/capture',token,'POST',{},'intake-capture-'+r.id);
  if(order.status!=='COMPLETED')return NextResponse.json({ok:false,paid:false,error:'لم يكتمل الدفع بعد'},{status:409});
  const unit=order.purchase_units?.[0],capture=unit?.payments?.captures?.[0];
  if(unit?.custom_id!==r.id||capture?.status!=='COMPLETED'||capture?.amount?.currency_code!=='USD'||Number(capture?.amount?.value)!==prices[r.service_code]||!capture?.id)return NextResponse.json({error:'تعذر مطابقة بيانات الدفع'},{status:409});
  const {error:updateError}=await db.from('service_intake_requests').update({status:'paid',paypal_capture_id:capture.id,paid_at:new Date().toISOString()}).eq('id',r.id).eq('status','awaiting_payment');
  if(updateError)throw updateError;
  return NextResponse.json({ok:true,paid:true});
 }catch(e){console.error('PayPal capture',e instanceof Error?e.message:'unknown');return NextResponse.json({error:'تعذر التحقق من الدفع حالياً'},{status:503});}
}
