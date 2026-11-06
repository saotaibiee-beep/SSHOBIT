import {notFound} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

export default async function ProblemDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const supabase=await createClient();
  const {data}=await supabase.from('problems').select('title_ar,summary_ar,body_ar,causes,checks,steps,avoid_items,official_contact_guidance,review_date').eq('slug',slug).eq('status','published').maybeSingle();
  if(!data) notFound();
  const sections=[['أسباب محتملة',data.causes],['كيف تتحقق؟',data.checks],['خطوات المعالجة',data.steps],['أخطاء تجنبها',data.avoid_items]] as const;
  return <main className="section container"><div className="eyebrow">مركز المشكلات</div><h1>{data.title_ar}</h1><p className="muted">{data.summary_ar}</p>{data.body_ar&&<article><p>{data.body_ar}</p></article>}{sections.map(([title,values])=>values?.length?<section className="section" key={title}><h2>{title}</h2><ol>{values.map((v:string,i:number)=><li key={i}>{v}</li>)}</ol></section>:null)}{data.official_contact_guidance&&<article><h2>التواصل مع الجهة المعنية</h2><p>{data.official_contact_guidance}</p></article>}<p className="muted">آخر مراجعة: {data.review_date||'غير محدد'}. المعلومات إرشادية ولا تضمن نتيجة محددة.</p></main>;
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const supabase=await createClient(); const {data}=await supabase.from('problems').select('title_ar,seo_title,seo_description,summary_ar').eq('slug',slug).eq('status','published').maybeSingle(); return {title:data?.seo_title||data?.title_ar||'دليل المشكلة',description:data?.seo_description||data?.summary_ar}; }
