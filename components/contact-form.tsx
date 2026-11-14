'use client';
import { useState,type FormEvent } from 'react';
const options=[['general','استفسار عام'],['suggestion','اقتراح أو ملاحظة'],['correction','الإبلاغ عن معلومة غير صحيحة'],['technical','مشكلة تقنية في الموقع'],['paid_service','استفسار عن طلب خدمة مدفوعة'],['partnership','شراكات وتعاون']];
export function ContactForm(){
 const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState(''),[reference,setReference]=useState('');
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const form=event.currentTarget;const data=new FormData(form);
  setBusy(true);setFeedback('');setReference('');
  try{
   const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(data))});
   const result=await res.json();
   setFeedback(result.message||result.error||'تعذر إرسال الرسالة.');
   if(res.ok&&result.referenceNo){setReference(result.referenceNo);form.reset();}
  }catch{setFeedback('تعذر الاتصال بالخادم. حاول مرة أخرى.');}finally{setBusy(false);}
 }
 return <form onSubmit={submit} className="contact-message-form">
  <h2>أرسل رسالتك للإدارة</h2><p>عبّئ النموذج وسنراجع رسالتك ونرد عبر البريد الإلكتروني الذي أدخلته.</p>
  <div className="contact-fields"><label>الاسم<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="اسمك"/></label><label>البريد الإلكتروني<input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" placeholder="you@example.com"/></label></div>
  <label>نوع الاستفسار<select name="category" required defaultValue=""><option value="" disabled>اختر نوع الاستفسار</option>{options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
  <label>عنوان الرسالة<input name="subject" required minLength={3} maxLength={160} placeholder="عنوان مختصر"/></label>
  <label>تفاصيل الرسالة<textarea name="message" required minLength={15} maxLength={5000} rows={6} placeholder="اكتب تفاصيل استفسارك هنا..."/></label>
  <div className="contact-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <button type="submit" disabled={busy}>{busy?'جارٍ الإرسال...':'إرسال الرسالة'}</button>
  {feedback&&<p role="status" className="contact-feedback">{feedback}{reference&&<> رقم المتابعة: <b dir="ltr">{reference}</b></>}</p>}
 </form>;
}
