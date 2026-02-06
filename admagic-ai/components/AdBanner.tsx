
import React, { useEffect, useState } from 'react';
import { PlanType } from '../types';

interface AdBannerProps {
  plan: PlanType;
}

const AFFILIATE_ADS = [
  {
    title: "SHEIN VIP ACCESS",
    desc: "Todo a <$1 • Código: RVJ54D6",
    url: "https://onelink.shein.com/27/5e9tvghp3pdt",
    borderColor: "border-cyan-500/30",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    tag: "SHEIN"
  },
  {
    title: "TEMU EXCLUSIVE",
    desc: "100€ Pack • Código: aci849053",
    url: "https://temu.to/k/el4uq9rph5o",
    borderColor: "border-orange-500/30",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
    tag: "TEMU"
  }
];

const AdBanner: React.FC<AdBannerProps> = ({ plan }) => {
  const [ad, setAd] = useState(AFFILIATE_ADS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * AFFILIATE_ADS.length);
    setAd(AFFILIATE_ADS[randomIndex]);
  }, []);

  if (plan !== 'free') return null;

  return (
    <a 
      href={ad.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block w-full bg-[#020617] border ${ad.borderColor} p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:scale-[1.01] ${ad.glow} mb-6 sm:mb-10 group overflow-hidden`}
    >
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        <div className={`px-3 py-1 rounded-lg border ${ad.borderColor} text-[8px] sm:text-[10px] font-black text-white/70 font-cyber tracking-widest shrink-0 bg-white/5`}>
          {ad.tag}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-sm font-black text-white uppercase tracking-tight font-cyber truncate">{ad.title}</p>
          <p className="text-[8px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest font-cyber truncate">{ad.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[8px] sm:text-[10px] font-black text-cyan-400 group-hover:translate-x-1 transition-transform font-cyber">ABRIR</span>
        <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
      </div>
    </a>
  );
};

export default AdBanner;
