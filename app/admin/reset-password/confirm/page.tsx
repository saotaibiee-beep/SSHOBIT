import Link from 'next/link';
import {AdminPasswordUpdateForm} from '@/components/admin-password-update-form';
export const metadata={title:'تعيين كلمة مرور الإدارة'};
export default function ConfirmResetPage(){return <main className="admin-auth-shell"><section className="admin-auth-card"><Link href="/" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><span className="admin-eyebrow">SECURE PASSWORD</span><h1>تعيين كلمة مرور جديدة</h1><p className="admin-auth-intro">استخدم كلمة مرور قوية لا تقل عن 10 أحرف.</p><AdminPasswordUpdateForm/><Link className="admin-back-link" href="/admin/login">العودة لتسجيل الدخول</Link></section></main>}
