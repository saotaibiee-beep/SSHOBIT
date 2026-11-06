'use client';

import { useState, type PointerEvent } from 'react';
import { ArrowLeft, CheckCircle2, CircleHelp, ScanSearch, ShieldCheck, Wallet } from 'lucide-react';

const stages = [
  { label: 'وصف المشكلة', title: 'ابدأ بالتفاصيل المهمة', body: 'حدد أين ظهرت المشكلة، ومتى بدأت، وما الرسالة التي ظهرت لك.', icon: CircleHelp },
  { label: 'ترتيب الاحتمالات', title: 'افصل المؤكد عن المحتمل', body: 'نرتب الأسباب الممكنة ونوضح ما الذي يمكن التحقق منه قبل أي إجراء.', icon: ScanSearch },
  { label: 'الخطوة التالية', title: 'تحرك بمعلومة أوضح', body: 'تحصل على خطوات عملية ومراجع موثوقة، دون مشاركة بياناتك السرية.', icon: ShieldCheck }
];

export function InteractiveVisual() {
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientX - rect.left) / rect.width - .5) * 5, y: ((event.clientY - rect.top) / rect.height - .5) * -5 });
  };
  const Icon = stages[active].icon;
  return <div className="interactive-visual" onPointerMove={onPointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} style={{ transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}>
    <div className="visual-topline"><span>SSHOBIT / SMART PATH</span><span className="live-indicator"><i/> مسار تفاعلي</span></div>
    <div className="visual-core">
      <div className="visual-rings"><span/><span/><span/></div>
      <div className="visual-center"><Icon size={29}/><b>SH</b></div>
      <span className="visual-orbit-label label-one">تحقق</span><span className="visual-orbit-label label-two">افهم</span><span className="visual-orbit-label label-three">قرر</span>
    </div>
    <div className="visual-progress" aria-label="مراحل التشخيص">
      {stages.map((stage, index) => <button key={stage.label} type="button" className={index === active ? 'active' : index < active ? 'done' : ''} onClick={() => setActive(index)} aria-pressed={index === active}><span>{index < active ? <CheckCircle2 size={14}/> : `0${index + 1}`}</span>{stage.label}</button>)}
    </div>
    <div className="visual-detail" aria-live="polite"><div><small>المرحلة 0{active + 1} / 03</small><h3>{stages[active].title}</h3><p>{stages[active].body}</p></div><button type="button" className="visual-next" onClick={() => setActive((active + 1) % stages.length)} aria-label="المرحلة التالية"><ArrowLeft size={18}/></button></div>
    <div className="visual-foot"><Wallet size={14}/> لا تشارك كلمات المرور أو رموز التحقق أو المفاتيح الخاصة</div>
  </div>;
}
