
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente creativo de AdMagic. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'Eres un experto en marketing digital y producción audiovisual llamado AdMagic Assistant. Tu tono es profesional, creativo, inspirador y tecnológico. Ayudas a los usuarios a mejorar sus anuncios, entender las tendencias y usar la plataforma AdMagic Studio.',
        },
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    initChat();

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatRef.current!.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || '' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, tuve un problema de conexión. Inténtalo de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#0f172a] rounded-[2.5rem] shadow-2xl neon-border-cyan flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#020617] p-6 border-b border-cyan-500/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-white font-cyber text-sm">A</div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest font-cyber">AdMagic Bot</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_emerald]"></span>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">En Línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                    : 'bg-[#020617] text-slate-100 border border-white/5 rounded-tl-none shadow-xl'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#020617] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#020617] border-t border-white/5">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda creativa..."
                className="w-full bg-[#0f172a] border border-cyan-500/20 rounded-xl p-4 pr-12 text-sm text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 font-cyber"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 disabled:opacity-30 transition-all p-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all border border-white/20 relative ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-ping"></span>}
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
