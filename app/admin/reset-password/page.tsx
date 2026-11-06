import Link from 'next/link';
import { AdminPasswordResetForm } from '@/components/admin-password-reset-form';
export const metadata={title:'استعادة كلمة مرور الإدارة'};
export default function ResetPasswordPage(){return <main className="admin-auth-shell"><section className="admin-auth-card"><Link href="/" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><span className="admin-eyebrow">ACCOUNT RECOVERY</span><h1>استعادة كلمة المرور</h1><p className="admin-auth-intro">أدخل بريد حساب الإدارة لإرسال رابط استعادة آمن.</p><AdminPasswordResetForm/><Link className="admin-back-link" href="/admin/login">العودة لتسجيل الدخول</Link></section></main>}
