import Link from 'next/link';
import { ArrowUpLeft, ShieldCheck, BookOpen, ScanSearch, Landmark } from 'lucide-react';

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-main">
      <div className="footer-about">
        <Link className="footer-logo" href="/"><img className="site-brand-symbol" src="/sshobit-symbol.svg" alt="" width={58} height={58}/></Link>
        <p>مرجع عربي يشرح المشكلات التي قد تواجه المتداولين أثناء التداول والإيداع والسحب والتحويلات والمحافظ الرقمية.</p>
        <div className="footer-disclaimer"><ShieldCheck size={17}/><span>معلومات توعوية موثقة قدر الإمكان، وليست استشارة مالية أو قانونية.</span></div>
      </div>
      <div className="footer-column"><h3>استكشف</h3><Link href="/problems"><Landmark size={15}/> مركز المشكلات</Link><Link href="/diagnosis"><ScanSearch size={15}/> التشخيص الذكي</Link><Link href="/directory">دليل المنصات والمحافظ</Link></div>
      <div className="footer-column"><h3>المعرفة والمساعدة</h3><Link href="/knowledge"><BookOpen size={15}/> مركز المعرفة</Link><Link href="/faq">الأسئلة الشائعة</Link><Link href="/services">الحلول والخدمات</Link><Link href="/contact">تواصل معنا</Link></div>
      <div className="footer-column"><h3>معلومات قانونية</h3><Link href="/about">من نحن</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">الشروط والأحكام</Link></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} SSHOBIT. جميع الحقوق محفوظة.</span><Link href="/diagnosis">ابدأ بخطوة واضحة <ArrowUpLeft size={14}/></Link></div>
  </footer>;
}
