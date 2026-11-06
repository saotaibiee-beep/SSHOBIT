import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const { supabase, user, role } = await requireAdmin();
  if (role !== 'super_admin' && role !== 'admin') redirect('/admin?forbidden=1');
  const { data: events } = await supabase
    .from('admin_audit_logs')
    .select('id,actor_id,action,entity_type,entity_id,metadata,created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return <main className="admin-shell"><header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><div className="admin-user-area"><span>{user.email}</span><AdminLogoutButton /></div></header><div className="admin-main"><Link className="admin-back-link" href="/admin">← العودة للوحة الإدارة</Link><div className="admin-page-heading"><div><span className="admin-eyebrow">AUDIT TRAIL</span><h1>سجل النشاط</h1><p>آخر 100 عملية مسجلة لحسابات الإدارة.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>العملية</th><th>النوع</th><th>معرف المسؤول</th><th>التاريخ</th></tr></thead><tbody>{(events ?? []).map(event=><tr key={event.id}><td>{event.action}</td><td>{event.entity_type}</td><td dir="ltr">{event.actor_id ?? '—'}</td><td>{new Date(event.created_at).toLocaleString('ar-SA')}</td></tr>)}</tbody></table>{(!events || events.length===0) && <p className="admin-empty">لا توجد عمليات مسجلة حتى الآن. ستظهر عمليات الدخول والخروج بعد استخدام لوحة الإدارة.</p>}</div></div></main>;
}
