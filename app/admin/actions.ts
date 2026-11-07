'use server';

import { revalidatePath } from 'next/cache';
import { getAdminContext, type AdminRole } from '@/lib/admin';

async function context(allowed: AdminRole[]) {
  const ctx = await getAdminContext();
  if (!ctx.user || !ctx.role || !allowed.includes(ctx.role)) throw new Error('غير مصرح');
  return ctx as typeof ctx & { user: NonNullable<typeof ctx.user>; role: AdminRole };
}
function value(form: FormData, key: string) { return String(form.get(key) ?? '').trim(); }
function list(form: FormData, key: string) { return value(form,key).split('\n').map(x=>x.trim()).filter(Boolean); }
async function audit(supabase: any, userId: string, action: string, type: string, id?: string) {
  const { error } = await supabase.from('admin_audit_logs').insert({actor_id:userId,action,entity_type:type,entity_id:id??null,metadata:{}});
  if (error) throw new Error('تعذر تسجيل العملية في سجل الإدارة: ' + error.message);
}

export async function saveArticle(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin','editor']);
  const id=value(form,'id'), status=value(form,'status')||'draft';
  if (!['draft','published','archived'].includes(status)) throw new Error('حالة المقال غير صحيحة');
  const row={title_ar:value(form,'title_ar'),slug:value(form,'slug'),excerpt_ar:value(form,'excerpt_ar')||null,content_md:value(form,'content_md'),status,seo_title:value(form,'seo_title')||null,seo_description:value(form,'seo_description')||null};
  if(!row.title_ar||!row.slug||!row.content_md) throw new Error('العنوان والرابط والمحتوى مطلوبة');
  let result;
  if (id) {
    const existing = await supabase.from('articles').select('published_at').eq('id',id).maybeSingle();
    if (existing.error || !existing.data) throw new Error('المقال المطلوب غير موجود أو لا يمكن قراءته');
    const publishedAt = status === 'draft' ? null : (existing.data.published_at || new Date().toISOString());
    result = await supabase.from('articles').update({...row,published_at:publishedAt,updated_at:new Date().toISOString()}).eq('id',id).select('id').single();
  } else {
    result = await supabase.from('articles').insert({...row,author_id:user.id,published_at:status==='draft'?null:new Date().toISOString()}).select('id').single();
  }
  if(result.error) throw new Error('تعذر حفظ المقال: '+result.error.message);
  await audit(supabase,user.id,id?'article_updated':'article_created','article',result.data.id);
  revalidatePath('/admin/content'); revalidatePath('/knowledge'); revalidatePath('/sitemap.xml');
}

export async function saveProblem(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin','editor']);
  const id=value(form,'id'), status=value(form,'status')||'draft';
  if (!['draft','published','archived'].includes(status)) throw new Error('حالة دليل المشكلة غير صحيحة');
  const row={title_ar:value(form,'title_ar'),slug:value(form,'slug'),summary_ar:value(form,'summary_ar'),body_ar:value(form,'body_ar')||null,causes:list(form,'causes'),checks:list(form,'checks'),steps:list(form,'steps'),avoid_items:list(form,'avoid_items'),official_contact_guidance:value(form,'official_contact_guidance')||null,review_date:value(form,'review_date')||null,status,seo_title:value(form,'seo_title')||null,seo_description:value(form,'seo_description')||null};
  if(!row.title_ar||!row.slug||!row.summary_ar) throw new Error('العنوان والرابط والملخص مطلوبة');
  const result=id?await supabase.from('problems').update({...row,updated_at:new Date().toISOString()}).eq('id',id).select('id').single():await supabase.from('problems').insert(row).select('id').single();
  if(result.error) throw new Error('تعذر حفظ دليل المشكلة: '+result.error.message);
  await audit(supabase,user.id,id?'problem_updated':'problem_created','problem',result.data.id);
  revalidatePath('/admin/content'); revalidatePath('/problems'); revalidatePath('/sitemap.xml');
}

export async function saveFaq(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin','editor']);
  const id=value(form,'id'), row={question_ar:value(form,'question_ar'),answer_ar:value(form,'answer_ar'),category:value(form,'category')||null,sort_order:Number(value(form,'sort_order')||0),is_published:value(form,'is_published')==='true'};
  if(!row.question_ar||!row.answer_ar) throw new Error('السؤال والإجابة مطلوبان');
  const result=id?await supabase.from('faqs').update(row).eq('id',id).select('id').single():await supabase.from('faqs').insert(row).select('id').single();
  if(result.error) throw new Error('تعذر حفظ السؤال: '+result.error.message);
  await audit(supabase,user.id,id?'faq_updated':'faq_created','faq',result.data.id);
  revalidatePath('/admin/faqs'); revalidatePath('/faq');
}

