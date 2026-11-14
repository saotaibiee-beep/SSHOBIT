import { NextResponse } from 'next/server';
import { adminDb,paypalToken,paypalRequest,prices } from '@/lib/service-payments';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const {requestId,email}=await req.json();
  if(typeof requestId!=='string'||!/^[0-9a-f-]{36}$/i.test(requestId)||typeof email!=='string')return NextResponse.json({error:'بيانات الطلب غير صحيحة'},{status:400});
  const db=adminDb();
  const {data:r,error}=await db.from('service_intake_requests').select('id,email,service_code,price_usd,status,paypal_order_id').eq('id',requestId).single();
  if(error){console.error('PayPal intake lookup failed',error.code,error.message);return NextResponse.json({error:'تعذر التحقق من الطلب في قاعدة البيانات. تواصل مع الإدارة ولا تعِد إرسال الطلب.'},{status:503});}
  if(!r)return NextResponse.json({error:'لم يُعثر على الطلب المسجل. تواصل مع الإدارة برقم طلبك.'},{status:404});
  if(r.email.trim().toLowerCase()!==email.trim().toLowerCase())return NextResponse.json({error:'البريد الإلكتروني لا يطابق البريد المسجل في الطلب.'},{status:409});
  if(r.status!=='awaiting_payment')return NextResponse.json({error:'لا يمكن الدفع لهذا الطلب'},{status:409});
  const price=prices[r.service_code];
  if(!price||Number(r.price_usd)!==price)return NextResponse.json({error:'سعر الطلب غير مطابق'},{status:409});
  const token=await paypalToken();
  if(r.paypal_order_id){
   const existing=await paypalRequest('/v2/checkout/orders/'+encodeURIComponent(r.paypal_order_id),token,'GET');
   if(existing.status==='CREATED'||existing.status==='PAYER_ACTION_REQUIRED'||existing.status==='APPROVED')return NextResponse.json({orderId:existing.id,approveUrl:existing.links?.find((l:{rel:string})=>l.rel==='payer-action'||l.rel==='approve')?.href});
   return NextResponse.json({error:'حالة الدفع تحتاج مراجعة'},{status:409});
  }
  const created=await paypalRequest('/v2/checkout/orders',token,'POST',{intent:'CAPTURE',purchase_units:[{reference_id:r.id,custom_id:r.id,amount:{currency_code:'USD',value:price.toFixed(2)},description:'Service case analysis'}],payment_source:undefined,application_context:{brand_name:'Trading Knowledge Platform',user_action:'PAY_NOW',return_url:'https://sshobit.vercel.app/services/payment-return',cancel_url:'https://sshobit.vercel.app/services/request'}},'intake-create-'+r.id);
  const {data:updated,error:updateError}=await db.from('service_intake_requests').update({paypal_order_id:created.id}).eq('id',r.id).eq('status','awaiting_payment').is('paypal_order_id',null).select('id').maybeSingle();
  if(updateError||!updated)return NextResponse.json({error:'تعذر ربط عملية الدفع بالطلب'},{status:409});
  const approveUrl=created.links?.find((l:{rel:string})=>l.rel==='payer-action'||l.rel==='approve')?.href;
  if(!approveUrl)return NextResponse.json({error:'لم يرجع PayPal رابط دفع'},{status:502});
  return NextResponse.json({orderId:created.id,approveUrl});
 }catch(e){console.error('PayPal create order',e instanceof Error?e.message:'unknown');return NextResponse.json({error:'الدفع غير متاح مؤقتاً. حاول لاحقاً.'},{status:503});}
}
