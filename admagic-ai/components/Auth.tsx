
import React, { useState } from 'react';
import { User, PlanType } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const getUsersFromDB = (): User[] => {
    const data = localStorage.getItem('admagic_db_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUserToDB = (user: User) => {
    const users = getUsersFromDB();
    users.push(user);
    localStorage.setItem('admagic_db_users', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = getUsersFromDB();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (isRegister) {
      if (existingUser) {
        setError('Este correo ya está en uso. Intenta iniciar sesión.');
        return;
      }
      const newUser: User = {
        name: name || 'Usuario Creativo',
        email: email.toLowerCase(),
        plan: 'free'
      };
      saveUserToDB(newUser);
      onLogin(newUser);
    } else {
      if (!existingUser) {
        setError('No se encontró una cuenta con este correo.');
        return;
      }
      onLogin(existingUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-[#0a1221] w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 animate-in zoom-in duration-300 neon-border-cyan">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-cyan-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-xl shadow-cyan-900/50 rotate-3 font-cyber">A</div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-cyber">
            {isRegister ? 'Crear Estudio' : 'Acceso VIP'}
          </h2>
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 font-cyber">AdMagic Studio - Creative Director</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-magenta-500/10 border border-magenta-500/20 rounded-2xl text-magenta-400 text-[11px] font-bold uppercase tracking-tight text-center animate-shake font-cyber">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 font-cyber">Nombre Completo</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050b18] border border-cyan-500/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all font-cyber"
                placeholder="Ej: Marc Creative"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 font-cyber">Email Corporativo</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050b18] border border-cyan-500/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all font-cyber"
              placeholder="email@estudio.com"
            />
          </div>
          
          <button 
            type="submit"
            className="group relative w-full py-5 bg-cyan-600 text-white font-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs mt-4 font-cyber"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">{isRegister ? 'Registrarme Ahora' : 'Entrar al Estudio'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:underline font-cyber"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿Eres nuevo? Crea tu cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
