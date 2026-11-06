import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { saveFaq } from '@/app/admin/actions';
import { AdminLogoutButton } from '@/components/admin-logout-button';
export const dynamic='force-dynamic';
export default async function FaqAdminPage(){
 const {supabase,user}=await requireAdmin(['super_admin','admin','editor']);
 const {data:items}=await supabase.from('faqs').select('*').order('sort_order').limit(100);
 return <main className="admin-shell"><header className="admin-topbar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span> SSHOBIT <small>CONTROL</small></Link><div className="admin-user-area"><span>{user.email}</span><AdminLogoutButton/></div></header><div className="admin-main"><Link className="admin-back-link" href="/admin">← لوحة الإدارة</Link><div className="admin-page-heading"><div><span className="admin-eyebrow">FAQ MANAGEMENT</span><h1>الأسئلة الشائعة</h1><p>إدارة الأسئلة المنشورة ومسوداتها.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>السؤال</th><th>التصنيف</th><th>الترتيب</th><th>الحالة</th></tr></thead><tbody>{(items??[]).map((x:any)=><tr key={x.id}><td>{x.question_ar}</td><td>{x.category||'—'}</td><td>{x.sort_order}</td><td>{x.is_published?'منشور':'مسودة'}</td></tr>)}</tbody></table></div><form action={saveFaq} className="admin-editor-form"><h2>إضافة سؤال</h2><input name="question_ar" placeholder="السؤال" required/><textarea name="answer_ar" placeholder="الإجابة" required/><input name="category" placeholder="التصنيف"/><input name="sort_order" type="number" defaultValue="0"/><select name="is_published" defaultValue="false"><option value="false">مسودة</option><option value="true">نشر</option></select><button className="admin-submit">حفظ السؤال</button></form></div></main>;
}
