import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin-login-form';
import { getAdminContext } from '@/lib/admin';

export const metadata: Metadata = { title: 'دخول الإدارة' };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { user, role } = await getAdminContext();
  if (user && role) redirect('/admin');
  const params = await searchParams;

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <Link href="/" className="admin-brand"><span className="admin-brand-mark">S</span> <small>لوحة الإدارة</small></Link>
        <span className="admin-eyebrow">مساحة محمية</span>
        <h1>دخول المسؤول</h1>
        <p className="admin-auth-intro">إدارة محتوى المنصة والطلبات والصلاحيات من مكان واحد.</p>
        {params.denied === '1' && <p className="admin-form-error">الحساب مسجل، لكنه لا يملك صلاحية دخول الإدارة.</p>}
        <AdminLoginForm />
        <Link className="admin-back-link" href="/admin/reset-password">نسيت كلمة المرور؟</Link>
        <Link className="admin-back-link" href="/">العودة إلى الموقع ↗</Link>
      </section>
    </main>
  );
}
