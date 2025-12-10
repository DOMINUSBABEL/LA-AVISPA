import React, { useState } from 'react';

interface Props {
  onLoginSuccess: () => void;
}

export const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'AVISPA' && password === 'AVISPA') {
      onLoginSuccess();
    } else {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-avispa-dark flex flex-col items-center justify-center z-50 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 50% 50%, #FACC15 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
      </div>

      <div className="z-10 w-full max-w-md p-8 relative flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10">
           <div className="inline-block relative">
              <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2 relative z-10">
                LA AVISPA
              </h1>
              <div className="absolute -bottom-2 -right-4 text-avispa-accent font-mono text-xs font-bold tracking-widest border border-avispa-accent px-2 py-0.5 rounded-sm bg-avispa-dark">
                SIEE v2.5
              </div>
           </div>
           <p className="mt-4 text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
             Sistema de Inteligencia Estratégica
           </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/80 border border-slate-700 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden group w-full mb-12">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-avispa-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-avispa-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-avispa-accent mb-2 font-mono uppercase">
                // Operador ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 focus:border-avispa-accent focus:ring-1 focus:ring-avispa-accent outline-none font-mono text-sm tracking-wider placeholder-slate-700 transition-all"
                placeholder="USERNAME"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-avispa-accent mb-2 font-mono uppercase">
                // Clave de Acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 focus:border-avispa-accent focus:ring-1 focus:ring-avispa-accent outline-none font-mono text-sm tracking-wider placeholder-slate-700 transition-all"
                placeholder="PASSWORD"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-mono font-bold text-center border border-red-900/50 bg-red-900/10 p-2 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-avispa-accent hover:bg-yellow-400 text-black font-black py-4 uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] relative overflow-hidden group/btn"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}
            >
              <span className="relative z-10">Inicializar Sistema</span>
            </button>
          </form>
        </div>
        
        {/* TALLEYRAND BRANDING FOOTER */}
        <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-500">
            <div className="flex flex-col items-center justify-center mb-2">
                {/* SVG Compass Logo Representation */}
                <svg width="48" height="48" viewBox="0 0 100 100" className="mb-2 drop-shadow-lg">
                   {/* Gold Star */}
                   <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="none" stroke="#FACC15" strokeWidth="2" />
                   <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="#FACC15" opacity="0.8" />
                   {/* Center Detail */}
                   <circle cx="50" cy="50" r="5" fill="#1e293b" stroke="#FACC15" strokeWidth="1" />
                </svg>
                
                <h3 className="font-serif text-2xl tracking-[0.1em] text-slate-200 font-bold leading-none mb-1">
                    CONSULTORA
                </h3>
                <h3 className="font-serif text-2xl tracking-[0.1em] text-slate-200 font-bold leading-none">
                    TALLEYRAND
                </h3>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-2"></div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
                Desarrollado por Consultora Talleyrand © 2025
            </p>
        </div>
      </div>
    </div>
  );
};