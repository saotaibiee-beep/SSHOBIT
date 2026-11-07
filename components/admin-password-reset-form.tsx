'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function AdminPasswordResetForm() {
  const [email, setEmail] = useState('saotaibee@gmail.com');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setFailed(false);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/admin/reset-password/confirm`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

      if (error) {
        setFailed(true);
        setMessage(`فشل إرسال رابط الاستعادة: ${error.message}`);
      } else {
        setMessage('إذا كان البريد مسجلاً، فسيصلك رابط آمن لإعادة تعيين كلمة المرور. تحقق من صندوق الوارد والرسائل غير المرغوب فيها.');
      }
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : 'حدث خطأ غير معروف أثناء إرسال الرابط.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="reset-email">البريد الإلكتروني</label>
      <input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr" />
      <button className="admin-submit" disabled={busy}>{busy ? 'جارٍ الإرسال…' : 'إرسال رابط الاستعادة'}</button>
      {message && <p className="admin-login-note" role="status" aria-live="polite" style={{ color: failed ? '#b42318' : undefined }}>{message}</p>}
    </form>
  );
}
