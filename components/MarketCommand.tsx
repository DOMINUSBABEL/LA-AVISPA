import React, { useState, useRef, useEffect } from 'react';
import { AgentDef, AgentRole, ChatMessage } from '../types';
import { runAgent } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useLanguage, Language } from '../i18n';

interface Props {
  apiKey: string;
  language?: Language;
}

export const MarketCommand: React.FC<Props> = ({ apiKey, language = 'es' }) => {
  const { t } = useLanguage();

  const AGENTS: Record<AgentRole, AgentDef> = {
    MARKET_INTEL: {
      id: 'MARKET_INTEL',
      name: t.cmd.agent_market,
      title: 'Intelligence Officer',
      description: 'Deep Research & Data',
      color: 'bg-blue-600',
      icon: '📡'
    },
    STRATEGIST: {
      id: 'STRATEGIST',
      name: t.cmd.agent_strat,
      title: 'Chief Marketing Officer',
      description: 'Strategy & Positioning',
      color: 'bg-purple-600',
      icon: '♟️'
    },
    CREATIVE: {
      id: 'CREATIVE',
      name: t.cmd.agent_creative,
      title: 'Creative Director',
      description: 'Copy & Narrative',
      color: 'bg-pink-600',
      icon: '🎨'
    },
    BRAND_GUARDIAN: {
      id: 'BRAND_GUARDIAN',
      name: t.cmd.agent_guardian,
      title: 'Legal & Brand Safety',
      description: 'Audit & Compliance',
      color: 'bg-emerald-600',
      icon: '🛡️'
    }
  };

  // Note: Sample history kept in English/Mixed as it is historical data, but new interactions will follow language.
  // Ideally, this sample history would also be translated, but for brevity we keep the structure.
  const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: 'init-1',
    role: 'user',
    content: "Analyze growth strategy for 'Agua Bonita' (aguabonitacoffee.com). Focus on positioning them as the essential culturally-rooted beverage for Gen Z.",
    timestamp: Date.now() - 10000
  },
  {
    id: 'init-2',
    role: 'model',
    agent: 'MARKET_INTEL',
    timestamp: Date.now() - 8000,
    content: `**MARKET INTELLIGENCE REPORT: AGUA BONITA**

**Core Identity:**
Agua Bonita creates "Aguas Frescas" from rescued produce (upcycled fruit). They blend traditional Mexican culture with modern sustainability trends. 

**Key Differentiators:**
1.  **Upcycled Ingredients:** "Rescued Fruit" narrative appeals to eco-conscious Gen Z.
2.  **No Added Sugar/Low Cal:** Solves the pain point of sugary traditional jarritos/sodas.
3.  **Aesthetic/Vibrant Branding:** Highly visual, meant for social sharing (Instagram/TikTok friendly).

**Competitors:**
*   *Direct:* Poppi, Olipop (Healthy Sodas).
*   *Cultural:* Traditional Mexican brands (Jarritos) - perceived as nostalgic but unhealthy.

**Opportunity:**
Position as the "Modern Tradition" – guilt-free nostalgia.`,
    sources: [
        { title: "Agua Bonita Official", uri: "https://aguabonitacoffee.com/" },
        { title: "Upcycled Food Trend Report", uri: "https://trends.google.com" }
    ]
  },
  {
    id: 'init-3',
    role: 'model',
    agent: 'STRATEGIST',
    timestamp: Date.now() - 6000,
    content: `**STRATEGIC DIRECTIVE: "THE BOLD REMIX"**

**Positioning:** "Unapologetically Latino, Unbelievably Clean."
We are moving away from the "niche ethnic aisle" to the "premium lifestyle cooler".

**The Funnel:**
1.  **Top (Awareness):** Leverage "Spanglish" humor and "Abuela approval vs. Modern Health" skits on TikTok.
2.  **Middle (Consideration):** Emphasize the "Rescued Fruit" aspect to win the sustainability argument against big soda.
3.  **Bottom (Conversion):** Subscription bundles for "The Daily Ritual".

**Blue Ocean Move:**
Don't compete with Coffee or Soda directly. Compete with "Boring Water" and "Guilty Pleasures". Create a new category: **"Hydration with Soul".**`
  },
  {
    id: 'init-4',
    role: 'model',
    agent: 'CREATIVE',
    timestamp: Date.now() - 4000,
    content: `**CAMPAIGN HOOKS: "FRUIT DON'T FAIL ME NOW"**

**Taglines:**
*   *"Real Fruit. Real Culture. No Fake Stuff."*
*   *"Hydration that hits different."*
*   *"Tu abuela's recipe, minus the sugar crash."*

**Video Concept (Reels/TikTok):**
*Visual:* A grey, boring office desk.
*Action:* Can cracks open. Explosion of color, mariachi trumpet sound effect (lo-fi), fruits flying in slow motion.
*Caption:* "When the 3PM slump hits but you refuse to drink boring sparkling water. #AguaBonita #RescuedFruit"`
  }
]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeAgent]);

  // Main Orchestration Logic
  const handleLaunch = async () => {
    if (!input.trim() || !apiKey) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    let context = messages.map(m => `[${m.agent || 'USER'}]: ${m.content}`).join('\n');

    try {
      // 1. Market Intel
      setActiveAgent('MARKET_INTEL');
      // Fix: Cast language to Language type to avoid string mismatch
      const b2Res = await runAgent(apiKey, 'MARKET_INTEL', userMsg.content, "", language as Language);
      context += `[MARKET INTEL]: ${b2Res.text}\n\n`;
      addBotMessage('MARKET_INTEL', b2Res.text, b2Res.sources);

      // 2. Strategist
      setActiveAgent('STRATEGIST');
      // Fix: Cast language to Language type to avoid string mismatch
      const b3Res = await runAgent(apiKey, 'STRATEGIST', "Based on the Market Intelligence, define the winning strategy.", context, language as Language);
      context += `[STRATEGY]: ${b3Res.text}\n\n`;
      addBotMessage('STRATEGIST', b3Res.text);

      // 3. Creative
      setActiveAgent('CREATIVE');
      // Fix: Cast language to Language type to avoid string mismatch
      const b4Res = await runAgent(apiKey, 'CREATIVE', "Create high-impact copy and hooks based on this Strategy.", context, language as Language);
      context += `[CREATIVE]: ${b4Res.text}\n\n`;
      addBotMessage('CREATIVE', b4Res.text);

      // 4. Guardian
      setActiveAgent('BRAND_GUARDIAN');
      // Fix: Cast language to Language type to avoid string mismatch
      const b5Res = await runAgent(apiKey, 'BRAND_GUARDIAN', "Audit the Creative output for risks and accuracy.", context, language as Language);
      addBotMessage('BRAND_GUARDIAN', b5Res.text, b5Res.sources);

    } catch (err) {
      console.error(err);
      addBotMessage('MARKET_INTEL', "Mission Aborted: Critical Error in processing chain.");
    } finally {
      setIsProcessing(false);
      setActiveAgent(null);
    }
  };

  const addBotMessage = (role: AgentRole, content: string, sources?: { title: string; uri: string }[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      agent: role,
      content,
      timestamp: Date.now(),
      sources
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-avispa-dark text-avispa-light overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-avispa-panel flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-mono font-bold text-avispa-accent tracking-tighter">{t.cmd.title}</h2>
          <p className="text-xs text-slate-400 font-mono">{t.cmd.subtitle}</p>
        </div>
        {activeAgent && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 ${AGENTS[activeAgent].color} bg-opacity-20 animate-pulse`}>
            <span className="text-xl">{AGENTS[activeAgent].icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white">{AGENTS[activeAgent].name}</span>
              <span className="text-[10px] text-white/70">{t.cmd.processing}</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <div className="text-6xl mb-4">🐝</div>
            <p className="font-mono text-center max-w-md">
              {t.cmd.awaiting}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl w-full ${msg.role === 'user' ? 'bg-avispa-accent text-white' : 'bg-avispa-panel border border-slate-700'} rounded-sm p-0 overflow-hidden shadow-lg`}>
              
              {msg.role === 'model' && msg.agent && (
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider text-white flex justify-between items-center ${AGENTS[msg.agent].color}`}>
                  <span className="flex items-center gap-2">
                    {AGENTS[msg.agent].icon} {AGENTS[msg.agent].name}
                  </span>
                  <span className="opacity-70">{AGENTS[msg.agent].title}</span>
                </div>
              )}

              <div className="p-6 text-sm leading-relaxed font-light">
                 {msg.role === 'user' ? (
                   <p className="font-medium text-lg">{msg.content}</p>
                 ) : (
                   <div className="prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                   </div>
                 )}

                 {msg.sources && msg.sources.length > 0 && (
                   <div className="mt-4 pt-4 border-t border-white/10">
                     <p className="text-xs font-mono text-avispa-accent mb-2">{t.cmd.sources}</p>
                     <ul className="space-y-1">
                       {msg.sources.map((src, idx) => (
                         <li key={idx} className="text-xs truncate">
                           <a href={src.uri} target="_blank" rel="noopener noreferrer" className="hover:text-white text-slate-400 hover:underline flex items-center gap-2">
                             <span className="w-1 h-1 bg-avispa-accent rounded-full"></span>
                             [{idx + 1}] {src.title}
                           </a>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && !activeAgent && (
           <div className="flex justify-center py-4">
             <span className="loading-indicator text-avispa-accent font-mono animate-pulse">{t.cmd.init_seq}</span>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-900 border-t border-avispa-panel">
        <div className="relative max-w-4xl mx-auto flex items-end gap-2">
          <textarea
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-sm p-4 text-white focus:outline-none focus:border-avispa-accent focus:ring-1 focus:ring-avispa-accent resize-none font-mono text-sm transition-all"
            rows={3}
            placeholder={t.cmd.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleLaunch();
              }
            }}
            disabled={isProcessing}
          />
          <button
            onClick={handleLaunch}
            disabled={isProcessing || !input.trim()}
            className={`h-full px-8 bg-avispa-accent hover:bg-orange-600 text-white font-bold tracking-wider rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            style={{ height: '86px' }}
          >
            {isProcessing ? t.cmd.running : t.cmd.exec}
          </button>
        </div>
      </div>
    </div>
  );
};