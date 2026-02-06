
import React, { useState, useEffect } from 'react';
import { AdConcept, AdContext } from '../types';

interface ResultDisplayProps {
  concept: AdConcept;
  context: AdContext;
  visualReference?: string;
  videoUrl?: string;
}

const PROMOS = [
  {
    brand: "S",
    title: "SHEIN VIP ACCESS",
    desc: "Cód: RVJ54D6 • Todo a <$1",
    url: "https://onelink.shein.com/27/5e9tvghp3pdt",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400"
  },
  {
    brand: "T",
    title: "TEMU PACK EXCLUSIVO",
    desc: "Cód: aci849053 • 100€ Extra",
    url: "https://temu.to/k/el4uq9rph5o",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400"
  }
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ concept, context, visualReference, videoUrl }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [promo, setPromo] = useState(PROMOS[0]);
  const isFree = context.plan === 'free';
  const qualityLabel = context.plan === 'premium' ? '4K Ultra HD' : context.plan === 'standard' ? '2K HD' : 'Standard 720p';

  useEffect(() => {
    setPromo(PROMOS[Math.floor(Math.random() * PROMOS.length)]);
  }, []);

  const handleDownload = async () => {
    const url = videoUrl || visualReference;
    if (!url) return;

    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = videoUrl ? 'mp4' : 'png';
      link.download = `AdMagic_${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-4 space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Visual Strategy Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] shadow-xl neon-border-cyan h-fit border border-white/5">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="bg-cyan-600/30 text-white border border-cyan-400/40 px-3 sm:px-5 py-1 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg font-cyber text-pop">Director</span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase font-cyber text-pop">Estrategia</h2>
            </div>
            <span className={`text-[7px] sm:text-[10px] font-black px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-lg sm:rounded-xl uppercase tracking-widest font-cyber shadow-lg border ${
              context.plan === 'premium' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 
              context.plan === 'standard' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 
              'bg-slate-800 text-slate-100 border-white/10'
            }`}>
              {context.plan.toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-4 sm:space-y-8">
            <div className="bg-[#020617] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-inner">
              <h3 className="text-[9px] sm:text-[12px] font-black text-cyan-400 uppercase tracking-widest mb-2 sm:mb-4 font-cyber text-pop">Escena Visual</h3>
              <p className="text-white leading-relaxed text-sm sm:text-xl font-bold italic">
                "{concept.visualDescription}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-2 sm:pt-4">
              <div className="bg-[#020617] p-3 sm:p-6 rounded-2xl border border-white/5 text-center">
                <h3 className="text-[7px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-cyber">Composición</h3>
                <p className="text-white font-black text-[10px] sm:text-sm uppercase tracking-tight font-cyber truncate">{concept.compositionType}</p>
              </div>
              <div className="bg-cyan-900/20 p-3 sm:p-6 rounded-2xl border border-cyan-500/20 text-center">
                <h3 className="text-[7px] sm:text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1 font-cyber">Resolución</h3>
                <p className="text-cyan-400 font-black text-[10px] sm:text-sm uppercase tracking-tight font-cyber truncate">{qualityLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media Output Container */}
        <div className="flex flex-col gap-4">
          <div className="bg-black rounded-3xl sm:rounded-[3.5rem] overflow-hidden shadow-2xl relative flex items-center justify-center border-4 sm:border-8 border-[#0f172a] min-h-[300px] sm:min-h-[450px] aspect-square sm:aspect-auto">
            {videoUrl ? (
              <video 
                key={videoUrl}
                src={videoUrl} 
                className="w-full h-full object-contain" 
                autoPlay 
                loop 
                muted 
                controls
                playsInline
              />
            ) : visualReference ? (
              <img src={visualReference} alt="Ad Visual Reference" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-6 sm:p-12 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <div className="w-6 h-6 sm:w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] animate-pulse font-cyber text-cyan-400">Canalizando IA...</p>
              </div>
            )}
            
            <div className="absolute top-3 sm:top-8 left-3 sm:left-8 z-30">
              <span className="bg-black/90 backdrop-blur-xl text-white text-[8px] sm:text-[11px] font-black px-3 sm:px-6 py-1 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-4 uppercase tracking-widest border border-cyan-500/30 font-cyber">
                <span className={`w-1.5 h-1.5 sm:w-3 h-3 rounded-full ${isFree ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                {context.plan.toUpperCase()}
              </span>
            </div>

            {(videoUrl || visualReference) && (
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="absolute bottom-3 sm:bottom-8 right-3 sm:right-8 bg-cyan-600 hover:bg-cyan-500 text-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl transition-all border border-white/20 group z-30 active:scale-90"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 sm:w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 sm:w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {isFree && (
            <a 
              href={promo.url} 
              target="_blank" 
              className={`bg-[#020617] p-3 sm:p-5 rounded-2xl flex items-center justify-between group transition-all border ${promo.borderColor} hover:bg-white/5`}
            >
              <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                <div className={`w-10 h-10 sm:w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center ${promo.textColor} font-black text-lg sm:text-2xl rotate-2 shrink-0 border ${promo.borderColor}`}>
                  {promo.brand}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest font-cyber text-white truncate">{promo.title}</p>
                  <p className="text-[8px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-tight font-cyber truncate">{promo.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 px-3">
                <span className={`text-[8px] sm:text-[10px] font-black ${promo.textColor} font-cyber group-hover:translate-x-1 transition-transform`}>GO</span>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Copywriting Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        <div className="bg-[#0f172a] p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4.5rem] text-white shadow-xl relative overflow-hidden group neon-border-cyan border border-white/5">
          <div className="relative z-10">
            <h2 className="text-[9px] sm:text-[12px] font-black uppercase tracking-[0.4em] mb-6 sm:mb-10 text-cyan-600 font-cyber">TITULAR MASTER</h2>
            <p className="text-2xl sm:text-5xl font-black leading-[1.1] mb-8 sm:mb-14 tracking-tighter italic font-cyber text-pop">"{concept.headline}"</p>
            <button className="bg-white text-black px-8 sm:px-14 py-3.5 sm:py-6 rounded-xl sm:rounded-2xl font-black hover:scale-105 transition-transform uppercase text-[9px] sm:text-[12px] tracking-[0.2em] font-cyber shadow-2xl">
              {concept.cta}
            </button>
          </div>
        </div>

        <div className="bg-[#0f172a]/50 p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4.5rem] border border-white/10 shadow-xl flex flex-col justify-between backdrop-blur-md">
          <div>
            <h2 className="text-[9px] sm:text-[12px] font-black uppercase tracking-[0.4em] mb-6 sm:mb-10 text-slate-500 font-cyber">VARIANTE BETA</h2>
            <p className="text-xl sm:text-4xl font-black text-white leading-[1.2] mb-8 sm:mb-14 tracking-tighter font-cyber">"{concept.variationHeadline}"</p>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-6 sm:pt-12">
            <p className="text-cyan-500 font-black uppercase text-[9px] sm:text-[12px] tracking-widest font-cyber">
              CTR OPT: {concept.variationCta}
            </p>
          </div>
        </div>
      </div>
      
      {(videoUrl || visualReference) && (
        <div className="flex justify-center pt-6 sm:pt-12 pb-10">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="group relative bg-cyan-600 text-white px-10 sm:px-20 py-5 sm:py-8 rounded-[1.5rem] sm:rounded-[2rem] text-xs sm:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] font-cyber shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all overflow-hidden border border-cyan-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-3 sm:gap-6">
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 sm:w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  CARGANDO...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  DESCARGAR FINAL
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
