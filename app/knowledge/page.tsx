import Link from 'next/link';
import {createClient} from '@/lib/supabase/server';

export const metadata={title:'مركز المعرفة',description:'مقالات عربية مبسطة حول التداول والتحويلات الرقمية والأمان المالي.'};

export default async function Page(){
  const supabase=await createClient();
  const {data:articles,error}=await supabase.from('articles').select('id,title_ar,slug,excerpt_ar,published_at,category:article_categories(name_ar)').eq('status','published').order('published_at',{ascending:false});
  return <main className="section container">
    <div className="eyebrow">مركز المعرفة</div><h1>مقالات وإرشادات</h1>
    <p className="muted">محتوى عربي واضح، تتم مراجعته وتوثيق مصادره قبل النشر.</p>
    {error?<p className="muted">تعذر تحميل المقالات حالياً. حاول مرة ثانية لاحقاً.</p>:articles?.length?<div className="principles-grid">{articles.map((item:any)=><article key={item.id}><div className="eyebrow">{item.category?.name_ar||'مقال معرفي'}</div><h3>{item.title_ar}</h3><p>{item.excerpt_ar}</p><Link href={`/knowledge/${item.slug}`}>اقرأ المقال ←</Link></article>)}</div>:<p className="muted">نعمل على إعداد المقالات ومراجعتها قبل نشرها. بنضيف المحتوى هنا بعد توثيق مصادره.</p>}
  </main>;
}