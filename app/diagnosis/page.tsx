import {DiagnosisWizard} from '@/components/diagnosis-wizard';
export const metadata={title:'التشخيص الذكي'};
export default function DiagnosisPage(){return <main className="section container"><div className="eyebrow">تشخيص إرشادي</div><h1>خلّنا نفهم وش صاير</h1><p className="muted">جاوب عن الأسئلة عشان تظهر لك خطوات تحقق أولية. لا تدخل أي بيانات حساسة.</p><DiagnosisWizard/></main>}