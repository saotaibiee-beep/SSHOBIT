import {createClient} from '@/lib/supabase/server';

export const metadata={title:'الأسئلة الشائعة',description:'إجابات واضحة عن الحوالات البنكية والشكاوى وإيداعات الأصول الرقمية والأمان.'};

export default async function FAQPage(){
  const supabase=await createClient();
  const {data,error}=await supabase.from('faqs').select('id,question_ar,answer_ar,category').eq('is_published',true).order('sort_order',{ascending:true});
  return <main className="section container">
    <div className="eyebrow">مركز المساعدة</div>
    <h1>أسئلة تتكرر</h1>
    <p className="muted">إجابات مختصرة تساعدك على فهم الخطوة التالية. راجع دائماً تعليمات الجهة الرسمية لحالتك.</p>
    {error?<p className="muted">تعذر تحميل الأسئلة حالياً. حاول مرة ثانية لاحقاً.</p>:data?.length?<div className="faq-list">{data.map((item:any)=><details className="faq-item" key={item.id}><summary><span>{item.question_ar}</span><small>{item.category||'عام'}</small></summary><div className="faq-answer">{item.answer_ar}</div></details>)}</div>:<p className="muted">سيتم إضافة الأسئلة بعد مراجعة الإجابات ومصادرها.</p>}
    <p className="muted" style={{marginTop:28}}>المعلومات إرشادية ولا تمثل استشارة مالية أو قانونية، ولا تضمن استرداد الأموال أو فك القيود.</p>
  </main>;
}