
import React, { useState, useEffect } from 'react';
import AdForm from './components/AdForm';
import ResultDisplay from './components/ResultDisplay';
import Pricing from './components/Pricing';
import AdBanner from './components/AdBanner';
import Auth from './components/Auth';
import ProfileDrop from './components/ProfileDrop';
import Chatbot from './components/Chatbot';
import { AdContext, AdConcept, LoadingState, PlanType, AdFormData, User } from './types';
import { generateAdConcept, generateVisualReference, generateAdVideo } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [adConcept, setAdConcept] = useState<AdConcept | null>(null);
  const [visualRef, setVisualRef] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [currentContext, setCurrentContext] = useState<AdContext | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan') as PlanType;
    
    const savedUserEmail = localStorage.getItem('admagic_session_email');
    if (savedUserEmail) {
      const dbUsers = JSON.parse(localStorage.getItem('admagic_db_users') || '[]');
      let dbUser = dbUsers.find((u: User) => u.email === savedUserEmail);
      
      if (dbUser) {
        if (planParam && ['standard', 'premium'].includes(planParam)) {
          dbUser.plan = planParam;
          const updatedUsers = dbUsers.map((u: User) => u.email === dbUser.email ? dbUser : u);
          localStorage.setItem('admagic_db_users', JSON.stringify(updatedUsers));
        }
        setUser(dbUser);
        setSelectedPlan(dbUser.plan);
      }
    } else if (planParam && ['standard', 'premium'].includes(planParam)) {
      setSelectedPlan(planParam);
    }

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('admagic_date');
    const storedCount = localStorage.getItem('admagic_count');

    if (storedDate === today) {
      setUsageCount(parseInt(storedCount || '0'));
    } else {
      localStorage.setItem('admagic_date', today);
      localStorage.setItem('admagic_count', '0');
      setUsageCount(0);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('admagic_session_email', u.email);
    setSelectedPlan(u.plan);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admagic_session_email');
    setSelectedPlan('free');
  };

  const handlePlanSelect = (plan: PlanType) => {
    if (user) {
      const dbUsers = JSON.parse(localStorage.getItem('admagic_db_users') || '[]');
      const updatedUsers = dbUsers.map((u: User) => u.email === user.email ? { ...u, plan } : u);
      localStorage.setItem('admagic_db_users', JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      setSelectedPlan(plan);
    } else {
      setSelectedPlan(plan);
    }
  };

  const handleGenerate = async (formData: AdFormData) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const hasUnlimited = selectedPlan === 'standard' || selectedPlan === 'premium';
    if (!hasUnlimited && usageCount >= 4) {
      setLoading(LoadingState.LIMIT_REACHED);
      return;
    }

    const context: AdContext = { ...formData, plan: selectedPlan };
    
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      if (!(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
      }
    }

    setLoading(LoadingState.PROCESSING);
    setAdConcept(null);
    setVisualRef(undefined);
    setVideoUrl(undefined);

    try {
      const concept = await generateAdConcept(context);
      setAdConcept(concept);
      setCurrentContext(context);
      
      if (formData.outputFormat === 'video') {
        setLoading(LoadingState.GENERATING_VIDEO);
        const video = await generateAdVideo(concept, context);
        setVideoUrl(video);
      } else {
        setLoading(LoadingState.GENERATING_IMAGE);
        const refImage = await generateVisualReference(concept, context);
        setVisualRef(refImage);
      }
      
      if (!hasUnlimited) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('admagic_count', newCount.toString());
      }

      setLoading(LoadingState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Requested entity was not found.") && aistudio) {
        await aistudio.openSelectKey();
      }
      setLoading(LoadingState.ERROR);
    }
  };

  const isFree = selectedPlan === 'free';

  const OFFERS = [
    { label: 'SHEIN VIP', price: '<$1', code: 'RVJ54D6', url: 'https://onelink.shein.com/27/5e9tvghp3pdt', border: 'border-cyan-500/20' },
    { label: 'TEMU PACK', price: '100€', code: 'aci849053', url: 'https://temu.to/k/el4uq9rph5o', border: 'border-orange-500/20' },
    { label: 'SHEIN 40%', price: 'OFF', code: 'N5B5V2U', url: 'https://onelink.shein.com/27/5e9tjw66dj4d', border: 'border-magenta-500/20' },
    { label: 'SHEIN 60%', price: 'OFF', code: '237F536', url: 'https://onelink.shein.com/27/5e9ixpvny85i', border: 'border-cyan-500/20' }
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-[#f1f5f9]">
      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-2xl border-b border-cyan-500/40 px-3 sm:px-8 py-3 sm:py-5 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-4">
           <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-[0_0_20px_rgba(6,182,212,0.6)] rotate-2 font-cyber">A</div>
           <h1 className="text-lg sm:text-2xl font-black text-white tracking-tighter font-cyber text-pop leading-none">AdMagic<span className="text-cyan-400 block sm:inline">Studio</span></h1>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-10">
          {user ? (
            <ProfileDrop user={user} onLogout={handleLogout} />
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-[9px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-cyan-400 hover:text-white transition-all font-cyber text-pop"
            >
              VIP
            </button>
          )}
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="group relative bg-[#0f172a] text-white px-4 sm:px-10 py-2 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[12px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all neon-border-cyan hover:scale-105 font-cyber shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/40 to-indigo-600/40" />
            <span className="relative z-10 text-pop">PLANES</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto w-full pt-6 sm:pt-20 pb-20 px-3 sm:px-6 relative z-10">
        <header className="text-center mb-8 sm:mb-20">
          <h2 className="text-4xl sm:text-7xl md:text-9xl font-black text-white mb-4 sm:mb-10 tracking-tighter leading-[0.9] text-pop">
            Producción <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-indigo-500 font-cyber">Cinematográfica</span> IA.
          </h2>
          <p className="text-sm sm:text-2xl text-slate-100 max-w-3xl mx-auto font-black leading-relaxed uppercase tracking-tight font-cyber text-pop px-2">
            Anuncios Premium con Gemini 3 y Veo 3.1. <br />
            <span className="text-cyan-400 font-black tracking-[0.1em] sm:tracking-[0.15em] neon-text-cyan">Escala tu visión al futuro.</span>
          </p>
        </header>

        {isFree && <AdBanner plan={selectedPlan} />}

        <div className="relative">
          {isFree && (
            <div className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-full max-w-lg text-center z-20 space-y-1 sm:space-y-2 px-2">
              <div className="flex justify-center gap-1.5 sm:gap-3">
                <span className="bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-full uppercase tracking-widest font-cyber">
                  SHEIN: RVJ54D6
                </span>
                <span className="bg-orange-900/40 text-orange-300 border border-orange-500/30 text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-full uppercase tracking-widest font-cyber">
                  TEMU: aci849053
                </span>
              </div>
            </div>
          )}
          <AdForm 
            onSubmit={handleGenerate} 
            isLoading={loading !== LoadingState.IDLE && loading !== LoadingState.SUCCESS && loading !== LoadingState.ERROR} 
            usageCount={usageCount}
            plan={selectedPlan}
          />
        </div>

        {loading === LoadingState.LIMIT_REACHED && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <div className="relative bg-[#0f172a] w-full max-w-xl rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-12 text-center shadow-2xl neon-border-cyan animate-in zoom-in border border-cyan-500/30 overflow-y-auto max-h-[90vh]">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-8 text-xl sm:text-3xl border border-rose-500/40">🔥</div>
              <h3 className="text-xl sm:text-4xl font-black text-white tracking-tighter uppercase mb-2 sm:mb-4 font-cyber text-pop">Límite Agotado</h3>
              <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-xs tracking-widest mb-6 sm:mb-10 leading-relaxed font-cyber">
                Has completado tus 4 producciones diarias. <br />
                <span className="text-cyan-400">Pásate a Pro</span> o usa estas ofertas exclusivas:
              </p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 text-left">
                {OFFERS.map((offer, idx) => (
                  <a 
                    key={idx}
                    href={offer.url} 
                    target="_blank" 
                    className={`p-3 sm:p-5 bg-[#020617] text-white rounded-xl border ${offer.border} flex flex-col gap-1 transition-all hover:scale-[1.02] hover:bg-white/5`}
                  >
                    <span className="text-[7px] sm:text-[9px] font-black uppercase text-slate-500 font-cyber">{offer.label}</span>
                    <span className="text-xs sm:text-lg font-black text-white font-cyber">{offer.price} DTO</span>
                    <span className="text-[7px] sm:text-[10px] font-black text-cyan-400/80 mt-1 uppercase font-cyber">CÓD: {offer.code}</span>
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setLoading(LoadingState.IDLE); setIsPricingOpen(true); }}
                  className="w-full py-4 sm:py-6 bg-cyan-600 text-white font-black rounded-xl sm:rounded-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs font-cyber transition-all active:scale-95"
                >
                  DESBLOQUEAR PLANES PRO
                </button>
                <button 
                  onClick={() => setLoading(LoadingState.IDLE)}
                  className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest p-2 font-cyber hover:text-white transition-colors"
                >
                  CERRAR VENTANA
                </button>
              </div>
            </div>
          </div>
        )}

        {loading === LoadingState.GENERATING_VIDEO && (
          <div className="mt-8 sm:mt-20 bg-[#0f172a]/90 p-8 sm:p-20 rounded-3xl sm:rounded-[4.5rem] neon-border-cyan shadow-2xl text-center space-y-6 sm:space-y-12 animate-in zoom-in backdrop-blur-2xl">
            <div className="relative w-24 h-24 sm:w-40 sm:h-40 mx-auto">
              <div className="absolute inset-0 border-[6px] sm:border-[12px] border-cyan-900/50 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] sm:border-[12px] border-cyan-400 rounded-full border-t-transparent animate-spin shadow-[0_0_20px_cyan]"></div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-5xl font-black text-white italic tracking-tighter uppercase leading-none font-cyber text-pop">Renderizando...</h3>
              <p className="text-cyan-400 max-w-md mx-auto text-[9px] sm:text-[13px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] mt-4 sm:mt-8 font-cyber text-pop">
                {selectedPlan === 'premium' ? 'VEO 3.1: 4K ULTRA' : 'VEO FAST: 720p'}
              </p>
            </div>
          </div>
        )}

        {adConcept && currentContext && (
          <div className="mt-12 sm:mt-28 border-t border-cyan-500/20 pt-12 sm:pt-28">
            <ResultDisplay concept={adConcept} context={currentContext} visualReference={visualRef} videoUrl={videoUrl} />
          </div>
        )}
      </main>

      <Chatbot />

      {isPricingOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsPricingOpen(false)} />
          <div className="relative bg-[#0f172a] w-full max-w-lg rounded-3xl sm:rounded-[4.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 neon-border-cyan border border-white/10">
            <div className="bg-[#020617] p-6 sm:p-12 text-white flex justify-between items-center border-b border-cyan-500/30 shadow-2xl">
              <div>
                <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter font-cyber text-pop">ACCESO</h3>
                <p className="text-[8px] sm:text-[11px] text-cyan-400 uppercase font-black tracking-[0.3em] sm:tracking-[0.4em] mt-1 sm:mt-3 font-cyber">CREATIVE CORE</p>
              </div>
              <button onClick={() => setIsPricingOpen(false)} className="bg-white/5 hover:bg-white/15 p-2 sm:p-4 rounded-xl transition-all border border-white/20 group">
                <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 sm:p-12 bg-transparent">
              <Pricing selectedPlan={selectedPlan} onPlanSelect={handlePlanSelect} />
              <div className="mt-6 sm:mt-12 pt-6 sm:pt-12 border-t border-white/10 flex items-center justify-center gap-3 sm:gap-6">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-900/60 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-2xl text-lg sm:text-2xl">🛡️</div>
                <p className="text-[9px] sm:text-[12px] text-slate-100 font-black uppercase tracking-widest italic leading-tight font-cyber">
                  PAGO ENCRIPTADO <br />SSL 256 BITS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAuthOpen && <Auth onLogin={handleLogin} onClose={() => setIsAuthOpen(false)} />}
      
      <footer className="bg-[#020617] border-t border-cyan-500/20 py-10 sm:py-20 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-14 text-center">
          <div className="flex items-center gap-3 sm:gap-6">
             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-cyan-700 text-white rounded-xl flex items-center justify-center font-black text-lg sm:text-2xl font-cyber shadow-[0_0_20px_rgba(6,182,212,0.4)]">A</div>
             <p className="text-[9px] sm:text-sm font-black text-white/50 tracking-[0.2em] sm:tracking-[0.3em] font-cyber uppercase">ADMAGIC STUDIO &copy; 2024</p>
          </div>
          <div className="flex gap-6 sm:gap-16">
            <a href="#" className="text-[9px] sm:text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-400 transition-colors font-cyber">LEGAL</a>
            <a href="#" className="text-[9px] sm:text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-400 transition-colors font-cyber">AI CORE</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
