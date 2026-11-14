import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/service-payments';
export const runtime='nodejs';
const categories=['general','suggestion','correction','technical','paid_service','partnership'];
export async function POST(request:Request){
 try{
  if(Number(request.headers.get('content-length')||0)>10000)return NextResponse.json({error:'الرسالة كبيرة جداً'},{status:413});
  const body=await request.json();
  if(body.website)return NextResponse.json({ok:true,message:'تم استلام الرسالة'});
  const full_name=String(body.name||'').trim(),email=String(body.email||'').trim().toLowerCase(),category=String(body.category||''),subject=String(body.subject||'').trim(),message=String(body.message||'').trim();
  if(full_name.length<2||full_name.length>100||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!categories.includes(category)||subject.length<3||subject.length>160||message.length<15||message.length>5000)return NextResponse.json({error:'تحقق من جميع الحقول، ويجب ألا يقل نص الرسالة عن 15 حرفاً.'},{status:400});
  const db=adminDb();
  const cutoff=new Date(Date.now()-15*60*1000).toISOString();
  const {count,error:countError}=await db.from('contact_messages').select('id',{count:'exact',head:true}).eq('email',email).gte('created_at',cutoff);
  if(countError)throw countError;
  if((count??0)>=3)return NextResponse.json({error:'تم استلام عدة رسائل مؤخراً. حاول بعد 15 دقيقة.'},{status:429});
  const {data,error}=await db.from('contact_messages').insert({full_name,email,category,subject,message}).select('reference_no').single();
  if(error)throw error;
  return NextResponse.json({ok:true,referenceNo:String(data.reference_no),message:'تم إرسال رسالتك إلى إدارة الموقع بنجاح.'});
 }catch(e){console.error('Contact intake failed',e instanceof Error?e.message:'unknown');return NextResponse.json({error:'تعذر حفظ الرسالة حالياً. حاول لاحقاً.'},{status:503});}
}
