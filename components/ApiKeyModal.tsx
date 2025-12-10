import React, { useState } from 'react';

interface Props {
  onSetKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<Props> = ({ onSetKey }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSetKey(input.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 p-8 rounded border border-slate-600 max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-avispa-accent">🔐</span> SECURITY CLEARANCE
        </h2>
        <p className="text-slate-300 text-sm mb-6">
          Access to SIEE "La Avispa" requires a valid Gemini API Key with access to <code className="bg-slate-900 px-1 rounded text-avispa-accent">gemini-3-pro-preview</code>.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your API Key here"
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded mb-4 focus:border-avispa-accent outline-none font-mono text-sm"
          />
          <button
            type="submit"
            className="w-full bg-avispa-accent hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors"
          >
            AUTHENTICATE
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500 text-center">
          Keys are stored in runtime memory only.
        </p>
      </div>
    </div>
  );
};