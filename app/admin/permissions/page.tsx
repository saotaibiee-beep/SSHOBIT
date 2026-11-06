import Link from 'next/link';
import { requireAdmin, ROLE_LABELS, type AdminRole } from '@/lib/admin';
import { redirect } from 'next/navigation';

export const metadata = { title: 'مصفوفة الصلاحيات' };

export default async function PermissionsPage() {
  const { role } = await requireAdmin();
  if (role !== 'super_admin' && role !== 'admin') redirect('/admin?forbidden=1');
  const rows: [string, string, string, string, string][] = [
    ['المقالات والمراجع', 'إدارة', 'إدارة', 'تحرير', 'قراءة'],
    ['مركز المشكلات', 'إدارة', 'إدارة', 'تحرير', 'قراءة'],
    ['الدليل والأسئلة', 'إدارة', 'إدارة', 'تحرير', 'قراءة'],
    ['الخدمات', 'إدارة', 'إدارة', 'تحرير', 'قراءة'],
    ['طلبات العملاء', 'كامل', 'تشغيل', '—', 'متابعة'],
    ['بيانات الدفع', 'كامل', 'قراءة', '—', '—'],
    ['الفريق والأدوار', 'كامل', '—', '—', '—'],
    ['سجل النشاط', 'قراءة', 'قراءة', '—', '—'],
  ];
  return <main className="admin-shell"><header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><span className="admin-role-pill">{ROLE_LABELS[role as AdminRole]}</span></header><div className="admin-main"><Link className="admin-back-link" href="/admin">← العودة للوحة الإدارة</Link><div className="admin-page-heading"><div><span className="admin-eyebrow">PERMISSIONS</span><h1>مصفوفة الصلاحيات</h1><p>الأدوار محددة في قاعدة البيانات وتُفحص عند كل طلب.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>القسم</th><th>مدير عام</th><th>مسؤول</th><th>محرر</th><th>الدعم</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]}>{row.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></div></main>;
}
