import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export const dynamic = 'force-dynamic';

type Row = Record<string, string | number | boolean | null>;

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { section } = await params;
  const query = await searchParams;
  const { supabase, user, role } = await requireAdmin();

  let title = '';
  let description = '';
  let headers: string[] = [];
  let rows: Row[] = [];
  let keys: string[] = [];

  if (section === 'content') {
    if (!['super_admin', 'admin', 'editor'].includes(role)) redirect('/admin?forbidden=1');
    const problems = query.type === 'problems';
    title = problems ? 'مركز المشكلات' : 'المقالات والمعرفة';
    description = 'مراجعة المحتوى وحالات النشر. النشر والتعديل سيظلان مقيدين حتى تفعيل محرر المحتوى واعتماد المراجعة.';
    headers = problems ? ['العنوان', 'المعرّف', 'الحالة', 'آخر تحديث'] : ['عنوان المقال', 'المعرّف', 'الحالة', 'آخر تحديث'];
    keys = problems ? ['title_ar', 'slug', 'status', 'updated_at'] : ['title_ar', 'slug', 'status', 'updated_at'];
    const result = problems
      ? await supabase.from('problems').select('title_ar,slug,status,updated_at').order('updated_at', { ascending: false })
      : await supabase.from('articles').select('title_ar,slug,status,updated_at').order('updated_at', { ascending: false });
    rows = (result.data ?? []) as Row[];
  } else if (section === 'operations') {
    if (!['super_admin', 'admin', 'support'].includes(role)) redirect('/admin?forbidden=1');
    title = 'طلبات الخدمات';
    description = 'متابعة طلبات العملاء وحالاتها. لا تظهر بيانات دفع حساسة في هذه الشاشة.';
    headers = ['ملخص الطلب', 'رقم الطلب', 'الحالة', 'تاريخ الإنشاء'];
    keys = ['customer_summary', 'id', 'status', 'created_at'];
    const result = await supabase.from('service_requests').select('id,status,customer_summary,created_at').order('created_at', { ascending: false }).limit(100);
    rows = (result.data ?? []) as Row[];
  } else if (section === 'directory') {
    if (!['super_admin', 'admin', 'editor'].includes(role)) redirect('/admin?forbidden=1');
    title = 'دليل المنصات والمحافظ';
    description = 'مراجعة بيانات المنصات ومصادرها وحالة ظهورها.';
    headers = ['المنصة', 'النوع', 'منشور', 'آخر مراجعة'];
    keys = ['name', 'platform_type', 'is_published', 'reviewed_at'];
    const result = await supabase.from('platforms').select('name,platform_type,is_published,reviewed_at').order('name');
    rows = (result.data ?? []) as Row[];
  } else if (section === 'faqs') {
    if (!['super_admin', 'admin', 'editor'].includes(role)) redirect('/admin?forbidden=1');
    title = 'الأسئلة الشائعة';
    description = 'مراجعة الأسئلة المنشورة وترتيبها.';
    headers = ['السؤال', 'الترتيب', 'منشور'];
    keys = ['question_ar', 'sort_order', 'is_published'];
    const result = await supabase.from('faqs').select('question_ar,sort_order,is_published').order('sort_order');
    rows = (result.data ?? []) as Row[];
  } else {
    notFound();
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><div className="admin-user-area"><span>{user.email}</span><AdminLogoutButton /></div></header>
      <div className="admin-main">
        <Link className="admin-back-link" href="/admin">← العودة للوحة الإدارة</Link>
        <div className="admin-page-heading"><div><span className="admin-eyebrow">MANAGEMENT / REVIEW</span><h1>{title}</h1><p>{description}</p></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={String(row.id ?? row.slug ?? index)}>{keys.map(key => <td key={key}>{key === 'is_published' ? (row[key] ? 'نعم' : 'لا') : key === 'updated_at' || key === 'created_at' || key === 'reviewed_at' ? (row[key] ? new Date(String(row[key])).toLocaleDateString('ar-SA') : '—') : String(row[key] ?? '—')}</td>)}</tr>)}</tbody>
          </table>
          {rows.length === 0 && <p className="admin-empty">لا توجد سجلات لعرضها حالياً.</p>}
        </div>
        <section className="admin-security-note"><b>وضع المراجعة</b><p>هذه الشاشة للعرض والمراجعة فقط حالياً. لم أفتح عمليات إنشاء أو حذف أو نشر غير محمية؛ ستُفعّل عمليات التعديل عبر إجراءات خادمية تتحقق من الدور وتسجل كل تغيير في سجل النشاط.</p></section>
      </div>
    </main>
  );
}
