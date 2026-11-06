import Link from 'next/link';
import { getAdminContext, ROLE_LABELS, type AdminRole } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export const dynamic = 'force-dynamic';

const modules = [
  { title: 'المقالات والمعرفة', detail: 'إدارة المقالات والمراجع والمراجعة قبل النشر', href: '/admin/content', mark: '01' },
  { title: 'مركز المشكلات', detail: 'إدارة أدلة المشكلات وخطوات المعالجة', href: '/admin/content?type=problems', mark: '02' },
  { title: 'الخدمات والطلبات', detail: 'متابعة الخدمات وطلبات العملاء', href: '/admin/operations', mark: '03' },
  { title: 'الدليل والمنصات', detail: 'إدارة المنصات والمحافظ ومعلوماتها الموثقة', href: '/admin/directory', mark: '04' },
  { title: 'الأسئلة الشائعة', detail: 'تحديث الإجابات وترتيب ظهورها', href: '/admin/faqs', mark: '05' },
  { title: 'الفريق والصلاحيات', detail: 'حسابات الإدارة والأدوار', href: '/admin/users', mark: '06' },
  { title: 'سجل النشاط', detail: 'تسجيل عمليات دخول وخروج الإدارة', href: '/admin/activity', mark: '07' },
  { title: 'مصفوفة الصلاحيات', detail: 'مراجعة نطاق الوصول لكل دور إداري', href: '/admin/permissions', mark: '08' },
];

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ forbidden?: string }> }) {
  const { supabase, user, role } = await getAdminContext();
  if (!user) redirect('/admin/login');
  if (!role) redirect('/admin/login?denied=1');

  const counts = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('problems').select('id', { count: 'exact', head: true }),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }),
    supabase.from('faqs').select('id', { count: 'exact', head: true }),
  ]);
  const values = counts.map(item => item.count ?? 0);
  const params = await searchParams;

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link>
        <div className="admin-user-area"><span>{user.email}</span><b>{ROLE_LABELS[role as AdminRole]}</b><AdminLogoutButton /></div>
      </header>
      <div className="admin-main">
        <div className="admin-page-heading">
          <div><span className="admin-eyebrow">مركز التحكم</span><h1>لوحة الإدارة</h1><p>إدارة المنصة ومحتواها وتشغيلها من مساحة واحدة.</p></div>
          <span className="admin-live-status"><i /> جلسة موثقة</span>
        </div>
        {params.forbidden === '1' && <div className="admin-notice">ليس لديك صلاحية للوصول إلى القسم المطلوب.</div>}
        <section className="admin-stats">
          <article><small>المقالات</small><strong>{values[0]}</strong><span>مسودات ومنشورة</span></article>
          <article><small>أدلة المشكلات</small><strong>{values[1]}</strong><span>محتوى مركز المشكلات</span></article>
          <article><small>طلبات الخدمات</small><strong>{values[2]}</strong><span>جميع الحالات المسموح بها</span></article>
          <article><small>الأسئلة الشائعة</small><strong>{values[3]}</strong><span>إجمالي الأسئلة</span></article>
        </section>
        <div className="admin-section-title"><div><span className="admin-eyebrow">WORKSPACE</span><h2>أقسام المنصة</h2></div><span>SSHOBIT / ADMIN</span></div>
        <section className="admin-module-grid">
          {modules.map((item) => <Link className="admin-module" href={item.href} key={item.mark}><span>{item.mark}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><b>↗</b></Link>)}
        </section>
        <section className="admin-security-note"><b>حماية الوصول</b><p>كل صفحة إدارية تتحقق من جلسة Supabase ودور المستخدم على الخادم. وتُطبق قاعدة البيانات صلاحيات مستقلة عبر RLS؛ إخفاء الروابط وحده لا يمنح أو يمنع الوصول.</p></section>
      </div>
    </main>
  );
}
