'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError || !data.user) {
      setError('تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.');
      setBusy(false);
      return;
    }

    const { data: admin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (!admin?.role) {
      await supabase.auth.signOut();
      setError('هذا الحساب غير مضاف إلى قائمة مسؤولي SSHOBIT.');
      setBusy(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-email">البريد الإلكتروني</label>
      <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" dir="ltr" />
      <label htmlFor="admin-password">كلمة المرور</label>
      <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" dir="ltr" />
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <button className="admin-submit" type="submit" disabled={busy}>{busy ? 'جارٍ التحقق…' : 'دخول لوحة الإدارة'}</button>
      <p className="admin-login-note">الدخول مخصص للحسابات التي أضافها مدير المنصة مسبقاً. لا يوجد تسجيل ذاتي للمسؤولين.</p>
    </form>
  );
}
