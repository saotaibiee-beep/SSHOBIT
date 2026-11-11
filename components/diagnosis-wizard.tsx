'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Landmark, Wallet, Network, ShieldCheck, CircleHelp, CheckCircle2, RotateCcw } from 'lucide-react';

const issueGuidance: Record<string,{steps:string[],href:string,label:string}> = {
 'حوالة متأخرة':{steps:['تحقق من حالة الحوالة وموعد تنفيذها في تطبيق البنك.','احتفظ برقم المرجع وتاريخ التحويل والمبلغ دون نشرها علناً.','تواصل مع البنك المرسل واطلب تتبع الحوالة ورقم البلاغ، ثم صعّد الشكوى عند الحاجة.'],href:'/problems/delayed-bank-transfer',label:'دليل الحوالات المتأخرة'},
 'طلب مستندات':{steps:['اقرأ طلب البنك وحدد نوع المستند والمهلة المحددة.','جهّز المستندات الأصلية التي تثبت مصدر المبلغ والغرض من العملية.','ارفعها فقط عبر القناة الرسمية للبنك واحتفظ برقم الطلب.'],href:'/problems',label:'مركز المشكلات البنكية'},
 'تقييد خدمة':{steps:['تحقق من إشعار البنك لمعرفة الخدمة المتأثرة ونطاق التقييد.','اطلب من البنك سبب التقييد والمتطلبات اللازمة للمراجعة عبر قناة رسمية.','وثّق رقم البلاغ وتابع المدة المتوقعة؛ لا تحاول تجاوز التقييد بحسابات الآخرين.'],href:'/problems',label:'مركز المشكلات'},
 'إيداع ما وصل':{steps:['تحقق من حالة الإرسال وTxID في مستكشف الشبكة الصحيح.','طابق شبكة الإيداع والعنوان وMemo/Tag إن كان مطلوباً.','راجع الحد الأدنى للتأكيدات ثم قدّم تذكرة دعم رسمية مع TxID.'],href:'/problems/crypto-deposit-not-credited',label:'دليل الإيداع غير المضاف'},
 'سحب معلّق':{steps:['افحص حالة السحب وإشعارات التحقق داخل المنصة.','تأكد من الشبكة والعنوان ومتطلبات الأمان ومدة المعالجة المعلنة.','إذا تجاوزت المدة المعلنة، افتح تذكرة رسمية مع معرّف السحب دون مشاركة أسرارك.'],href:'/knowledge/crypto-withdrawal-problems-solutions',label:'حلول مشكلات السحب'},
 'التحقق من الهوية':{steps:['اقرأ سبب الرفض أو الطلب الإضافي داخل التطبيق الرسمي.','تأكد من تطابق الاسم والبيانات ووضوح صور المستندات السارية.','أعد التقديم عبر قناة المنصة الرسمية، ولا تستخدم مستندات أو هويات غير صحيحة.'],href:'/problems',label:'مركز المشكلات'},
 'تحويل معلّق':{steps:['ابحث عن TxID في مستكشف الشبكة وتحقق من حالة المعاملة.','راجع رسوم الشبكة والتأكيدات المطلوبة لدى الجهة المستقبلة.','إذا كانت المعاملة مؤكدة ولم يصل الرصيد، تواصل مع الجهة المستقبلة وأرسل TxID فقط.'],href:'/knowledge/connect-wallet-to-exchange-deposit-withdraw',label:'دليل التحويل بين المحافظ والمنصات'},
 'شبكة غير مطابقة':{steps:['توقف عن إرسال أي مبالغ إضافية إلى العنوان نفسه.','حدد الشبكة المرسلة والمستقبلة والعنوان وTxID بدقة.','تواصل مع دعم الجهة المستقبلة لمعرفة إمكان الاسترداد؛ ليس مضموناً ولا تدفع لجهات تدّعي الاسترجاع.'],href:'/knowledge/match-crypto-network-address-before-transfer',label:'دليل مطابقة الشبكات'},
 'الرصيد ما وصل':{steps:['تأكد من نجاح المعاملة على الشبكة ومن عدد التأكيدات.','تحقق من اختيار الشبكة الصحيحة وإظهار الرمز في المحفظة المستقبلة.','إذا كانت الجهة المستقبلة منصة، افتح بلاغاً رسمياً وأرفق TxID والشبكة.'],href:'/problems/crypto-deposit-not-credited',label:'دليل الرصيد غير المضاف'}
};
const data=[
 {name:'البنك أو الحوالة البنكية',icon:Landmark,issues:['حوالة متأخرة','طلب مستندات','تقييد خدمة'],steps:['راجع حالة العملية من تطبيق البنك الرسمي.','جهّز رقم العملية وتاريخها والمبلغ والإشعار.','اسأل البنك عن المطلوب تحديداً وطريقة تقديمه الرسمية.']},
 {name:'منصة تداول أو محفظة',icon:Wallet,issues:['إيداع ما وصل','سحب معلّق','التحقق من الهوية'],steps:['راجع حالة الخدمة والإشعارات داخل التطبيق الرسمي.','احتفظ برقم الطلب أو TxID دون مشاركة بيانات الدخول.','افتح تذكرة من مركز الدعم الرسمي.']},
 {name:'تحويل أصول رقمية أو شبكة',icon:Network,issues:['تحويل معلّق','شبكة غير مطابقة','الرصيد ما وصل'],steps:['افحص المعاملة في مستكشف الشبكة الصحيح.','طابق الشبكة والعنوان وعدد التأكيدات.','لا تشارك عبارة الاسترداد أو المفتاح الخاص؛ الاسترداد غير مضمون.']}
];

