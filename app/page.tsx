import Link from 'next/link';
import { ArrowUpLeft, ArrowLeft, Landmark, Wallet, Network, ShieldCheck, FileSearch, BookOpenCheck, ClipboardList, ScanSearch, LockKeyhole } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { InteractiveVisual } from '@/components/interactive-visual';
import { Reveal } from '@/components/reveal';

const issueAreas = [
  { n: '01', icon: Landmark, title: 'البنوك والتحويلات', desc: 'تأخر الحوالات، طلبات التحقق، ومراجعة العمليات البنكية.', href: '/problems', tone: 'mint' },
  { n: '02', icon: Wallet, title: 'منصات التداول والمحافظ', desc: 'الإيداع والسحب، قيود الحساب، والتحقق من الهوية.', href: '/problems', tone: 'blue' },
  { n: '03', icon: Network, title: 'الشبكات والمعاملات', desc: 'مطابقة الشبكات والعناوين ومعرّفات التحويل.', href: '/problems', tone: 'sand' },
];
const steps = [
  { icon: ClipboardList, n: '01', title: 'صف ما حدث', desc: 'حدد الجهة ونوع المشكلة والرسالة التي ظهرت لك.' },
  { icon: FileSearch, n: '02', title: 'تحقق من المعطيات', desc: 'افصل ما تعرفه عن الاحتمالات، واجمع المراجع المهمة.' },
  { icon: ShieldCheck, n: '03', title: 'اختر الخطوة المناسبة', desc: 'اتبع إجراءً واضحاً من القناة الرسمية ذات الصلة.' },
];
const principles = [
  { icon: ShieldCheck, title: 'وضوح بلا مبالغة', desc: 'نوضح ما هو مؤكد وما يحتاج إلى تحقق، ولا نعد بنتيجة لا نملك ضمانها.' },
  { icon: BookOpenCheck, title: 'مصادر يمكن الرجوع لها', desc: 'نربط الإرشادات بالمصادر الرسمية متى توفرت، مع توضيح حدود المعلومات.' },
  { icon: LockKeyhole, title: 'خصوصيتك أولاً', desc: 'لا نطلب كلمات المرور أو رموز التحقق أو عبارات الاسترداد والمفاتيح الخاصة.' },
];

