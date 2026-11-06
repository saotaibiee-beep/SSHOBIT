import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { saveArticle, saveProblem } from '@/app/admin/actions';
import { AdminLogoutButton } from '@/components/admin-logout-button';
export const dynamic = 'force-dynamic';

function EditArticle({r}:{r:any}) {
 return <details className="admin-editor-form" id={'edit-'+r.id}><summary>تعديل: {r.title_ar}</summary><form action={saveArticle}>
  <input type="hidden" name="id" value={r.id}/>
  <input name="title_ar" defaultValue={r.title_ar} placeholder="عنوان المقال" required/>
  <input name="slug" defaultValue={r.slug} placeholder="slug" dir="ltr" required/>
  <textarea name="excerpt_ar" defaultValue={r.excerpt_ar??''} placeholder="مقدمة المقال"/>
  <textarea name="content_md" defaultValue={r.content_md??''} placeholder="محتوى المقال بصيغة Markdown" rows={9} required/>
  <input name="seo_title" defaultValue={r.seo_title??''} placeholder="عنوان SEO"/>
  <textarea name="seo_description" defaultValue={r.seo_description??''} placeholder="وصف SEO"/>
  <select name="status" defaultValue={r.status}><option value="draft">مسودة</option><option value="published">نشر</option><option value="archived">أرشفة</option></select>
  <button className="admin-submit">حفظ التعديلات</button>
 </form></details>;
}
function EditProblem({r}:{r:any}) {
 return <details className="admin-editor-form" id={'edit-'+r.id}><summary>تعديل: {r.title_ar}</summary><form action={saveProblem}>
  <input type="hidden" name="id" value={r.id}/>
  <input name="title_ar" defaultValue={r.title_ar} placeholder="عنوان المشكلة" required/>
  <input name="slug" defaultValue={r.slug} placeholder="slug" dir="ltr" required/>
  <textarea name="summary_ar" defaultValue={r.summary_ar??''} placeholder="ملخص مختصر" required/>
  <textarea name="body_ar" defaultValue={r.body_ar??''} placeholder="شرح المشكلة"/>
  <textarea name="causes" defaultValue={(r.causes??[]).join('\n')} placeholder="الأسباب المحتملة — كل سبب في سطر"/>
  <textarea name="checks" defaultValue={(r.checks??[]).join('\n')} placeholder="خطوات التحقق — كل خطوة في سطر"/>
  <textarea name="steps" defaultValue={(r.steps??[]).join('\n')} placeholder="خطوات المعالجة — كل خطوة في سطر"/>
  <textarea name="avoid_items" defaultValue={(r.avoid_items??[]).join('\n')} placeholder="أخطاء يجب تجنبها — كل نقطة في سطر"/>
  <textarea name="official_contact_guidance" defaultValue={r.official_contact_guidance??''} placeholder="متى تتواصل مع الجهة الرسمية؟"/>
  <input type="date" name="review_date" defaultValue={r.review_date??''}/>
  <select name="status" defaultValue={r.status}><option value="draft">مسودة</option><option value="published">نشر</option><option value="archived">أرشفة</option></select>
  <button className="admin-submit">حفظ التعديلات</button>
 </form></details>;
}
export default async function ContentPage({searchParams}:{searchParams:Promise<{type?:string}>}) {
 const {supabase,user}=await requireAdmin(['super_admin','admin','editor']);
 const type=(await searchParams).type==='problems'?'problems':'articles';
 const {data:rows}=await supabase.from(type).select('*').order('created_at',{ascending:false}).limit(50);
 const isProblem=type==='problems';
 return <main className="admin-shell">
  <header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><div className="admin-user-area"><span>{user.email}</span><AdminLogoutButton/></div></header>
  <div className="admin-main">
   <Link className="admin-back-link" href="/admin">← لوحة الإدارة</Link>
   <div className="admin-page-heading"><div><span className="admin-eyebrow">CONTENT WORKSPACE</span><h1>إدارة المحتوى</h1><p>تعديل المقالات وأدلة المشكلات، مع إمكانية إلغاء النشر أو الأرشفة.</p></div></div>
   <nav className="admin-tabs"><Link className={!isProblem?'active':''} href="/admin/content">المقالات</Link><Link className={isProblem?'active':''} href="/admin/content?type=problems">أدلة المشكلات</Link></nav>
   <section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>العنوان</th><th>الرابط</th><th>الحالة</th><th>تاريخ الإنشاء</th><th>إجراء</th></tr></thead><tbody>
    {(rows??[]).map((r:any)=><tr key={r.id}><td>{r.title_ar}</td><td dir="ltr">{r.slug}</td><td>{r.status}</td><td>{new Date(r.created_at).toLocaleDateString('ar-SA')}</td><td><a href={'#edit-'+r.id}>تعديل</a></td></tr>)}
   </tbody></table>{!rows?.length&&<p className="admin-empty">لا توجد سجلات بعد.</p>}</section>
   <div className="admin-editor-grid">{(rows??[]).map((r:any)=>isProblem?<EditProblem key={r.id} r={r}/>:<EditArticle key={r.id} r={r}/>)}</div>
   {isProblem?<form action={saveProblem} className="admin-editor-form"><h2>إضافة دليل مشكلة</h2><input name="title_ar" placeholder="عنوان المشكلة" required/><input name="slug" placeholder="slug-الرابط" dir="ltr" required/><textarea name="summary_ar" placeholder="ملخص مختصر" required/><textarea name="body_ar" placeholder="شرح المشكلة"/><textarea name="causes" placeholder="الأسباب المحتملة — كل سبب في سطر"/><textarea name="checks" placeholder="خطوات التحقق — كل خطوة في سطر"/><textarea name="steps" placeholder="خطوات المعالجة — كل خطوة في سطر"/><textarea name="avoid_items" placeholder="أخطاء يجب تجنبها — كل نقطة في سطر"/><textarea name="official_contact_guidance" placeholder="متى تتواصل مع الجهة الرسمية؟"/><input type="date" name="review_date"/><select name="status" defaultValue="draft"><option value="draft">مسودة</option><option value="published">نشر</option><option value="archived">أرشفة</option></select><button className="admin-submit">حفظ دليل المشكلة</button></form>:<form action={saveArticle} className="admin-editor-form"><h2>إضافة مقال</h2><input name="title_ar" placeholder="عنوان المقال" required/><input name="slug" placeholder="slug-الرابط" dir="ltr" required/><textarea name="excerpt_ar" placeholder="مقدمة المقال"/><textarea name="content_md" placeholder="محتوى المقال بصيغة Markdown" rows={9} required/><input name="seo_title" placeholder="عنوان SEO"/><textarea name="seo_description" placeholder="وصف SEO"/><select name="status" defaultValue="draft"><option value="draft">مسودة</option><option value="published">نشر</option><option value="archived">أرشفة</option></select><button className="admin-submit">حفظ المقال</button></form>}
  </div>
 </main>;
}
