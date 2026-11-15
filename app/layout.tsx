import type { Metadata, Viewport } from 'next';
import './globals.css';
import './premium.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'https://sshobit.vercel.app';
export const viewport:Viewport={width:'device-width',initialScale:1};
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'حلول ومعلومات للمتداولين',template:'%s | منصة حلول المتداولين'},description:'منصة عربية تشرح المشكلات التي قد تواجه المتداولين أثناء التداول والإيداع والسحب والتحويلات والمحافظ الرقمية، مع إرشادات عملية ومصادر موثوقة.',openGraph:{title:'منصة حلول المتداولين',description:'نفهم مشكلات المتداولين ونوضح أسبابها المحتملة وخطوات التحقق منها.',locale:'ar_SA',type:'website',images:[{url:'/opengraph-image',width:1200,height:630,alt:'الصفحة الرئيسية لمنصة حلول المتداولين'}]},twitter:{card:'summary_large_image',title:'منصة حلول المتداولين',description:'افهم المشكلة وشوف خطوتك.',images:['/opengraph-image']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body><SiteHeader/>{children}<SiteFooter/></body></html>}