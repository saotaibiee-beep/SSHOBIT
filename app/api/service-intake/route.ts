import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
const prices:Record<string,number>={deposit_withdrawal:21,p2p_dispute:27,bank_restriction:40};
export async function POST(req:Request){
 try{
  const contentLength=Number(req.headers.get('content-length')||0);
  if(contentLength>12000)return NextResponse.json({error:'حجم الطلب كبير جداً'},{status:413});
  const data=await req.json();
  if(data.website)return NextResponse.json({ok:true});
  const service=String(data.service||'');
  const name=String(data.name||'').trim();
  const email=String(data.email||'').trim().toLowerCase();
  const summary=String(data.summary||'').trim();
  if(!Object.prototype.hasOwnProperty.call(prices,service)||name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||summary.length<30||summary.length>3000){
   return NextResponse.json({error:'تأكد من اختيار الخدمة وكتابة الاسم والبريد ووصف المشكلة (30 حرفاً على الأقل).'},{status:400});
  }
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return NextResponse.json({error:'الخدمة غير متاحة مؤقتاً'},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const id=randomUUID();
  const {error}=await supabase.from('service_intake_requests').insert({id,service_code:service,full_name:name,email,case_summary:summary,price_usd:prices[service],price_sar:null,status:'awaiting_payment'});
  if(error){console.error('Service intake insert failed',error.code);return NextResponse.json({error:'تعذر حفظ الطلب. حاول مرة أخرى.'},{status:500});}
  return NextResponse.json({ok:true,requestId:id,message:'تم تسجيل طلبك. يمكنك المتابعة للدفع عبر PayPal عند إتاحة الخدمة.'});
 }catch{return NextResponse.json({error:'تعذر معالجة الطلب'},{status:400});}
}
