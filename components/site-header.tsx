'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpLeft, ChevronDown, Menu, X, Landmark, ScanSearch, Wallet, BookOpen, Compass, HelpCircle, Sparkles } from 'lucide-react';

const mainLinks = [
  { href: '/problems', label: 'مركز المشكلات', desc: 'أدلة حسب نوع المشكلة', icon: Landmark },
  { href: '/diagnosis', label: 'التشخيص الذكي', desc: 'رتّب حالتك خطوة بخطوة', icon: ScanSearch },
  { href: '/directory', label: 'دليل المنصات', desc: 'منصات ومحافظ ومعلوماتها', icon: Wallet },
];
const resourceLinks = [
  { href: '/knowledge', label: 'مركز المعرفة', icon: BookOpen },
  { href: '/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { href: '/services', label: 'الحلول والخدمات', icon: Sparkles },
  { href: '/about', label: 'عن SSHOBIT', icon: Compass },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<'explore' | 'resources' | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const close = () => { setOpen(false); setMenu(null); };
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => { if (headerRef.current && !headerRef.current.contains(event.target as Node)) close(); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, []);

  return <header className="site-header" ref={headerRef}>
    <div className="container nav-wrap">
      <Link className="brand" href="/" onClick={close} aria-label="SSHOBIT - الرئيسية"><img className="site-brand-symbol" src="/sshobit-symbol.svg" alt="" width={48} height={48}/></Link>
      <nav className="desktop-nav" aria-label="التنقل الرئيسي">
        <div className="nav-dropdown-wrap">
          <button className={mainLinks.some(x=>isActive(x.href)) ? 'nav-trigger active' : 'nav-trigger'} onClick={()=>setMenu(menu==='explore'?null:'explore')} aria-expanded={menu==='explore'}>استكشف <ChevronDown size={14}/></button>
          {menu==='explore' && <div className="nav-dropdown">{mainLinks.map(item=><Link key={item.href} href={item.href} onClick={close} className={isActive(item.href)?'dropdown-item active':'dropdown-item'}><span className="dropdown-icon"><item.icon size={18}/></span><span><b>{item.label}</b><small>{item.desc}</small></span><ArrowUpLeft size={15}/></Link>)}</div>}
        </div>
        <div className="nav-dropdown-wrap">
          <button className={resourceLinks.some(x=>isActive(x.href)) ? 'nav-trigger active' : 'nav-trigger'} onClick={()=>setMenu(menu==='resources'?null:'resources')} aria-expanded={menu==='resources'}>المصادر <ChevronDown size={14}/></button>
          {menu==='resources' && <div className="nav-dropdown nav-dropdown-small">{resourceLinks.map(item=><Link key={item.href} href={item.href} onClick={close} className={isActive(item.href)?'dropdown-item active':'dropdown-item'}><span className="dropdown-icon"><item.icon size={17}/></span><b>{item.label}</b><ArrowUpLeft size={15}/></Link>)}</div>}
        </div>
        <Link className={isActive('/contact')?'nav-simple active':'nav-simple'} href="/contact">تواصل معنا</Link>
      </nav>
      <div className="nav-actions"><Link className="nav-cta" href="/diagnosis">ابدأ التشخيص <ArrowUpLeft size={15}/></Link><button className="mobile-menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'إغلاق القائمة':'فتح القائمة'} aria-expanded={open}>{open?<X size={21}/>:<Menu size={21}/>}</button></div>
    </div>
    {open && <div className="mobile-nav"><div className="mobile-nav-head"><span>القائمة الرئيسية</span><span className="mobile-nav-caption">استكشف SSHOBIT</span></div><div className="mobile-nav-links">{[...mainLinks,...resourceLinks,{href:'/contact',label:'تواصل معنا',icon:HelpCircle}].map(item=><Link key={item.href} href={item.href} onClick={close} className={isActive(item.href)?'mobile-nav-link active':'mobile-nav-link'}><item.icon size={19}/><span>{item.label}</span><ArrowUpLeft size={15}/></Link>)}</div><Link className="mobile-nav-cta" href="/diagnosis" onClick={close}>ابدأ التشخيص <ArrowUpLeft size={17}/></Link></div>}
    {(menu || open) && <button className="nav-dismiss" aria-label="إغلاق القائمة" onClick={close}/>}
  </header>;
}
