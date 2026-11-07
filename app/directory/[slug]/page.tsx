import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowUpLeft, ExternalLink, ShieldCheck, Wallet, FileText, AlertTriangle } from 'lucide-react';

type Facts = {
 summary?: string; what_it_offers?: string[]; bank_details?: string; fees?: string;
 eligibility?: string; risks?: string[]; getting_started?: string[];
 referral_url?: string; referral_note?: string;
};
type Source = { label?: string; url?: string };

export default async function PlatformDetail({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const supabase=await createClient();
 const {data,error}=await supabase.from('platforms').select('name,slug,platform_type,official_url,saudi_availability,facts,sources,reviewed_at').eq('slug',slug).eq('is_published',true).maybeSingle();
 if(error||!data) notFound();
 const facts=(data.facts||{}) as Facts; const sources=(data.sources||[]) as Source[];
 return <main className="inner-page">
  <section className="inner-hero inner-hero-sand"><div className="container inner-hero-content">
   <div className="breadcrumb-lite"><Link href="/">الرئيسية</Link> <span>/</span> <Link href="/directory">دليل المنصات</Link> <span>/</span> {data.name}</div>
   <span className="section-kicker">PLATFORM PROFILE / REVIEWED DIRECTORY</span>
   <h1>{data.name}</h1><p>{facts.summary}</p>
   <div className="inner-hero-note"><ShieldCheck size={17}/> {data.platform_type} · تاريخ المراجعة: {data.reviewed_at||'غير محدد'}</div>
   <div className="hero-actions" style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:24}}>
    {data.official_url&&<a className="button button-primary" href={data.official_url} target="_blank" rel="noreferrer">الموقع الرسمي <ExternalLink size={16}/></a>}
    {facts.referral_url&&<a className="button button-secondary" href={facts.referral_url} target="_blank" rel="sponsored nofollow noreferrer">رابط التسجيل <ExternalLink size={16}/></a>}
   </div>
  </div></section>
  <section className="container article-content">
   <section className="article-section"><h2><Wallet size={20}/> وش تقدم الخدمة؟</h2><ul>{(facts.what_it_offers||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></section>
   {facts.bank_details&&<section className="article-section"><h2>طبيعة الحساب والجهة المقدمة</h2><p>{facts.bank_details}</p></section>}
   {facts.fees&&<section className="article-section"><h2>الرسوم والتكاليف</h2><p>{facts.fees}</p></section>}
   {facts.eligibility&&<section className="article-section"><h2>التوفر والأهلية في السعودية</h2><p>{facts.eligibility}</p><p><strong>حالة التوفر:</strong> {data.saudi_availability}</p></section>}
   {facts.getting_started && facts.getting_started.length>0&&<section className="article-section"><h2>كيف تبدأ؟</h2><ol>{facts.getting_started.map((x,i)=><li key={i}>{x}</li>)}</ol></section>}
   {facts.risks && facts.risks.length>0&&<section className="article-section"><h2><AlertTriangle size={20}/> نقاط لازم تنتبه لها</h2><ul>{facts.risks.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
   {facts.referral_note&&<p className="muted">{facts.referral_note} قد يحصل الموقع أو صاحب الرابط على منفعة إحالة عند التسجيل؛ هذا لا يعني اعتماد SSHOBIT للخدمة أو ضمان قبولك.</p>}
   <section className="article-sources"><div className="article-sources-heading"><FileText size={19}/><div><h2>المصادر الرسمية</h2><p>راجع الشروط والرسوم والأهلية مباشرة قبل استخدام الخدمة.</p></div></div><ul>{sources.map((s,i)=><li key={i}><a href={s.url} target="_blank" rel="noreferrer"><span>{s.label||s.url}</span><ExternalLink size={14}/></a></li>)}</ul></section>
   <div className="article-review"><span>معلومات تعريفية وليست توصية مالية أو ضماناً لتوفر الخدمة.</span><Link href="/directory" className="article-back">العودة إلى دليل المنصات <ArrowUpLeft size={16}/></Link></div>
  </section>
 </main>;
}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;const supabase=await createClient();
 const {data}=await supabase.from('platforms').select('name,platform_type').eq('slug',slug).eq('is_published',true).maybeSingle();
 return {title:data?data.name+' | دليل المنصات والمحافظ':'دليل المنصات',description:data?'معلومات عن '+data.name+' وطبيعة الحساب الافتراضي والبطاقة والرسوم والأهلية والمصادر الرسمية.':'دليل المنصات والمحافظ'};
}