export function DiagnosisWizard(){
 const [area,setArea]=useState(-1);const [issue,setIssue]=useState('');
 const step=area<0?1:!issue?2:3;
 const guidance=issue ? issueGuidance[issue] : undefined;
 return <section className="diagnosis-shell" aria-live="polite">
  <div className="diagnosis-top"><div><span className="section-kicker">SMART DIAGNOSIS / FREE</span><h2>نرتب الحالة معك، خطوة بخطوة.</h2><p>اختر وصفاً عاماً فقط. لا تدخل أرقام حسابات أو بيانات شخصية أو معلومات دخول.</p></div><span className="diagnosis-step-count">0{step} <small>/ 03</small></span></div>
  <div className="diagnosis-progress"><span className={step>=1?'done':''}/><span className={step>=2?'done':''}/><span className={step>=3?'done':''}/></div>
  {area<0?<><div className="diagnosis-question"><span>01 / المجال</span><h3>وين تواجه المشكلة؟</h3><p>اختر الجهة أو الخدمة الأقرب لما حدث.</p></div><div className="diagnosis-options">{data.map((d,i)=><button className="diagnosis-option" key={d.name} onClick={()=>setArea(i)}><span className="diagnosis-option-icon"><d.icon size={21}/></span><span><b>{d.name}</b><small>عرض خيارات التحقق المناسبة</small></span><ArrowLeft size={18}/></button>)}</div></>:!issue?<><div className="diagnosis-question"><span>02 / وصف المشكلة</span><h3>وش أقرب وصف لحالتك؟</h3><p>{data[area].name}</p></div><div className="diagnosis-options">{data[area].issues.map(v=><button className="diagnosis-option" key={v} onClick={()=>setIssue(v)}><span className="diagnosis-option-icon"><CircleHelp size={20}/></span><b>{v}</b><ArrowLeft size={18}/></button>)}</div><button className="diagnosis-back" onClick={()=>setArea(-1)}><ArrowRight size={15}/> رجوع للمجالات</button></>:<><div className="diagnosis-question"><span>03 / خطوات التحقق الأولية</span><h3>ابدأ بهذه الخطوات</h3><p>اختيارك: <b>{issue}</b> — هذه إرشادات عامة وليست تشخيصاً مؤكداً.</p></div><ol className="diagnosis-result-steps">{(guidance?.steps ?? data[area].steps).map((s,i)=><li key={s}><span><CheckCircle2 size={17}/></span><div><small>الخطوة 0{i+1}</small><p>{s}</p></div></li>)}</ol><div className="diagnosis-result-note"><ShieldCheck size={18}/><p>لا تشارك كلمات المرور أو رموز التحقق أو عبارات الاسترداد أو المفاتيح الخاصة مع أي جهة.</p></div>{guidance && <a className="home-primary-btn" href={guidance.href} style={{display:'inline-flex',marginTop:20}}>{guidance.label} <ArrowLeft size={16}/></a>}<button className="diagnosis-back" onClick={()=>{setArea(-1);setIssue('')}}><RotateCcw size={15}/> بدء تشخيص جديد</button></>}
  <div className="diagnosis-bottom"><span>نتيجة إرشادية مجانية</span><span>لا يتم اتخاذ أي إجراء نيابة عنك</span></div>
 </section>;
}
