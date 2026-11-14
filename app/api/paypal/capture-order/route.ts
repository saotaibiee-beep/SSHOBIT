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
  const {data:updated,error:updateError}=await db.from('service_intake_requests').update({status:'paid',paypal_capture_id:capture.id,paid_at:new Date().toISOString()}).eq('id',r.id).eq('status','awaiting_payment').select('id').maybeSingle();
  if(updateError)throw updateError;
  const {data:ledger,error:ledgerError}=await db.from('payments').select('id,amount,currency,status,provider_payment_id').eq('intake_request_id',r.id).eq('provider_payment_id',capture.id).maybeSingle();
  if(ledgerError||!ledger||ledger.status!=='confirmed'||ledger.currency!=='USD'||Number(ledger.amount)!==prices[r.service_code])return NextResponse.json({error:'تمت مراجعة الدفع لكن سجل العملية يحتاج تحققاً إدارياً؛ لا تُعِد الدفع.'},{status:503});
  if(!updated){const {data:latest}=await db.from('service_intake_requests').select('status,paypal_capture_id').eq('id',r.id).single();if(latest?.status!=='paid'||latest.paypal_capture_id!==capture.id)return NextResponse.json({error:'تعارض في حالة الطلب؛ تواصل مع الإدارة ولا تُعِد الدفع.'},{status:409});}
  return NextResponse.json({ok:true,paid:true});
 }catch(e){console.error('PayPal capture',e instanceof Error?e.message:'unknown');return NextResponse.json({error:'تعذر التحقق من الدفع حالياً'},{status:503});}
}
