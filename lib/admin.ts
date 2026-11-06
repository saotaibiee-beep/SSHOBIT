import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const ADMIN_ROLES = ['super_admin', 'admin', 'editor', 'support'] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'مدير عام',
  admin: 'مسؤول',
  editor: 'محرر',
  support: 'الدعم',
};

export async function getAdminContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null, role: null as AdminRole | null };

  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  const role = data?.role && ADMIN_ROLES.includes(data.role as AdminRole)
    ? data.role as AdminRole
    : null;

  return { supabase, user, role };
}

export async function requireAdmin(allowed?: AdminRole[]) {
  const context = await getAdminContext();
  if (!context.user) redirect('/admin/login');
  if (!context.role) redirect('/admin/login?denied=1');
  if (allowed && !allowed.includes(context.role)) redirect('/admin?forbidden=1');
  return context as typeof context & { user: NonNullable<typeof context.user>; role: AdminRole };
}
