import React, { useState } from 'react';
import { generateCampaignPlan } from '../services/geminiService';
import { CampaignConfig, CampaignPlan, CampaignMode } from '../types';
import { useLanguage, Language } from '../i18n';

interface Props {
  apiKey: string;
  language?: Language;
}

const PLATFORMS_LIST = ['Instagram', 'TikTok', 'X', 'Facebook', 'LinkedIn', 'YouTube'];
const FORMATS_LIST = ['Reels', 'Historias', 'Carruseles', 'Hilos', 'Video Largo', 'Imagen Estática'];

export const CampaignManager: React.FC<Props> = ({ apiKey, language = 'es' }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const { t } = useLanguage();

  const [config, setConfig] = useState<CampaignConfig>({
    magicPrompt: 'Campaña de posicionamiento para "Agua Bonita Coffee" como la bebida esencial que combina herencia latina con sostenibilidad para la Gen Z.',
    campaignMode: 'GROWTH',
    targetRivals: '',
    duration: '2 Semanas (Intensivo)',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'Alta (Dominancia de Algoritmo)',
    tone: 'Disruptivo / Viral',
    contentMix: 'Entretenimiento (Viral)',
    kpi: 'Alcance (Brand Awareness)',
    resourceLevel: 'Alto (Producción/Estudio)',
    platforms: ['Instagram', 'TikTok'],
    formats: ['Reels', 'Historias'],
    strategicObjective: 'Aumentar reconocimiento de marca en un 40% y ventas directas en web.'
  });

  // Dynamic Options based on Mode
  const getToneOptions = () => {
    if (config.campaignMode === 'DOMINATION') {
      return ['Comparativo / Agresivo', 'Desmitificador / "Fact-Check"', 'Superioridad Moral', 'Satírico / Burlón', 'Urgente / Alerta'];
    }
    return ['Cercano / Ciudadano', 'Corporativo / Serio', 'Disruptivo / Viral', 'Inspiracional / Épico'];
  };

  const getKpiOptions = () => {
    if (config.campaignMode === 'DOMINATION') {
      return ['Robo de Cuota (Market Share)', 'Supresión de Ruido Rival', 'Contraste de Valor', 'Retención Defensiva'];
    }
    return ['Conversión (Intención de Voto)', 'Leads (Captación)', 'Alcance (Brand Awareness)', 'Engagement (Comunidad)'];
  };

  const handleCreate = async () => {
    if (!config.magicPrompt || !apiKey) return;
    setLoading(true);
    try {
      // Auto-fill objective if empty from magic prompt
      const finalConfig = {
        ...config,
        strategicObjective: config.strategicObjective || config.magicPrompt.slice(0, 100)
      };
      
      // Fix: Cast language to Language type to avoid string mismatch
      const result = await generateCampaignPlan(apiKey, finalConfig, language as Language);
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
    <div className={`h-full bg-avispa-dark text-slate-200 overflow-y-auto transition-colors duration-700 ${config.campaignMode === 'DOMINATION' ? 'selection:bg-red-900 selection:text-white' : ''}`}>
      {/* HEADER PANEL */}
      <div className={`p-8 border-b transition-colors duration-500 sticky top-0 z-20 shadow-xl ${config.campaignMode === 'DOMINATION' ? 'bg-red-950/90 border-red-900' : 'bg-slate-900 border-avispa-panel'}`}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{config.campaignMode === 'DOMINATION' ? '⚔️' : '🗓️'}</span>
                <div>
                    <h2 className={`text-xl font-mono font-bold ${config.campaignMode === 'DOMINATION' ? 'text-red-500' : 'text-white'}`}>
                        {t.camp.title}
                    </h2>
                    <p className="text-xs text-slate-400">{t.camp.subtitle}</p>
                </div>
            </div>

            {/* MODE TOGGLE */}
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                    onClick={() => setConfig({ ...config, campaignMode: 'GROWTH' })}
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest rounded transition-all ${config.campaignMode === 'GROWTH' ? 'bg-avispa-accent text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    {t.camp.mode_growth}
                </button>
                <button
                    onClick={() => setConfig({ ...config, campaignMode: 'DOMINATION' })}
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest rounded transition-all ${config.campaignMode === 'DOMINATION' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'text-slate-500 hover:text-white'}`}
                >
                    {t.camp.mode_domination}
                </button>
            </div>
        </div>

        {/* DOMINATION MODE WARNING & INPUT */}
        {config.campaignMode === 'DOMINATION' && (
            <div className="mb-6 animate-pulse-slow">
                <div className="bg-red-900/20 border border-red-800 p-4 rounded-lg mb-4">
                    <p className="text-red-400 text-xs font-bold font-mono tracking-wider flex items-center gap-2">
                        {t.camp.warn_aggressive}
                    </p>
                </div>
                <div>
                    <label className="block text-xs text-red-400 mb-1 font-bold tracking-widest uppercase">{t.camp.rivals_label}</label>
                    <input 
                        type="text"
                        value={config.targetRivals}
                        onChange={(e) => setConfig({...config, targetRivals: e.target.value})}
                        placeholder={t.camp.rivals_placeholder}
                        className="w-full bg-red-950/50 border border-red-800 text-white p-3 rounded focus:border-red-500 outline-none font-mono text-sm placeholder-red-900/50"
                    />
                </div>
            </div>
        )}

        {/* MAGIC PROMPT SECTION */}
        <div className={`bg-slate-800/50 border rounded-lg p-4 mb-6 transition-colors relative group ${config.campaignMode === 'DOMINATION' ? 'border-red-900/50 hover:border-red-500' : 'border-slate-700 hover:border-avispa-accent'}`}>
            <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${config.campaignMode === 'DOMINATION' ? 'text-red-500' : 'text-avispa-accent'}`}>
                <span className="animate-pulse">✨</span> {t.camp.magic_prompt}
            </div>
            <textarea
                value={config.magicPrompt}
                onChange={(e) => setConfig({ ...config, magicPrompt: e.target.value })}
                className="w-full bg-transparent text-lg text-white placeholder-slate-600 outline-none resize-none font-light h-20"
                placeholder={t.camp.magic_placeholder}
            />
        </div>

        {/* PARAMETERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            
            {/* COLUMN 1: TEMPORAL */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">{t.camp.params_time}</h3>
                
                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.duration}</label>
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
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.start_date}</label>
                    <input 
                        type="date"
                        value={config.startDate}
                        onChange={(e) => setConfig({...config, startDate: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-avispa-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.frequency}</label>
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
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">{t.camp.params_strat}</h3>
                
                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.tone}</label>
                    <select 
                        value={config.tone}
                        onChange={(e) => setConfig({...config, tone: e.target.value})}
                        className={`w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white outline-none ${config.campaignMode === 'DOMINATION' ? 'focus:border-red-500 text-red-200 font-bold' : 'focus:border-avispa-accent'}`}
                    >
                        {getToneOptions().map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.mix}</label>
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
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.kpi}</label>
                    <select 
                        value={config.kpi}
                        onChange={(e) => setConfig({...config, kpi: e.target.value})}
                        className={`w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white outline-none ${config.campaignMode === 'DOMINATION' ? 'focus:border-red-500 text-red-200 font-bold' : 'focus:border-avispa-accent'}`}
                    >
                        {getKpiOptions().map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>

            {/* COLUMN 3: CHANNELS & RESOURCES */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">{t.camp.params_res}</h3>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.camp.res_level}</label>
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
                    <label className="block text-xs text-slate-400 mb-2">{t.camp.platforms}</label>
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
                    <label className="block text-xs text-slate-400 mb-2">{t.camp.formats}</label>
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
             <label className="block text-xs text-slate-400 mb-1 font-bold">{t.camp.obj_y}</label>
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
                className={`${config.campaignMode === 'DOMINATION' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/30' : 'bg-avispa-accent hover:bg-orange-600 shadow-orange-900/20'} text-white font-bold py-3 px-8 rounded shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        {t.camp.processing}
                    </>
                ) : (
                    <>
                        {t.camp.generate}
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
                <div className={`p-6 bg-gradient-to-r border rounded-lg shadow-2xl ${config.campaignMode === 'DOMINATION' ? 'from-red-950 to-slate-900 border-red-800' : 'from-slate-800 to-slate-900 border-slate-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white font-mono">{plan.productName.toUpperCase()}</h3>
                        <span className={`text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${config.campaignMode === 'DOMINATION' ? 'bg-red-600' : 'bg-avispa-accent'}`}>{t.camp.active_plan}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-light text-lg">{plan.strategySummary}</p>
                </div>

                {/* Timeline */}
                <div className={`relative border-l-2 ml-4 space-y-8 pb-12 ${config.campaignMode === 'DOMINATION' ? 'border-red-900/50' : 'border-slate-700'}`}>
                    {plan.steps.map((step, idx) => (
                        <div key={idx} className="relative pl-8 group">
                            {/* Timeline Dot */}
                            <span className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-slate-900 border-2 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.5)] ${config.campaignMode === 'DOMINATION' ? 'border-red-500 group-hover:bg-red-500' : 'border-avispa-accent group-hover:bg-avispa-accent'}`}></span>
                            
                            {/* Card */}
                            <div className={`bg-avispa-panel border rounded-lg overflow-hidden transition-all shadow-lg group-hover:shadow-2xl ${config.campaignMode === 'DOMINATION' ? 'border-red-900/30 hover:border-red-500' : 'border-slate-700 hover:border-avispa-accent'}`}>
                                {/* Card Header */}
                                <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-800 text-slate-300 font-mono text-sm px-3 py-1 rounded border border-slate-700">
                                            DIA {step.day}
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
                                        <p className="text-sm text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">{t.camp.production}</p>
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
                <p className="font-mono text-lg text-slate-500">{t.camp.no_plan}</p>
                <p className="text-sm opacity-50">Configura los parámetros superiores para iniciar.</p>
            </div>
        )}
      </div>
    </div>
  );
};