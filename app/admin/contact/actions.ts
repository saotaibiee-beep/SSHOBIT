'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
export async function updateContactStatus(form:FormData){
 const {supabase}=await requireAdmin(['super_admin','admin','support']);
 const id=String(form.get('id')||''),status=String(form.get('status')||'');
 if(!/^[0-9a-f-]{36}$/i.test(id)||!['new','reviewing','replied','closed'].includes(status))throw new Error('Invalid contact status');
 const {error}=await supabase.from('contact_messages').update({status,updated_at:new Date().toISOString()}).eq('id',id);
 if(error)throw new Error('تعذر تحديث حالة الرسالة');
 revalidatePath('/admin/contact');
}
