import React from 'react';

type View = 'COMMAND' | 'MATRIX' | 'CAMPAIGN';

interface Props {
  currentView: View;
  setView: (v: View) => void;
}

export const Sidebar: React.FC<Props> = ({ currentView, setView }) => {
  const btnClass = (view: View) => `
    w-full p-4 text-left font-mono text-sm transition-all border-l-2
    ${currentView === view 
      ? 'border-avispa-accent bg-white/5 text-white font-bold' 
      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}
  `;

  return (
    <div className="w-64 bg-slate-900 border-r border-avispa-panel flex flex-col justify-between h-full">
      <div>
        <div className="p-6 mb-4">
          <h1 className="text-2xl font-black text-white tracking-tighter italic">LA AVISPA</h1>
          <div className="h-1 w-12 bg-avispa-accent mt-2"></div>
        </div>

        <nav className="space-y-1">
          <button onClick={() => setView('COMMAND')} className={btnClass('COMMAND')}>
            <span className="mr-3">☢️</span> MARKET COMMAND
          </button>
          <button onClick={() => setView('MATRIX')} className={btnClass('MATRIX')}>
            <span className="mr-3">💠</span> GROWTH GRID
          </button>
          <button onClick={() => setView('CAMPAIGN')} className={btnClass('CAMPAIGN')}>
            <span className="mr-3">🗓️</span> CRONO_POSTING
          </button>
        </nav>
      </div>

      <div className="p-6 text-xs text-slate-600 font-mono">
        <p>SYSTEM: ONLINE</p>
        <p>MODEL: GEMINI 3</p>
        <p className="mt-2 text-avispa-accent">SIEE v2.5</p>
      </div>
    </div>
  );
};