export async function saveService(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin']);
  const id=value(form,'id'), row={name_ar:value(form,'name_ar'),slug:value(form,'slug'),description_ar:value(form,'description_ar'),scope_ar:value(form,'scope_ar')||null,price:value(form,'price')?Number(value(form,'price')):null,currency:value(form,'currency')||'SAR',is_active:value(form,'is_active')==='true',requires_human_review:value(form,'requires_human_review')!=='false'};
  if(!row.name_ar||!row.slug||!row.description_ar) throw new Error('اسم الخدمة والرابط والوصف مطلوبة');
  if(row.price!==null&&(!Number.isFinite(row.price)||row.price<0)) throw new Error('السعر غير صحيح');
  const result=id?await supabase.from('services').update(row).eq('id',id).select('id').single():await supabase.from('services').insert(row).select('id').single();
  if(result.error) throw new Error('تعذر حفظ الخدمة: '+result.error.message);
  await audit(supabase,user.id,id?'service_updated':'service_created','service',result.data.id);
  revalidatePath('/admin/operations'); revalidatePath('/services');
}

export async function savePlatform(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin','editor']);
  const id=value(form,'id'), row={name:value(form,'name'),slug:value(form,'slug'),platform_type:value(form,'platform_type'),official_url:value(form,'official_url')||null,saudi_availability:value(form,'saudi_availability')||null,facts:{summary:value(form,'facts')},sources:value(form,'sources').split('\n').map(x=>x.trim()).filter(Boolean).map(url=>({url})),reviewed_at:value(form,'reviewed_at')||null,is_published:value(form,'is_published')==='true'};
  if(!row.name||!row.slug||!row.platform_type) throw new Error('الاسم والرابط والنوع مطلوبة');
  const result=id?await supabase.from('platforms').update(row).eq('id',id).select('id').single():await supabase.from('platforms').insert(row).select('id').single();
  if(result.error) throw new Error('تعذر حفظ المنصة: '+result.error.message);
  await audit(supabase,user.id,id?'platform_updated':'platform_created','platform',result.data.id);
  revalidatePath('/admin/directory'); revalidatePath('/directory');
}

export async function updateRequest(form: FormData) {
  const {supabase,user}=await context(['super_admin','admin','support']);
  const id=value(form,'id'), status=value(form,'status');
  // Payment confirmation and refunds must come only from a verified payment-provider workflow.
  const allowed=['pending_payment','under_review','in_progress','waiting_for_customer','completed','cancelled'];
  if(!id||!allowed.includes(status)) throw new Error('الحالة غير مسموحة من لوحة التشغيل. تأكيد الدفع والاسترداد يتطلبان تحققاً مالياً مستقلاً.');
  const {error}=await supabase.from('service_requests').update({status,updated_at:new Date().toISOString()}).eq('id',id);
  if(error) throw new Error('تعذر تحديث الطلب: '+error.message);
  const note=value(form,'note');
  if(note) {
    const n=await supabase.from('service_request_internal_notes').insert({request_id:id,author_id:user.id,note});
    if(n.error) throw new Error('تم تحديث الحالة لكن تعذرت إضافة الملاحظة: '+n.error.message);
  }
  await audit(supabase,user.id,'service_request_status_updated','service_request',id);
  revalidatePath('/admin/operations');
}

export async function addAdminByUid(form: FormData) {
  const {supabase,user}=await context(['super_admin']);
  const userId=value(form,'user_id'), role=value(form,'role');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) throw new Error('معرف المستخدم غير صحيح');
  if(!['admin','editor','support'].includes(role)) throw new Error('الدور غير مسموح');
  const {error}=await supabase.from('admin_users').insert({user_id:userId,role});
  if(error) throw new Error('تعذرت إضافة المسؤول. تأكد من أن الحساب موجود في Supabase Auth وأنه غير مضاف مسبقاً.');
  await audit(supabase,user.id,'admin_user_added','admin_user',userId);
  revalidatePath('/admin/users');
}
