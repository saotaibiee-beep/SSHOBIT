'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const roles = [
  { value: 'admin', label: 'مسؤول' },
  { value: 'editor', label: 'محرر' },
  { value: 'support', label: 'الدعم' },
];

export function AdminRoleEditor({ userId, currentRole, isCurrentUser }: { userId: string; currentRole: string; isCurrentUser: boolean }) {
  const [role, setRole] = useState(currentRole);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    if (isCurrentUser || role === currentRole) return;
    setBusy(true);
    setMessage('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('admin_users').update({ role }).eq('user_id', userId);
    if (error) {
      setMessage('تعذر حفظ الدور. تحقق من الصلاحيات.');
      setBusy(false);
      return;
    }
    if (user) await supabase.from('admin_audit_logs').insert({
      actor_id: user.id,
      action: 'admin_role_updated',
      entity_type: 'admin_user',
      entity_id: userId,
      metadata: { role },
    });
    setMessage('تم حفظ الدور');
    setBusy(false);
  }

  return <div className="admin-role-editor"><select aria-label="دور المسؤول" value={role} disabled={isCurrentUser || busy} onChange={e => { setRole(e.target.value); setMessage(''); }}>{roles.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button type="button" onClick={save} disabled={isCurrentUser || busy || role === currentRole}>{busy ? 'حفظ…' : 'حفظ'}</button>{isCurrentUser && <small>لا يمكن تغيير دورك من حسابك الحالي.</small>}{message && <small role="status">{message}</small>}</div>;
}
