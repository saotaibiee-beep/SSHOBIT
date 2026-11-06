import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://sshobit.com';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'SSHOBIT | حلول ومعلومات للمتداول السعودي',template:'%s | SSHOBIT'},description:'منصة عربية تساعد المتداولين في السعودية على فهم مشكلات التحويلات والمنصات والمحافظ الرقمية والتعامل معها بوعي.',openGraph:{title:'SSHOBIT',description:'نفهم المشكلة. نوضح الخيارات. ونرشدك للخطوة الصحيحة.',locale:'ar_SA',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body><SiteHeader/>{children}<SiteFooter/></body></html>}