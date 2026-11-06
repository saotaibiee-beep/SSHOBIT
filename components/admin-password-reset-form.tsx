'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
export function AdminPasswordResetForm(){
 const [email,setEmail]=useState('saotaibee@gmail.com');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setMessage('');
  const supabase=createClient();
  const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/admin/reset-password/confirm`});
  setMessage(error?'تعذر إرسال الرابط. تحقق من إعدادات البريد في Supabase.':'إذا كان البريد مسجلاً، فسيصلك رابط آمن لإعادة تعيين كلمة المرور.');
  setBusy(false);
 }
 return <form className="admin-login-form" onSubmit={submit}><label htmlFor="reset-email">البريد الإلكتروني</label><input id="reset-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required dir="ltr"/><button className="admin-submit" disabled={busy}>{busy?'جارٍ الإرسال…':'إرسال رابط الاستعادة'}</button>{message&&<p className="admin-login-note" role="status">{message}</p>}</form>;
}
