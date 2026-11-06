import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

export default async function ArticleDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const supabase=await createClient();
  const {data}=await supabase.from('articles').select('title_ar,excerpt_ar,content_md,article_sources(label,url,checked_at)').eq('slug',slug).eq('status','published').maybeSingle();
  if(!data) notFound();
  return <main className="section container"><div className="eyebrow">مركز المعرفة</div><h1>{data.title_ar}</h1>{data.excerpt_ar&&<p className="muted">{data.excerpt_ar}</p>}<article><div style={{whiteSpace:'pre-wrap'}}>{data.content_md}</div></article><section className="section"><h2>المصادر والمراجع</h2>{data.article_sources?.length?<ul>{data.article_sources.map((source:any,i:number)=><li key={i}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>:<p className="muted">لم تُضف مصادر لهذا المقال بعد.</p>}</section></main>;
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const supabase=await createClient(); const {data}=await supabase.from('articles').select('title_ar,seo_title,seo_description,excerpt_ar').eq('slug',slug).eq('status','published').maybeSingle(); return {title:data?.seo_title||data?.title_ar||'مقال معرفي',description:data?.seo_description||data?.excerpt_ar}; }
