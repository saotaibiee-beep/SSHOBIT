'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
export function PaymentReturn(){
 const [message,setMessage]=useState('جارٍ التحقق من الدفع لدى PayPal...');
 useEffect(()=>{let active=true;const token=new URLSearchParams(window.location.search).get('token');if(!token){setMessage('لم نجد رقم العملية.');return;}
 fetch('/api/paypal/capture-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:token})}).then(async r=>{const data=await r.json();if(active)setMessage(data.paid?'تم تأكيد الدفع بنجاح. سيظهر طلبك لدى الإدارة، وسيتم التواصل معك على البريد المسجل.':data.error||'الدفع لم يكتمل بعد.');}).catch(()=>{if(active)setMessage('تعذر التحقق الآن. لا تعِد الدفع؛ تواصل مع الإدارة لمراجعة العملية.');});return()=>{active=false;};},[]);
 return <div><p role="status">{message}</p><Link href="/contact">التواصل مع الإدارة</Link></div>;
}
