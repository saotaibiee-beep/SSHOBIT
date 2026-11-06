'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
export function AdminPasswordUpdateForm(){
 const router=useRouter();const [ready,setReady]=useState(false);const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 useEffect(()=>{let active=true;(async()=>{const supabase=createClient();const code=new URLSearchParams(window.location.search).get('code');if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(error){if(active)setMessage('الرابط غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً.');return;}}const {data}=await supabase.auth.getSession();if(active){setReady(!!data.session);if(!data.session)setMessage('افتح رابط الاستعادة الذي وصلك على البريد الإلكتروني.');}})();return()=>{active=false}},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage('');const supabase=createClient();const {error}=await supabase.auth.updateUser({password});if(error){setMessage('تعذر تحديث كلمة المرور. استخدم كلمة مرور أقوى أو اطلب رابطاً جديداً.');setBusy(false);return;}await supabase.auth.signOut();setMessage('تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن.');setBusy(false);setTimeout(()=>router.replace('/admin/login'),900);}
 return <form className="admin-login-form" onSubmit={submit}><label htmlFor="new-admin-password">كلمة المرور الجديدة</label><input id="new-admin-password" type="password" minLength={10} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={!ready} dir="ltr"/><button className="admin-submit" disabled={!ready||busy}>{busy?'جارٍ الحفظ…':'حفظ كلمة المرور'}</button>{message&&<p className="admin-login-note" role="status">{message}</p>}</form>;
}
