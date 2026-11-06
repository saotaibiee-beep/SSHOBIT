import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin, ROLE_LABELS, type AdminRole } from '@/lib/admin';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const { supabase, user, role } = await requireAdmin();
  if (role !== 'super_admin') redirect('/admin?forbidden=1');

  const { data: admins } = await supabase
    .from('admin_users')
    .select('user_id,role,created_at')
    .order('created_at', { ascending: true });

  return (
    <main className="admin-shell">
      <header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><div className="admin-user-area"><span>{user.email}</span><b>مدير عام</b><AdminLogoutButton /></div></header>
      <div className="admin-main">
        <Link className="admin-back-link" href="/admin">← العودة للوحة الإدارة</Link>
        <div className="admin-page-heading"><div><span className="admin-eyebrow">ACCESS CONTROL</span><h1>الفريق والصلاحيات</h1><p>قائمة الحسابات المخولة وأدوارها داخل المنصة.</p></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>معرف الحساب</th><th>الدور</th><th>تاريخ الإضافة</th></tr></thead><tbody>{(admins ?? []).map((item) => <tr key={item.user_id}><td dir="ltr">{item.user_id}</td><td><span className="admin-role-pill">{ROLE_LABELS[item.role as AdminRole] ?? item.role}</span></td><td>{new Date(item.created_at).toLocaleDateString('ar-SA')}</td></tr>)}</tbody></table>{(!admins || admins.length === 0) && <p className="admin-empty">لا توجد حسابات إدارية حتى الآن.</p>}</div>
        <section className="admin-security-note"><b>إضافة مسؤول جديد بأمان</b><ol><li>أنشئ حساباً بالبريد المطلوب من Supabase Dashboard ← Authentication ← Users، أو أرسل دعوة من هناك.</li><li>انسخ User UID للحساب.</li><li>أضف UID إلى جدول <code>public.admin_users</code> وحدد الدور المسموح. لا تفعّل التسجيل العام للمسؤولين.</li></ol><p>ملف SQL الجاهز: <code>supabase/bootstrap-first-admin.sql</code>. يجب استبدال البريد التجريبي بالبريد الذي تملكه قبل تشغيله.</p></section>
        <section className="admin-role-matrix"><h2>مصفوفة الصلاحيات</h2><div><b>مدير عام</b><span>كامل التحكم، إدارة الفريق والأدوار وسجل النشاط.</span></div><div><b>مسؤول</b><span>إدارة المحتوى والتشغيل والاطلاع على سجلات الدفع.</span></div><div><b>محرر</b><span>إنشاء وتحرير المحتوى والمراجعة التحريرية دون إدارة الفريق أو المدفوعات.</span></div><div><b>الدعم</b><span>الاطلاع على طلبات العملاء وملاحظات التشغيل دون تحرير المحتوى أو الاطلاع على بيانات الدفع.</span></div></section>
      </div>
    </main>
  );
}
