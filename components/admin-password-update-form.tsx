'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminPasswordUpdateForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    async function verifyRecovery() {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (active) setError('الرابط غير صالح أو انتهت صلاحيته. اطلب رابط استعادة جديداً.');
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (active) {
        setReady(Boolean(data.session));
        if (!data.session) setError('افتح رابط الاستعادة الذي وصلك على بريدك الإلكتروني.');
      }
    }
    void verifyRecovery();
    return () => { active = false; };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 12) {
      setError('كلمة المرور يجب ألا تقل عن 12 خانة.');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('تعذر تحديث كلمة المرور. قد يكون الرابط منتهياً أو مستخدماً مسبقاً.');
      setBusy(false);
      return;
    }
    await supabase.auth.signOut();
    setMessage('تم تحديث كلمة المرور بنجاح. سيتم تحويلك لتسجيل الدخول.');
    setBusy(false);
    window.setTimeout(() => {
      router.replace('/admin/login');
      router.refresh();
    }, 1000);
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="new-admin-password">كلمة المرور الجديدة</label>
      <input id="new-admin-password" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={event => setPassword(event.target.value)} disabled={!ready || busy} dir="ltr" />
      <label htmlFor="confirm-admin-password">تأكيد كلمة المرور</label>
      <input id="confirm-admin-password" type="password" autoComplete="new-password" minLength={12} required value={confirm} onChange={event => setConfirm(event.target.value)} disabled={!ready || busy} dir="ltr" />
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {message && <p className="admin-login-note" role="status">{message}</p>}
      <button className="admin-submit" type="submit" disabled={!ready || busy}>{busy ? 'جارٍ التحديث…' : 'تحديث كلمة المرور'}</button>
    </form>
  );
}
