'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('admin_audit_logs').insert({ actor_id: user.id, action: 'admin_logout', entity_type: 'auth', metadata: {} });
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }
  return <button type="button" className="admin-logout" onClick={logout}>تسجيل الخروج</button>;
}
