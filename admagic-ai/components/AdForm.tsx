
import React, { useState } from 'react';
import { AdFormData, ActionType, OutputFormat, PlanType } from '../types';

interface AdFormProps {
  onSubmit: (data: AdFormData) => void;
  isLoading: boolean;
  usageCount: number;
  plan: PlanType;
}

const AdForm: React.FC<AdFormProps> = ({ onSubmit, isLoading, usageCount, plan }) => {
  const [formData, setFormData] = useState<AdFormData>({
    brandName: '',
    targetAudience: '',
    tone: 'Cinematográfico y Épico',
    platform: 'Instagram Story',
    promotion: '',
    image: '',
    action: 'create_ad',
    outputFormat: 'image',
    instructions: ''
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFormData(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Sube una imagen del producto.");
      return;
    }
    onSubmit(formData);
  };

  const isEditing = formData.action === 'edit_photo';

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a]/90 backdrop-blur-xl p-4 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl neon-border-cyan space-y-6 sm:space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Izquierda: Imagen de Referencia */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] sm:text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] font-cyber text-pop">
              {isEditing ? "Para Retocar" : "Producto / Logo"}
            </label>
            <span className="text-[8px] sm:text-[10px] text-white/30 font-bold uppercase tracking-widest font-cyber">
              IA CORE
            </span>
          </div>
          
          <div className="relative aspect-square group max-w-[300px] mx-auto sm:max-w-none">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              id="file-up" 
            />
            <label htmlFor="file-up" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-cyan-500/30 rounded-[2rem] cursor-pointer group-hover:bg-cyan-500/10 group-hover:border-cyan-400 transition-all duration-500 overflow-hidden bg-[#020617]/80">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-cyan-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest bg-cyan-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 font-cyber shadow-lg">Cambiar</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 sm:p-8 space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-[#0f172a] rounded-2xl sm:rounded-3xl border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <svg className="w-6 h-6 sm:w-10 sm:h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-sm font-black text-white uppercase font-cyber tracking-tight">Carga tu Activo</p>
                    <p className="text-[8px] sm:text-[10px] text-cyan-400 font-bold uppercase mt-1 tracking-widest font-cyber">IA Visual Core</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Derecha: Configuración */}
        <div className="flex flex-col justify-between space-y-6 sm:space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 font-cyber text-pop">Acción</label>
              <div className="flex p-1 bg-[#020617] rounded-xl sm:rounded-2xl border border-white/5 shadow-inner">
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, action: 'create_ad' }))}
                  className={`flex-1 py-2 sm:py-3 px-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black transition-all duration-300 uppercase tracking-tighter font-cyber ${formData.action === 'create_ad' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Anuncio
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, action: 'edit_photo' }))}
                  className={`flex-1 py-2 sm:py-3 px-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black transition-all duration-300 uppercase tracking-tighter font-cyber ${formData.action === 'edit_photo' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Edición
                </button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 font-cyber text-pop">Formato</label>
              <div className="flex p-1 bg-[#020617] rounded-xl sm:rounded-2xl border border-white/5 shadow-inner">
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, outputFormat: 'image' }))}
                  className={`flex-1 py-2 sm:py-3 px-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black transition-all duration-300 uppercase tracking-wider font-cyber ${formData.outputFormat === 'image' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Imagen
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, outputFormat: 'video' }))}
                  className={`flex-1 py-2 sm:py-3 px-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black transition-all duration-300 uppercase tracking-wider font-cyber ${formData.outputFormat === 'video' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Video
                </button>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
               <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest font-cyber">Marca</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Nike..."
                    value={formData.brandName} 
                    onChange={e => setFormData(p => ({ ...p, brandName: e.target.value }))} 
                    className="w-full bg-[#020617] border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700 font-cyber" 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest font-cyber">Tono</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.tone} 
                    onChange={e => setFormData(p => ({ ...p, tone: e.target.value }))} 
                    className="w-full bg-[#020617] border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-white focus:border-cyan-400 outline-none transition-all font-cyber" 
                  />
               </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest font-cyber">
              {isEditing ? "Instrucciones de Retoque" : "Mensaje / Promo"}
            </label>
            <textarea 
              placeholder="¿Qué quieres lograr?"
              value={isEditing ? formData.instructions : formData.promotion}
              onChange={e => {
                if(isEditing) setFormData(p => ({ ...p, instructions: e.target.value }));
                else setFormData(p => ({ ...p, promotion: e.target.value }));
              }}
              className="w-full bg-[#020617] border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-white h-24 sm:h-32 resize-none focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700 font-cyber"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button 
              type="submit"
              disabled={isLoading}
              className={`group relative w-full py-4 sm:py-6 bg-cyan-600 text-white font-black rounded-xl sm:rounded-[1.5rem] overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] font-cyber'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-600 transition-opacity duration-500 opacity-0 group-hover:opacity-100`} />
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 tracking-[0.1em] sm:tracking-[0.15em] uppercase text-[10px] sm:text-xs text-pop">
                {isLoading ? "PROCESANDO..." : "PRODUCIR AHORA"}
                {!isLoading && (
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </span>
            </button>
            {plan === 'free' && (
              <p className="text-center text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest font-cyber">
                CUOTA: <span className={usageCount >= 4 ? "text-rose-500" : "text-cyan-400"}>{usageCount}/4</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdForm;
