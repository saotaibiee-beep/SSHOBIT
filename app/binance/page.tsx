import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArrowUpLeft, BookOpen, HelpCircle, ShieldCheck, Wallet, SearchCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دليل Binance الشامل | شروحات ومقالات وأسئلة شائعة',
  description: 'كل ما تحتاج تعرفه عن Binance في مكان واحد. شروحات التداول والإيداع والسحب وP2P والمقالات والأسئلة الشائعة وحل المشكلات.',
  alternates: { canonical: '/binance' },
};

const terms = ['%binance%', '%باينانس%'];
const matches = (column: string) => terms.map(term => `${column}.ilike.${term}`).join(',');

export default async function BinanceHubPage() {
  const supabase = await createClient();
  const [articlesResult, faqsResult, platformsResult] = await Promise.all([
    supabase.from('articles').select('id,title_ar,slug,excerpt_ar,published_at').eq('status', 'published').or(
      [matches('title_ar'), matches('excerpt_ar'), matches('content_md')].join(',')
    ).order('published_at', { ascending: false }).limit(80),
    supabase.from('faqs').select('id,question_ar,answer_ar,category').eq('is_published', true).or(
      [matches('question_ar'), matches('answer_ar')].join(',')
    ).order('sort_order', { ascending: true }).limit(80),
    supabase.from('platforms').select('id,name,slug,platform_type').eq('is_published', true).or(
      [matches('name'), matches('slug')].join(',')
    ).limit(10),
  ]);
  const articles = articlesResult.data ?? [];
  const faqs = faqsResult.data ?? [];
  const platforms = platformsResult.data ?? [];

  return <main className="inner-page binance-hub" dir="rtl">
    <section className="inner-hero inner-hero-sand"><div className="container inner-hero-content">
      <div className="breadcrumb-lite"><Link href="/">الرئيسية</Link><span>/</span> دليل Binance</div>
      <span className="section-kicker">BINANCE / KNOWLEDGE HUB</span>
      <h1>دليل Binance <em>الشامل.</em></h1>
      <p>الشروحات والمقالات والأسئلة وحلول المشكلات المتعلقة بمنصة Binance في مكان واحد. المحتوى مرتبط بمصادر الموقع الأصلية ويتحدث تلقائياً عند إضافة محتوى جديد.</p>
      <div className="inner-hero-note"><ShieldCheck size={17}/> تأكد من شروط الخدمة وتوفرها في بلد إقامتك قبل التداول.</div>
    </div></section>

    <section className="container inner-content">
      <div className="binance-hub-stats" aria-label="محتويات دليل Binance">
        <a href="#binance-articles"><BookOpen size={20}/><strong>{articles.length}</strong><span>مقال وشرح</span></a>
        <a href="#binance-faqs"><HelpCircle size={20}/><strong>{faqs.length}</strong><span>سؤال وجواب</span></a>
        <a href="#binance-platform"><Wallet size={20}/><strong>{platforms.length}</strong><span>ملف منصة</span></a>
      </div>

      <section id="binance-articles" className="binance-hub-section">
        <div className="inner-section-title"><div><span className="section-kicker">التعلم خطوة بخطوة</span><h2>المقالات والشروحات</h2></div><span className="section-count">{articles.length} منشور</span></div>
        {articlesResult.error ? <p className="binance-hub-empty">تعذر تحميل المقالات حالياً.</p> : articles.length ? <div className="published-grid knowledge-grid">{articles.map(article => <article className="published-card" key={article.id}>
          <span className="article-icon"><BookOpen size={20}/></span><h3>{article.title_ar}</h3><p>{article.excerpt_ar}</p>
          <Link href={`/knowledge/${article.slug}`}>اقرأ الشرح <ArrowUpLeft size={16}/></Link>
        </article>)}</div> : <p className="binance-hub-empty">ما فيه مقالات منشورة عن Binance حالياً. ستظهر هنا تلقائياً بعد نشرها.</p>}
      </section>

      <section id="binance-faqs" className="binance-hub-section">
        <div className="inner-section-title"><div><span className="section-kicker">إجابات عملية</span><h2>الأسئلة الشائعة</h2></div><span className="section-count">{faqs.length} سؤال</span></div>
        {faqsResult.error ? <p className="binance-hub-empty">تعذر تحميل الأسئلة حالياً.</p> : faqs.length ? <div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.id}>
          <summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span><span className="faq-question">{faq.question_ar}</span><span className="faq-plus"/></summary>
          <div className="faq-answer">{faq.answer_ar}</div>
        </details>)}</div> : <p className="binance-hub-empty">ما فيه أسئلة مرتبطة بـ Binance حالياً. راجع <Link href="/faq">الأسئلة الشائعة</Link> لبقية الإجابات.</p>}
      </section>

      <section id="binance-platform" className="binance-hub-section">
        <div className="inner-section-title"><div><span className="section-kicker">معلومات المنصة</span><h2>الدليل الرسمي داخل الموقع</h2></div></div>
        {platformsResult.error ? <p className="binance-hub-empty">تعذر تحميل بيانات الدليل حالياً.</p> : platforms.length ? <div className="published-grid">{platforms.map(platform => <article className="published-card" key={platform.id}>
          <span className="article-icon"><Wallet size={20}/></span><h3>{platform.name}</h3><p>{platform.platform_type}</p>
          <Link href={`/directory/${platform.slug}`}>اطلع على معلومات المنصة <ArrowUpLeft size={16}/></Link>
        </article>)}</div> : <p className="binance-hub-empty">ملف Binance التفصيلي غير منشور حالياً. تقدر تتصفح <Link href="/directory">دليل المنصات والمحافظ</Link>.</p>}
      </section>

      <section className="binance-hub-help"><SearchCheck size={24}/><div><h2>عندك مشكلة في الإيداع أو السحب أو الحساب؟</h2><p>تصفح المشكلات والحلول الموجودة في الموقع أو ابدأ التشخيص لترتيب حالتك.</p></div><div className="binance-hub-actions"><Link href="/problems">مركز المشكلات <ArrowUpLeft size={15}/></Link><Link href="/diagnosis">ابدأ التشخيص <ArrowUpLeft size={15}/></Link></div></section>
      <aside className="binance-hub-warning"><AlertTriangle size={20}/><p>التداول في العملات الرقمية والأسواق المالية ينطوي على مخاطر قد تصل إلى خسارة رأس المال. تأكد من المعلومات والرسوم والشروط والتراخيص المتاحة في بلد إقامتك قبل اتخاذ قرار.</p></aside>
    </section>
  </main>;
}
