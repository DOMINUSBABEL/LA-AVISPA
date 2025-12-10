import React, { useState } from 'react';
import { generateCampaignPlan } from '../services/geminiService';
import { CampaignConfig, CampaignPlan } from '../types';

interface Props {
  apiKey: string;
}

const PLATFORMS_LIST = ['Instagram', 'TikTok', 'X', 'Facebook', 'LinkedIn', 'YouTube'];
const FORMATS_LIST = ['Reels', 'Historias', 'Carruseles', 'Hilos', 'Video Largo', 'Imagen Estática'];

export const CampaignManager: React.FC<Props> = ({ apiKey }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CampaignPlan | null>(null);

  const [config, setConfig] = useState<CampaignConfig>({
    magicPrompt: '',
    duration: '1 Mes (Sostenimiento)',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'Alta (Dominancia de Algoritmo)',
    tone: 'Cercano / Ciudadano',
    contentMix: 'Promocional (Venta Directa)',
    kpi: 'Conversión (Intención de Voto)',
    resourceLevel: 'Alto (Producción/Estudio)',
    platforms: ['Instagram', 'TikTok'],
    formats: ['Reels', 'Historias', 'Carruseles'],
    strategicObjective: ''
  });

  const handleCreate = async () => {
    if (!config.magicPrompt || !apiKey) return;
    setLoading(true);
    try {
      // Auto-fill objective if empty from magic prompt
      const finalConfig = {
        ...config,
        strategicObjective: config.strategicObjective || config.magicPrompt.slice(0, 100)
      };
      
      const result = await generateCampaignPlan(apiKey, finalConfig);
      setPlan(result);
    } catch (e) {
      console.error(e);
      alert('Error creating campaign plan.');
    } finally {
      setLoading(false);
    }
  };

  const toggleList = (list: string[], item: string, field: 'platforms' | 'formats') => {
    const exists = list.includes(item);
    const newList = exists ? list.filter(i => i !== item) : [...list, item];
    setConfig({ ...config, [field]: newList });
  };

  return (
    <div className="h-full bg-avispa-dark text-slate-200 overflow-y-auto">
      {/* HEADER PANEL */}
      <div className="p-8 border-b border-avispa-panel bg-slate-900 sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🗓️</span>
            <div>
                <h2 className="text-xl font-mono font-bold text-white">GENERADOR DE CRONOPOSTING (PROFESIONAL)</h2>
                <p className="text-xs text-slate-400">Configuración Avanzada de Matriz de Contenidos - Alta Frecuencia</p>
            </div>
        </div>

        {/* MAGIC PROMPT SECTION */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 hover:border-avispa-accent transition-colors relative group">
            <div className="flex items-center gap-2 mb-2 text-avispa-accent font-bold text-xs uppercase tracking-wider">
                <span className="animate-pulse">✨</span> Autoconfiguración Táctica (Magic Prompt)
            </div>
            <textarea
                value={config.magicPrompt}
                onChange={(e) => setConfig({ ...config, magicPrompt: e.target.value })}
                className="w-full bg-transparent text-lg text-white placeholder-slate-600 outline-none resize-none font-light h-20"
                placeholder="Describe tu objetivo y la IA ajustará todos los parámetros técnicos automáticamente. Ej: Campaña de Hanna para diciembre de 2025 con tal de aumentar sus votos a 30.000"
            />
            <div className="absolute bottom-4 right-4 text-slate-500 group-hover:text-avispa-accent">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
        </div>

        {/* PARAMETERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            
            {/* COLUMN 1: TEMPORAL */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Parámetros Temporales</h3>
                
                <div>
                    <label className="block text-xs text-slate-400 mb-1">DURACIÓN</label>
                    <select 
                        value={config.duration}
                        onChange={(e) => setConfig({...config, duration: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>1 Mes (Sostenimiento)</option>
                        <option>2 Semanas (Intensivo)</option>
                        <option>3 Meses (Largo Plazo)</option>
                        <option>Fase de Lanzamiento (Hype)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">FECHA DE INICIO</label>
                    <input 
                        type="date"
                        value={config.startDate}
                        onChange={(e) => setConfig({...config, startDate: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">FRECUENCIA DE PUBLICACIÓN</label>
                    <select 
                        value={config.frequency}
                        onChange={(e) => setConfig({...config, frequency: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>Alta (Dominancia de Algoritmo)</option>
                        <option>Media (Estándar de Mercado)</option>
                        <option>Baja (Mantenimiento)</option>
                    </select>
                </div>
            </div>

            {/* COLUMN 2: STRATEGY */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Estrategia de Contenido</h3>
                
                <div>
                    <label className="block text-xs text-slate-400 mb-1">TONO DE COMUNICACIÓN</label>
                    <select 
                        value={config.tone}
                        onChange={(e) => setConfig({...config, tone: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>Cercano / Ciudadano</option>
                        <option>Corporativo / Serio</option>
                        <option>Disruptivo / Viral</option>
                        <option>Inspiracional / Épico</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">MIX DE CONTENIDO (REGLA)</label>
                    <select 
                        value={config.contentMix}
                        onChange={(e) => setConfig({...config, contentMix: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>Promocional (Venta Directa)</option>
                        <option>Educativo (Valor)</option>
                        <option>Entretenimiento (Viral)</option>
                        <option>Híbrido (40/40/20)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">KPI PRINCIPAL</label>
                    <select 
                        value={config.kpi}
                        onChange={(e) => setConfig({...config, kpi: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>Conversión (Intención de Voto)</option>
                        <option>Leads (Captación)</option>
                        <option>Alcance (Brand Awareness)</option>
                        <option>Engagement (Comunidad)</option>
                    </select>
                </div>
            </div>

            {/* COLUMN 3: CHANNELS & RESOURCES */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Canales y Recursos</h3>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">NIVEL DE RECURSOS (PRODUCCIÓN)</label>
                    <select 
                        value={config.resourceLevel}
                        onChange={(e) => setConfig({...config, resourceLevel: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    >
                        <option>Alto (Producción/Estudio)</option>
                        <option>Medio (In-House)</option>
                        <option>Bajo (UGC/Móvil)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-2">PLATAFORMAS ACTIVAS</label>
                    <div className="flex flex-wrap gap-2">
                        {PLATFORMS_LIST.map(p => (
                            <button
                                key={p}
                                onClick={() => toggleList(config.platforms, p, 'platforms')}
                                className={`text-[10px] px-2 py-1 rounded border transition-all ${
                                    config.platforms.includes(p) 
                                    ? 'bg-blue-900 border-blue-500 text-blue-100' 
                                    : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-2">FORMATOS CLAVE</label>
                    <div className="flex flex-wrap gap-2">
                        {FORMATS_LIST.map(f => (
                            <button
                                key={f}
                                onClick={() => toggleList(config.formats, f, 'formats')}
                                className={`text-[10px] px-2 py-1 rounded border transition-all ${
                                    config.formats.includes(f) 
                                    ? 'bg-red-900 border-red-500 text-red-100' 
                                    : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bg-slate-800/30 p-4 rounded border border-slate-800">
             <label className="block text-xs text-slate-400 mb-1 font-bold">OBJETIVO ESTRATÉGICO (Y)</label>
             <input 
                type="text"
                value={config.strategicObjective}
                onChange={(e) => setConfig({...config, strategicObjective: e.target.value})}
                placeholder="Definición explícita del objetivo (ej. Aumentar votos a 30.000)"
                className="w-full bg-transparent border-b border-slate-600 py-1 text-white focus:border-avispa-accent outline-none text-sm font-mono"
            />
        </div>

        {/* GENERATE BUTTON */}
        <div className="mt-6 flex justify-end">
            <button
                onClick={handleCreate}
                disabled={loading || !config.magicPrompt}
                className="bg-avispa-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded shadow-lg shadow-orange-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        PROCESANDO ESTRATEGIA...
                    </>
                ) : (
                    <>
                        GENERAR ESTRATEGIA
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                )}
            </button>
        </div>
      </div>

      {/* RESULTS DISPLAY AREA */}
      <div className="p-8 max-w-6xl mx-auto">
        {plan && (
             <div className="animate-fade-in space-y-8">
                {/* Summary Card */}
                <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white font-mono">{plan.productName.toUpperCase()}</h3>
                        <span className="bg-avispa-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Plan Activo</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-light text-lg">{plan.strategySummary}</p>
                </div>

                {/* Timeline */}
                <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 pb-12">
                    {plan.steps.map((step, idx) => (
                        <div key={idx} className="relative pl-8 group">
                            {/* Timeline Dot */}
                            <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-slate-900 border-2 border-avispa-accent group-hover:bg-avispa-accent transition-colors shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                            
                            {/* Card */}
                            <div className="bg-avispa-panel border border-slate-700 rounded-lg overflow-hidden hover:border-avispa-accent transition-all shadow-lg group-hover:shadow-2xl">
                                {/* Card Header */}
                                <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-800 text-slate-300 font-mono text-sm px-3 py-1 rounded border border-slate-700">
                                            DÍA {step.day}
                                        </div>
                                        {step.date && <span className="text-xs text-slate-500 font-mono">{step.date}</span>}
                                        <h4 className="font-bold text-white">{step.phase}</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold bg-blue-900/30 text-blue-400 border border-blue-900 px-2 py-1 rounded uppercase">{step.channel}</span>
                                        <span className="text-xs font-bold bg-red-900/30 text-red-400 border border-red-900 px-2 py-1 rounded uppercase">{step.format}</span>
                                    </div>
                                </div>
                                
                                {/* Card Body */}
                                <div className="p-5">
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Instrucciones de Producción</p>
                                        <p className="text-slate-200 font-light leading-relaxed whitespace-pre-wrap bg-slate-800/30 p-3 rounded border border-white/5">
                                            {step.contentParams}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold border-t border-white/5 pt-3">
                                        <span className="text-lg">🎯</span>
                                        KPI TARGET: {step.kpiTarget}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {!plan && !loading && (
             <div className="h-64 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
                <span className="text-4xl mb-4 opacity-50">📊</span>
                <p className="font-mono text-lg text-slate-500">NO HAY ESTRATEGIA GENERADA</p>
                <p className="text-sm opacity-50">Configura los parámetros superiores para iniciar.</p>
            </div>
        )}
      </div>
    </div>
  );
};