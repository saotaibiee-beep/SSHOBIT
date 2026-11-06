import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowUpLeft, ShieldCheck, ListChecks, AlertTriangle, CalendarDays } from 'lucide-react';

export default async function ProblemDetail({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;const supabase=await createClient();
 const {data}=await supabase.from('problems').select('title_ar,summary_ar,body_ar,causes,checks,steps,avoid_items,official_contact_guidance,review_date').eq('slug',slug).eq('status','published').maybeSingle();
 if(!data)notFound();
 const sections=[['أسباب محتملة',data.causes],['كيف تتحقق؟',data.checks],['خطوات المعالجة',data.steps],['أخطاء تجنبها',data.avoid_items]] as const;
 return <main className="inner-page"><section className="inner-hero"><div className="container inner-hero-content"><div className="breadcrumb-lite"><Link href="/">الرئيسية</Link> <span>/</span> <Link href="/problems">مركز المشكلات</Link></div><span className="section-kicker">PROBLEM GUIDE / VERIFIED STEPS</span><h1>{data.title_ar}</h1><p>{data.summary_ar}</p><div className="inner-hero-note"><ShieldCheck size={17}/> المعلومات إرشادية، والأسباب المذكورة احتمالات وليست تشخيصاً مؤكداً.</div></div></section><section className="container article-content">{data.body_ar&&<div className="article-lead">{data.body_ar}</div>}{sections.map(([title,values],index)=>values?.length?<section className="article-section" key={title}><div className="article-section-number">0{index+1}</div><div><h2>{title}</h2><ol>{values.map((v:string,i:number)=><li key={i}>{v}</li>)}</ol></div></section>:null)}{data.official_contact_guidance&&<section className="article-contact"><AlertTriangle size={20}/><div><h2>التواصل مع الجهة المعنية</h2><p>{data.official_contact_guidance}</p></div></section>}<div className="article-review"><span><CalendarDays size={15}/> آخر مراجعة: {data.review_date||'غير محدد'}</span><span>لا تضمن المعلومات نتيجة محددة لدى جهة خارجية.</span></div><Link href="/problems" className="article-back">العودة لمركز المشكلات <ArrowUpLeft size={16}/></Link></section></main>;
}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const supabase=await createClient();const {data}=await supabase.from('problems').select('title_ar,seo_title,seo_description,summary_ar').eq('slug',slug).eq('status','published').maybeSingle();return{title:data?.seo_title||data?.title_ar||'دليل المشكلة',description:data?.seo_description||data?.summary_ar};}
