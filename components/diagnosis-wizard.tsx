'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Landmark, Wallet, Network, ShieldCheck, CircleHelp, CheckCircle2, RotateCcw } from 'lucide-react';

const data=[
 {name:'البنك أو الحوالة البنكية',icon:Landmark,issues:['حوالة متأخرة','طلب مستندات','تقييد خدمة'],steps:['راجع حالة العملية من تطبيق البنك الرسمي.','جهّز رقم العملية وتاريخها والمبلغ والإشعار.','اسأل البنك عن المطلوب تحديداً وطريقة تقديمه الرسمية.']},
 {name:'منصة تداول أو محفظة',icon:Wallet,issues:['إيداع ما وصل','سحب معلّق','التحقق من الهوية'],steps:['راجع حالة الخدمة والإشعارات داخل التطبيق الرسمي.','احتفظ برقم الطلب أو TxID دون مشاركة بيانات الدخول.','افتح تذكرة من مركز الدعم الرسمي.']},
 {name:'تحويل أصول رقمية أو شبكة',icon:Network,issues:['تحويل معلّق','شبكة غير مطابقة','الرصيد ما وصل'],steps:['افحص المعاملة في مستكشف الشبكة الصحيح.','طابق الشبكة والعنوان وعدد التأكيدات.','لا تشارك عبارة الاسترداد أو المفتاح الخاص؛ الاسترداد غير مضمون.']}
];

export function DiagnosisWizard(){
 const [area,setArea]=useState(-1);const [issue,setIssue]=useState('');
 const step=area<0?1:!issue?2:3;
 return <section className="diagnosis-shell" aria-live="polite">
  <div className="diagnosis-top"><div><span className="section-kicker">SMART DIAGNOSIS / FREE</span><h2>نرتب الحالة معك، خطوة بخطوة.</h2><p>اختر وصفاً عاماً فقط. لا تدخل أرقام حسابات أو بيانات شخصية أو معلومات دخول.</p></div><span className="diagnosis-step-count">0{step} <small>/ 03</small></span></div>
  <div className="diagnosis-progress"><span className={step>=1?'done':''}/><span className={step>=2?'done':''}/><span className={step>=3?'done':''}/></div>
  {area<0?<><div className="diagnosis-question"><span>01 / المجال</span><h3>وين تواجه المشكلة؟</h3><p>اختر الجهة أو الخدمة الأقرب لما حدث.</p></div><div className="diagnosis-options">{data.map((d,i)=><button className="diagnosis-option" key={d.name} onClick={()=>setArea(i)}><span className="diagnosis-option-icon"><d.icon size={21}/></span><span><b>{d.name}</b><small>عرض خيارات التحقق المناسبة</small></span><ArrowLeft size={18}/></button>)}</div></>:!issue?<><div className="diagnosis-question"><span>02 / وصف المشكلة</span><h3>وش أقرب وصف لحالتك؟</h3><p>{data[area].name}</p></div><div className="diagnosis-options">{data[area].issues.map(v=><button className="diagnosis-option" key={v} onClick={()=>setIssue(v)}><span className="diagnosis-option-icon"><CircleHelp size={20}/></span><b>{v}</b><ArrowLeft size={18}/></button>)}</div><button className="diagnosis-back" onClick={()=>setArea(-1)}><ArrowRight size={15}/> رجوع للمجالات</button></>:<><div className="diagnosis-question"><span>03 / خطوات التحقق الأولية</span><h3>ابدأ بهذه الخطوات</h3><p>اختيارك: <b>{issue}</b> — هذه إرشادات عامة وليست تشخيصاً مؤكداً.</p></div><ol className="diagnosis-result-steps">{data[area].steps.map((s,i)=><li key={s}><span><CheckCircle2 size={17}/></span><div><small>الخطوة 0{i+1}</small><p>{s}</p></div></li>)}</ol><div className="diagnosis-result-note"><ShieldCheck size={18}/><p>لا تشارك كلمات المرور أو رموز التحقق أو عبارات الاسترداد أو المفاتيح الخاصة مع أي جهة.</p></div><button className="diagnosis-back" onClick={()=>{setArea(-1);setIssue('')}}><RotateCcw size={15}/> بدء تشخيص جديد</button></>}
  <div className="diagnosis-bottom"><span>نتيجة إرشادية مجانية</span><span>لا يتم اتخاذ أي إجراء نيابة عنك</span></div>
 </section>;
}
