
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileDropProps {
  user: User;
  onLogout: () => void;
}

const ProfileDrop: React.FC<ProfileDropProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#0a1221] border border-cyan-500/20 pl-2 pr-4 py-2 rounded-full hover:neon-border-cyan transition-all"
      >
        <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-black uppercase font-cyber shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          {user.name.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[11px] font-black text-white leading-tight uppercase tracking-tighter font-cyber">{user.name}</p>
          <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest font-cyber">{user.plan} member</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-[#0a1221] rounded-3xl shadow-2xl neon-border-cyan p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          <div className="p-4 border-b border-white/5 mb-2">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 font-cyber">Cuenta</p>
            <p className="text-sm font-bold text-white truncate font-cyber">{user.email}</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="https://gumroad.com/library" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full p-3 rounded-xl text-[11px] font-bold text-indigo-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors uppercase tracking-wider font-cyber"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Gestionar Suscripción
            </a>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-[11px] font-bold text-magenta-400 hover:bg-magenta-500/10 transition-colors uppercase tracking-wider text-left font-cyber"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDrop;
