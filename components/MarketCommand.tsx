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
      color: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]', // CSS Class for border/shadow
      icon: '📡'
    },
    STRATEGIST: {
      id: 'STRATEGIST',
      name: t.cmd.agent_strat,
      title: 'Chief Marketing Officer',
      description: 'Strategy & Positioning',
      color: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      icon: '♟️'
    },
    CREATIVE: {
      id: 'CREATIVE',
      name: t.cmd.agent_creative,
      title: 'Creative Director',
      description: 'Copy & Narrative',
      color: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]',
      icon: '🎨'
    },
    BRAND_GUARDIAN: {
      id: 'BRAND_GUARDIAN',
      name: t.cmd.agent_guardian,
      title: 'Legal & Brand Safety',
      description: 'Audit & Compliance',
      color: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      icon: '🛡️'
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeAgent]);

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
      // Sequence execution
      const sequence: AgentRole[] = ['MARKET_INTEL', 'STRATEGIST', 'CREATIVE', 'BRAND_GUARDIAN'];
      const prompts: Record<string, string> = {
        MARKET_INTEL: userMsg.content,
        STRATEGIST: "Based on the Market Intelligence, define the winning strategy.",
        CREATIVE: "Create high-impact copy and hooks based on this Strategy.",
        BRAND_GUARDIAN: "Audit the Creative output for risks and accuracy."
      };

      for (const role of sequence) {
        setActiveAgent(role);
        // Fix: Cast language
        const res = await runAgent(apiKey, role, prompts[role], context, language as Language);
        context += `[${role}]: ${res.text}\n\n`;
        addBotMessage(role, res.text, res.sources);
      }

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
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      
      {/* Background Grid Overlay (already in body, but emphasized here for content) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>

      {/* Header Panel */}
      <div className="relative z-10 p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-md shadow-lg">
        <div>
          <h2 className="text-2xl font-mono font-bold text-avispa-accent tracking-tighter flex items-center gap-2">
            <span className="animate-pulse">☢️</span> {t.cmd.title}
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase pl-8">{t.cmd.subtitle}</p>
        </div>
        
        {/* Active Agent Status Indicator */}
        {activeAgent ? (
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-3 rounded-r-full border-l-4 border-l-avispa-accent animate-fade-in">
             <div className="relative">
                <span className="text-2xl">{AGENTS[activeAgent].icon}</span>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-avispa-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-avispa-accent"></span>
                </span>
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-avispa-accent font-mono uppercase tracking-widest">{t.cmd.running}</span>
                <span className="text-sm font-bold text-white">{AGENTS[activeAgent].name}</span>
             </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 opacity-50">
             <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
             <span className="text-xs font-mono text-slate-400">IDLE</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="relative z-0 flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
        
        {/* Welcome State */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
            <div className="w-32 h-32 border border-dashed border-slate-700 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
              <span className="text-6xl">🐝</span>
            </div>
            <p className="font-mono text-center max-w-md text-lg tracking-widest mb-2">
              {t.cmd.awaiting}
            </p>
            <p className="text-xs font-mono text-avispa-accent">[ SYSTEM READY ]</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            
            {/* User Message */}
            {msg.role === 'user' ? (
              <div className="max-w-2xl w-full">
                 <div className="flex justify-end mb-1">
                    <span className="text-[10px] font-mono text-avispa-accent uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded border border-avispa-accent/20">
                      // OPERATOR COMMAND
                    </span>
                 </div>
                 <div className="bg-gradient-to-br from-avispa-accent to-yellow-600 text-black p-5 rounded-bl-xl rounded-tl-xl rounded-tr-xl shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    <p className="font-bold font-mono text-lg leading-tight">{msg.content}</p>
                 </div>
                 <div className="text-right mt-1">
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                 </div>
              </div>
            ) : (
              /* Agent Message */
              <div className={`max-w-4xl w-full relative group ${msg.agent ? '' : ''}`}>
                 
                 {/* Agent Header Tag */}
                 {msg.agent && (
                    <div className={`
                        absolute -left-1 top-0 bottom-0 w-1 rounded-l
                        ${msg.agent === 'MARKET_INTEL' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : ''}
                        ${msg.agent === 'STRATEGIST' ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : ''}
                        ${msg.agent === 'CREATIVE' ? 'bg-pink-500 shadow-[0_0_10px_#ec4899]' : ''}
                        ${msg.agent === 'BRAND_GUARDIAN' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : ''}
                    `}></div>
                 )}

                 <div className={`
                    bg-slate-900/90 border border-slate-700/50 backdrop-blur rounded-r-lg ml-1 overflow-hidden transition-all
                    ${msg.agent ? AGENTS[msg.agent].color.split(' ')[0] : 'border-slate-700'}
                 `}>
                    {/* Header Bar */}
                    {msg.agent && (
                      <div className="bg-white/5 px-5 py-3 flex justify-between items-center border-b border-white/5">
                         <div className="flex items-center gap-3">
                            <span className="text-lg">{AGENTS[msg.agent].icon}</span>
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">{AGENTS[msg.agent].name}</h3>
                                <p className="text-[10px] text-slate-400 uppercase">{AGENTS[msg.agent].title}</p>
                            </div>
                         </div>
                         <div className="text-[10px] font-mono text-slate-500 px-2 py-1 rounded bg-black/30 border border-white/5">
                            ID: {msg.agent}
                         </div>
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 sm:p-8">
                       <div className="prose prose-sm prose-invert max-w-none">
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                       </div>

                       {/* Sources / Footnotes */}
                       {msg.sources && msg.sources.length > 0 && (
                         <div className="mt-8 pt-6 border-t border-dashed border-slate-700">
                           <h4 className="text-[10px] font-mono font-bold text-avispa-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span className="w-1 h-1 bg-avispa-accent rounded-full animate-pulse"></span>
                             {t.cmd.sources}
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                             {msg.sources.map((src, idx) => (
                               <a 
                                  key={idx} 
                                  href={src.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-start gap-2 p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-600 transition-all group/link text-xs"
                               >
                                 <span className="font-mono text-slate-500 group-hover/link:text-avispa-accent">[{idx + 1}]</span>
                                 <span className="text-slate-300 truncate group-hover/link:text-white group-hover/link:underline decoration-slate-500/50 underline-offset-4">{src.title}</span>
                               </a>
                             ))}
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}
          </div>
        ))}

        {isProcessing && !activeAgent && (
           <div className="flex items-center gap-3 pl-2 opacity-70">
              <span className="w-2 h-2 bg-avispa-accent rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-avispa-accent rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-avispa-accent rounded-full animate-bounce delay-150"></span>
              <span className="text-xs font-mono text-avispa-accent animate-pulse">{t.cmd.init_seq}</span>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-6 bg-slate-900 border-t border-avispa-panel shadow-2xl">
        <div className="max-w-4xl mx-auto">
            <div className="relative group">
                {/* Glowing Border Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-avispa-accent to-orange-500 rounded-lg opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
                
                <div className="relative flex items-stretch bg-slate-950 rounded-lg border border-slate-700 group-hover:border-avispa-accent/50 transition-colors">
                    <textarea
                        className="flex-1 bg-transparent p-4 text-white placeholder-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                        rows={2}
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
                        className={`
                            px-6 m-1 rounded-md font-bold tracking-wider transition-all flex items-center gap-2
                            ${isProcessing || !input.trim() 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-avispa-accent hover:bg-orange-500 text-black hover:shadow-lg'}
                        `}
                    >
                        {isProcessing ? (
                           <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                        ) : (
                           <>
                             <span>{t.cmd.exec}</span>
                             <span className="text-lg">↵</span>
                           </>
                        )}
                    </button>
                </div>
            </div>
            <div className="text-center mt-2">
                 <span className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">Secure Transmission // SIEE Protocol v2.5</span>
            </div>
        </div>
      </div>
    </div>
  );
};