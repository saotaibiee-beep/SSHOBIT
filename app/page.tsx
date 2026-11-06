import Link from 'next/link';
import {ArrowUpLeft,ArrowDownLeft,ShieldCheck,Landmark,Wallet,Network,BookOpen} from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { InteractiveVisual } from '@/components/interactive-visual';
import { Reveal } from '@/components/reveal';

const issues=[
 {n:'01',icon:Landmark,title:'البنوك والتحويلات',desc:'تأخر الحوالات، طلبات التحقق، ومراجعة العمليات.',href:'/problems'},
 {n:'02',icon:Wallet,title:'منصات التداول والمحافظ',desc:'الإيداع والسحب، قيود الحساب، والتحقق من الهوية.',href:'/problems'},
 {n:'03',icon:Network,title:'الشبكات والمعاملات',desc:'الشبكات الرقمية، عناوين الإرسال، ومعرّفات التحويل.',href:'/problems'}
];
export default function Home(){return <main>
 <section className="front-hero front-hero-live"><AnimatedBackground/><div className="container front-content">
  <div className="front-kicker"><span>منصة عربية مستقلة</span></div>
  <div className="front-grid">
   <Reveal className="front-copy"><p className="eyebrow">افهم ما يحدث. ثم قرر.</p><h1>المشكلة المالية<br/>تحتاج <i>وضوحاً،</i><br/>مو تخمين.</h1><p className="front-lead">مرجع عملي يساعد المتداولين على فهم مشكلات البنوك والتحويلات والمنصات والمحافظ الرقمية، والتحقق من الخيارات المتاحة بخطوات واضحة ومصادر موثوقة.</p><div className="front-actions"><Link className="button button-primary" href="/diagnosis">ابدأ التشخيص <ArrowUpLeft size={17}/></Link><Link className="text-link" href="/problems">استكشف مركز المشكلات <ArrowDownLeft size={16}/></Link></div></Reveal>
   <Reveal delay={140}><InteractiveVisual/></Reveal>
  </div>
  <div className="hero-foot"><span>معلومات مبنية على مصادر، لا وعود بالنتائج</span><span>01 / 04</span></div>
 </div></section>
 <section className="issues-section"><div className="container"><Reveal><div className="section-intro"><div><span className="eyebrow">استكشف حسب الموضوع</span><h2>وش اللي تواجهه؟</h2></div><p>ابدأ من المجال الأقرب لمشكلتك، واقرأ ما تحتاجه قبل اتخاذ أي إجراء.</p></div></Reveal><div className="issue-list">{issues.map((item,i)=><Reveal key={item.n} delay={i*70}><Link href={item.href} className="issue-row"><span className="issue-number">{item.n}</span><span className="issue-icon"><item.icon size={22}/></span><span className="issue-copy"><b>{item.title}</b><small>{item.desc}</small></span><ArrowUpLeft className="issue-arrow" size={20}/></Link></Reveal>)}</div></div></section>
 <section className="method-section"><div className="container method-grid"><Reveal><div className="method-stamp"><span>مبدأنا</span><b>لا تتصرف<br/>قبل أن تفهم.</b><small>CLARITY BEFORE ACTION</small></div></Reveal><Reveal delay={120}><div className="method-copy"><span className="eyebrow">كيف نعمل</span><h2>نرتب الصورة<br/>قبل ما نقترح الخطوة.</h2><p>نوضح لك ما هو مؤكد وما يزال احتمالاً، ونفصل بين إجراءات الجهات الرسمية والمعلومات العامة. لا نطلب كلمات المرور أو رموز التحقق أو المفاتيح الخاصة.</p><div className="method-points"><span><ShieldCheck size={17}/> مصادر رسمية قدر الإمكان</span><span><BookOpen size={17}/> خطوات قابلة للتحقق</span></div><Link href="/about" className="text-link">تعرف على منهجنا <ArrowUpLeft size={16}/></Link></div></Reveal></div></section>
 <section className="knowledge-strip"><div className="container knowledge-inner"><div><span className="eyebrow">من مركز المعرفة</span><h2>المعلومة الجيدة<br/>تختصر عليك الطريق.</h2></div><p>مقالات وأدلة تشرح المفاهيم والإجراءات بلغة واضحة، مع توثيق المصادر ومراجعة المحتوى.</p><Link className="button button-dark" href="/knowledge">اقرأ المعرفة <ArrowUpLeft size={17}/></Link></div></section>
 </main>}
