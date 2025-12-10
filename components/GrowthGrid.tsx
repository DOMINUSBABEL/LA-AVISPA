import React, { useState } from 'react';
import { generateGrowthMatrix } from '../services/geminiService';
import { GrowthMatrixData } from '../types';
import { useLanguage, Language } from '../i18n';

interface Props {
  apiKey: string;
  language?: Language;
}

export const GrowthGrid: React.FC<Props> = ({ apiKey, language = 'es' }) => {
  const [product, setProduct] = useState('Agua Bonita (Beverage Brand)');
  const [personas, setPersonas] = useState<string[]>(['The Culture Curator (Gen Z)', 'The Wellness Maximizer', 'The Nostalgic Millennial']);
  const [valueProps, setValueProps] = useState<string[]>(['Rescued/Real Ingredients', 'Unapologetic Heritage', 'Guilt-Free Energy']);
  const [matrixData, setMatrixData] = useState<GrowthMatrixData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<GrowthMatrixData | null>(null);
  const { t } = useLanguage();

  const handleGenerate = async () => {
    if (!product || !apiKey) return;
    setLoading(true);
    setMatrixData([]); // Clear previous
    try {
      // Fix: Cast language to Language type to avoid string mismatch
      const data = await generateGrowthMatrix(apiKey, product, personas, valueProps, language as Language);
      setMatrixData(data);
    } catch (e) {
      alert("Failed to generate matrix");
    } finally {
      setLoading(false);
    }
  };

  const getCellData = (p: string, vp: string) => {
    return matrixData.find(d => d.persona === p && d.valueProp === vp);
  };

  return (
    <div className="h-full flex flex-col bg-avispa-dark text-slate-200 overflow-hidden">
      <div className="p-6 border-b border-avispa-panel flex justify-between items-center bg-slate-900/50">
        <h2 className="text-2xl font-mono font-bold text-avispa-accent">{t.grid.title}</h2>
        <div className="flex gap-4 items-center">
            <input 
                type="text" 
                value={product}
                onChange={e => setProduct(e.target.value)}
                placeholder={t.grid.placeholder}
                className="bg-slate-800 border border-slate-600 px-3 py-2 rounded text-sm w-64 focus:border-avispa-accent outline-none font-mono text-white"
            />
            <button 
                onClick={handleGenerate}
                disabled={loading || !product}
                className="bg-white text-avispa-dark px-4 py-2 text-sm font-bold hover:bg-slate-200 disabled:opacity-50"
            >
                {loading ? t.grid.calculating : t.grid.generate}
            </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto flex gap-8">
        
        {/* Matrix Container */}
        <div className="flex-1 overflow-auto">
            {/* Headers */}
            <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `150px repeat(${valueProps.length}, 1fr)` }}>
                <div className="flex items-end justify-center pb-2 text-xs font-mono text-slate-500">{t.grid.headers}</div>
                {valueProps.map((vp, i) => (
                    <div key={i} className="text-center font-bold text-avispa-accent text-sm p-2 bg-slate-800/50 border border-slate-700">
                        {vp}
                    </div>
                ))}
            </div>

            {/* Rows */}
            {personas.map((persona, i) => (
                <div key={i} className="grid gap-2 mb-2" style={{ gridTemplateColumns: `150px repeat(${valueProps.length}, 1fr)` }}>
                    <div className="flex items-center justify-end pr-4 font-bold text-sm text-slate-400 bg-slate-800/30 border border-transparent">
                        {persona}
                    </div>
                    {valueProps.map((vp, j) => {
                        const cell = getCellData(persona, vp);
                        return (
                            <div 
                                key={j}
                                onClick={() => cell && setSelectedCell(cell)}
                                className={`
                                    h-32 p-3 border border-slate-700 bg-slate-800/30 hover:bg-slate-700 cursor-pointer transition-all relative group
                                    ${selectedCell === cell && cell ? 'ring-2 ring-avispa-accent bg-slate-700' : ''}
                                `}
                            >
                                {cell ? (
                                    <>
                                        <div className="text-xs text-avispa-accent font-mono mb-1">{cell.payload.channel}</div>
                                        <div className="text-sm font-semibold line-clamp-3 text-white">{cell.payload.headline}</div>
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-slate-400">
                                            Click to view
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {loading ? <span className="w-2 h-2 bg-slate-600 rounded-full animate-ping"></span> : <span className="text-slate-700">-</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>

        {/* Details Panel */}
        <div className="w-96 bg-avispa-panel border-l border-slate-700 p-6 overflow-y-auto shadow-2xl">
            {selectedCell ? (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-mono text-slate-500 block mb-1">{t.grid.details}</span>
                        <div className="text-lg font-bold text-white">{selectedCell.persona}</div>
                        <div className="text-sm text-avispa-accent">{selectedCell.valueProp}</div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-700 rounded">
                        <span className="text-xs font-mono text-slate-500 block mb-2">{t.grid.hook}</span>
                        <p className="text-xl font-serif text-white">{selectedCell.payload.headline}</p>
                    </div>

                    <div>
                        <span className="text-xs font-mono text-slate-500 block mb-1">{t.grid.pain}</span>
                        <p className="text-sm text-slate-300 italic">"{selectedCell.payload.painPoint}"</p>
                    </div>

                    <div>
                        <span className="text-xs font-mono text-slate-500 block mb-1">{t.grid.solution}</span>
                        <p className="text-sm text-slate-300">{selectedCell.payload.solutionPitch}</p>
                    </div>

                    <div>
                        <span className="text-xs font-mono text-slate-500 block mb-1">{t.grid.channel}</span>
                        <span className="inline-block px-3 py-1 bg-avispa-accent text-white text-xs font-bold rounded">
                            {selectedCell.payload.channel}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-center">
                    <p>{t.grid.empty}</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};