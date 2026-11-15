import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'منصة حلول المتداولين — افهم المشكلة وشوف خطوتك';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', padding: '70px 90px', color: '#f7fafc', background: 'linear-gradient(130deg, #071d2b 0%, #103b49 58%, #0b2535 100%)', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <div style={{ display: 'flex', position: 'absolute', left: -100, bottom: -180, width: 540, height: 540, borderRadius: '50%', border: '2px solid rgba(89,212,190,.28)' }} />
      <div style={{ display: 'flex', position: 'absolute', left: 15, bottom: -80, width: 360, height: 360, borderRadius: '50%', border: '2px solid rgba(89,212,190,.22)' }} />
      <div style={{ display: 'flex', fontSize: 28, color: '#83e1cf', marginBottom: 38 }}>منصة عربية متخصصة في مشكلات المتداولين</div>
      <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, lineHeight: 1.3, textAlign: 'right' }}>افهم المشكلة.</div>
      <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, color: '#83e1cf', lineHeight: 1.3, textAlign: 'right' }}>وشوف خطوتك.</div>
      <div style={{ display: 'flex', fontSize: 29, color: '#d1e1e5', marginTop: 28, textAlign: 'right' }}>الإيداع والسحب · التحويلات · المحافظ · معاملات P2P</div>
      <div style={{ display: 'flex', position: 'absolute', bottom: 42, right: 90, fontSize: 23, color: '#b6d3d7' }}>المعرفة أولاً · القرار لك</div>
    </div>,
    { ...size }
  );
}