export default function Home() {
  return <main>
    <section className="home-hero">
      <AnimatedBackground />
      <div className="container home-hero-inner">
        <div className="home-hero-meta"><span className="hero-pill"><i/> منصة عربية مستقلة للمتداولين</span><span className="hero-index">المعرفة أولاً · القرار لك</span></div>
        <div className="home-hero-grid">
          <Reveal className="home-hero-copy">
            <span className="home-eyebrow">حين تتعقد التفاصيل، ابدأ بالفهم</span>
            <h1>افهم المشكلة.<br/><em>وشوف خطوتك.</em></h1>
            <p>منصة تساعدك تفهم مشكلات البنوك والتحويلات ومنصات التداول والمحافظ الرقمية، وتوصل للمعلومة والإجراء المناسب بمصادر واضحة.</p>
            <div className="home-hero-actions"><Link href="/diagnosis" className="home-primary-btn">ابدأ التشخيص <ArrowUpLeft size={18}/></Link><Link href="/problems" className="home-secondary-link">تصفح مركز المشكلات <ArrowLeft size={16}/></Link></div>
            <div className="hero-assurance"><ShieldCheck size={16}/><span>إرشادات توعوية — لا نطلب بياناتك السرية ولا نضمن نتائج الجهات الخارجية</span></div>
          </Reveal>
          <Reveal delay={140} className="home-hero-visual"><InteractiveVisual/></Reveal>
        </div>
        <div className="home-hero-bottom"><span>SSHOBIT / KNOWLEDGE & GUIDANCE</span><span>01 — 04</span></div>
      </div>
    </section>

    <section className="home-areas section-pad">
      <div className="container">
        <Reveal className="section-heading-row"><div><span className="section-kicker">01 / مجالات التغطية</span><h2>وين تحتاج <em>وضوح أكثر؟</em></h2></div><p>ابدأ من المجال الأقرب لحالتك. كل دليل يشرح ما يمكن التحقق منه، وما يستدعي التواصل مع الجهة المختصة.</p></Reveal>
        <div className="area-grid">{issueAreas.map((item,i)=><Reveal key={item.n} delay={i*80}><Link href={item.href} className={'area-card area-'+item.tone}><div className="area-card-top"><span>{item.n}</span><span className="area-icon"><item.icon size={22}/></span></div><div><h3>{item.title}</h3><p>{item.desc}</p></div><span className="area-card-link">استكشف المجال <ArrowUpLeft size={17}/></span></Link></Reveal>)}</div>
      </div>
    </section>

    <section className="home-method section-pad">
      <div className="container method-layout">
        <Reveal className="method-heading"><span className="section-kicker">02 / منهجنا</span><h2>ثلاث خطوات.<br/><em>صورة أوضح.</em></h2><p>ما نعطيك إجابة جاهزة قبل ما نفهم السياق. نساعدك ترتب المعلومات وتعرف وش تتحقق منه أولاً.</p><Link href="/about" className="underlined-link">اعرف مبدأنا <ArrowUpLeft size={16}/></Link></Reveal>
        <div className="steps-stack">{steps.map((step,i)=><Reveal key={step.n} delay={i*80}><article className="method-step"><span className="method-step-number">{step.n}</span><span className="method-step-icon"><step.icon size={21}/></span><div><h3>{step.title}</h3><p>{step.desc}</p></div><ArrowUpLeft className="method-step-arrow" size={18}/></article></Reveal>)}</div>
      </div>
    </section>

    <section className="home-principles section-pad">
      <div className="container">
        <Reveal className="section-heading-row"><div><span className="section-kicker">03 / مبدأنا</span><h2>معلومة موثوقة،<br/><em>بدون وعود زائفة.</em></h2></div><p>نحن منصة معلوماتية مستقلة. لا نمثل البنوك أو منصات التداول أو الجهات التنظيمية، ولا نتحكم في قراراتها.</p></Reveal>
        <div className="principle-grid">{principles.map((item,i)=><Reveal key={item.title} delay={i*80}><article className="principle-card"><span><item.icon size={21}/></span><h3>{item.title}</h3><p>{item.desc}</p></article></Reveal>)}</div>
      </div>
    </section>

    <section className="home-knowledge">
      <div className="container knowledge-layout"><Reveal><span className="section-kicker">04 / مركز المعرفة</span><h2>قبل ما تتخذ قرار،<br/><em>خلّ المعلومة تسبقك.</em></h2><p>أدلة ومقالات عربية تشرح الإجراءات والمفاهيم بخطوات مفهومة، مع توثيق المصادر ومراجعة المحتوى.</p><Link href="/knowledge" className="knowledge-cta">اكتشف مركز المعرفة <ArrowUpLeft size={17}/></Link></Reveal><Reveal delay={130} className="knowledge-visual"><div className="knowledge-orbit"><span/><span/><span/><div><BookOpenCheck size={34}/><b>دليل</b></div></div><div className="knowledge-float-card"><small>KNOWLEDGE BASE</small><strong>معلومة + مصدر + خطوة</strong><span>محتوى قابل للتحقق</span></div></Reveal></div>
    </section>

    <section className="home-final-cta"><div className="container final-cta-inner"><div><span className="section-kicker">ابدأ من هنا</span><h2>لا تستعجل الحل.<br/><em>افهم الحالة أولاً.</em></h2><p>استخدم التشخيص الإرشادي لترتيب المعطيات والحصول على خطوات تحقق أولية.</p></div><Link href="/diagnosis" className="final-cta-button">ابدأ التشخيص الآن <ArrowUpLeft size={19}/></Link><div className="cta-decoration" aria-hidden="true"><ScanSearch size={155}/></div></div></section>
  </main>;
}
