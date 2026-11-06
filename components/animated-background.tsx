'use client';

import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  return <div className={`animated-scene ${reduced ? 'motion-reduced' : ''}`} aria-hidden="true">
    <div className="scene-glow scene-glow-one" />
    <div className="scene-glow scene-glow-two" />
    <svg className="scene-network" viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="net-line" x1="0" x2="1"><stop stopColor="#9cb4ff" stopOpacity="0"/><stop offset=".5" stopColor="#9cb4ff" stopOpacity=".55"/><stop offset="1" stopColor="#c8f36a" stopOpacity=".12"/></linearGradient></defs>
      <g fill="none" stroke="url(#net-line)" strokeWidth="1">
        <path d="M20 390 170 270 310 330 460 170 620 245 820 80"/><path d="M80 90 220 190 390 100 540 300 720 390 880 270"/><path d="M170 270 220 190 460 170 540 300 620 245"/><path d="M310 330 390 100 620 245 720 390"/>
        <path d="M20 500 170 270 310 330 540 300 720 390 880 500" opacity=".45"/>
      </g>
      <g fill="#c8f36a"><circle cx="170" cy="270" r="3"/><circle cx="460" cy="170" r="3"/><circle cx="620" cy="245" r="3"/><circle cx="720" cy="390" r="3"/></g>
      <g fill="#9cb4ff"><circle cx="220" cy="190" r="2.5"/><circle cx="540" cy="300" r="2.5"/><circle cx="820" cy="80" r="2.5"/></g>
    </svg>
    <div className="scene-grain" />
  </div>;
}
