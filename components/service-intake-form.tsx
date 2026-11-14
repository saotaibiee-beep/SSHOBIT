'use client';
import { useState, type FormEvent } from 'react';
const options=[{value:'deposit_withdrawal',label:'تحليل مشكلات الإيداع والسحب — $21'},{value:'p2p_dispute',label:'تحليل نزاعات P2P — $27'},{value:'bank_restriction',label:'تحليل تقييد الحساب البنكي — $40'}];
export function ServiceIntakeForm(){
 const [loading,setLoading]=useState(false);
 const [message,setMessage]=useState('');
 const [success,setSuccess]=useState(false);
 const [paying,setPaying]=useState(false);
 const [payment,setPayment]=useState<{id:string,email:string}|null>(null);
 async function pay(){if(!payment||paying)return;setPaying(true);setMessage('جارٍ فتح PayPal...');try{const res=await fetch('/api/paypal/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:payment.id,email:payment.email})});const data=await res.json();if(res.ok&&data.approveUrl){window.location.assign(data.approveUrl);return;}setMessage(data.error||'الدفع غير متاح مؤقتاً. تم الاحتفاظ بطلبك.');}catch{setMessage('تعذر الاتصال بخدمة الدفع. تم الاحتفاظ بطلبك.');}finally{setPaying(false);}}
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(loading)return;
  const form=e.currentTarget;const data=new FormData(form);
  setLoading(true);setMessage('');
  try{const res=await fetch('/api/service-intake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({service:data.get('service'),name:data.get('name'),email:data.get('email'),summary:data.get('summary'),website:data.get('website')})});
   const result=await res.json();setMessage(result.message||result.error||'تعذر إرسال الطلب');setSuccess(res.ok);if(res.ok){setPayment({id:result.requestId,email:String(data.get('email')).trim().toLowerCase()});form.reset();}
  }catch{setMessage('تعذر الاتصال. حاول مرة أخرى.');setSuccess(false);}finally{setLoading(false);}
 }
 return <form className="service-intake-form" onSubmit={submit}>
  <div className="service-form-grid"><label>الخدمة المطلوبة<select name="service" required defaultValue=""><option value="" disabled>اختر الخدمة</option>{options.map(o=><option value={o.value} key={o.value}>{o.label}</option>)}</select></label>
  <label>الاسم<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="اسمك"/></label>
  <label>البريد الإلكتروني لاستلام التقرير<input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" placeholder="you@example.com"/></label></div>
  <label>اشرح المشكلة بدون معلومات سرية<textarea name="summary" required minLength={30} maxLength={3000} rows={5} placeholder="وش صار؟ متى بدأت المشكلة؟ وما الخطوات اللي جربتها؟ لا تكتب أرقام حسابات أو كلمات مرور أو مفاتيح محافظ."/></label>
  <div className="service-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <p className="service-form-hint">سيظهر طلبك للإدارة فقط. الدفع بالدولار الأمريكي عبر PayPal، وقد تظهر قيمة بعملتك المحلية حسب سعر الصرف ورسوم مزود الدفع. لن يبدأ إعداد التقرير قبل تأكيد الدفع.</p>
  <button type="submit" disabled={loading}>{loading?'جارٍ تسجيل الطلب...':'إرسال الطلب للإدارة'}</button>
  {payment&&<button type="button" onClick={pay} disabled={paying}>{paying?'جارٍ الاتصال بـ PayPal...':'المتابعة للدفع عبر PayPal'}</button>}
  {message&&<p role="status" className={success?'service-form-success':'service-form-error'}>{message}</p>}
 </form>
}
