import Link from 'next/link';
import {createClient} from '@/lib/supabase/server';

export const metadata={title:'مركز المشكلات',description:'أدلة عملية لفهم المشكلات الشائعة لدى المتداولين في السعودية.'};

export default async function Page(){
  const supabase=await createClient();
  const {data:problems,error}=await supabase.from('problems').select('id,title_ar,slug,summary_ar,category:problem_categories(name_ar)').eq('status','published').order('created_at',{ascending:false});
  return <main className="section container">
    <div className="eyebrow">مركز المشكلات</div><h1>المشكلات الشائعة</h1>
    <p className="muted">أدلة عملية تساعدك تتحقق من المشكلة وتفهم الخيارات المتاحة، مع الاعتماد على المصادر الرسمية.</p>
    {error?<p className="muted">تعذر تحميل الأدلة حالياً. حاول مرة ثانية لاحقاً.</p>:problems?.length?<div className="principles-grid">{problems.map((item:any)=><article key={item.id}><div className="eyebrow">{item.category?.name_ar||'دليل إرشادي'}</div><h3>{item.title_ar}</h3><p>{item.summary_ar}</p><Link href={`/problems/${item.slug}`}>اقرأ الدليل ←</Link></article>)}</div>:<div className="principles-grid"><article><h3>البنوك والحوالات السعودية</h3><p>تأخر الحوالات وطلبات المستندات وتقييد الخدمات.</p></article><article><h3>منصات التداول والمحافظ</h3><p>الإيداع والسحب والتحقق من الحسابات.</p></article><article><h3>الشبكات والتحويلات الرقمية</h3><p>الشبكات والعناوين ومعرّفات المعاملات.</p></article></div>}
  </main>;
}