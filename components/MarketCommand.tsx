import React, { useState, useRef, useEffect } from 'react';
import { AgentDef, AgentRole, ChatMessage } from '../types';
import { runAgent } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  apiKey: string;
}

const AGENTS: Record<AgentRole, AgentDef> = {
  MARKET_INTEL: {
    id: 'MARKET_INTEL',
    name: 'B2 - Market Intel',
    title: 'Intelligence Officer',
    description: 'Deep Research & Data',
    color: 'bg-blue-600',
    icon: '📡'
  },
  STRATEGIST: {
    id: 'STRATEGIST',
    name: 'B3 - Strategist',
    title: 'Chief Marketing Officer',
    description: 'Strategy & Positioning',
    color: 'bg-purple-600',
    icon: '♟️'
  },
  CREATIVE: {
    id: 'CREATIVE',
    name: 'B4 - Creative',
    title: 'Creative Director',
    description: 'Copy & Narrative',
    color: 'bg-pink-600',
    icon: '🎨'
  },
  BRAND_GUARDIAN: {
    id: 'BRAND_GUARDIAN',
    name: 'B5 - Guardian',
    title: 'Legal & Brand Safety',
    description: 'Audit & Compliance',
    color: 'bg-emerald-600',
    icon: '🛡️'
  }
};

export const MarketCommand: React.FC<Props> = ({ apiKey }) => {
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

    let context = "";

    try {
      // 1. Market Intel
      setActiveAgent('MARKET_INTEL');
      const b2Res = await runAgent(apiKey, 'MARKET_INTEL', userMsg.content);
      context += `[MARKET INTEL]: ${b2Res.text}\n\n`;
      addBotMessage('MARKET_INTEL', b2Res.text, b2Res.sources);

      // 2. Strategist
      setActiveAgent('STRATEGIST');
      const b3Res = await runAgent(apiKey, 'STRATEGIST', "Based on the Market Intelligence, define the winning strategy.", context);
      context += `[STRATEGY]: ${b3Res.text}\n\n`;
      addBotMessage('STRATEGIST', b3Res.text);

      // 3. Creative
      setActiveAgent('CREATIVE');
      const b4Res = await runAgent(apiKey, 'CREATIVE', "Create high-impact copy and hooks based on this Strategy.", context);
      context += `[CREATIVE]: ${b4Res.text}\n\n`;
      addBotMessage('CREATIVE', b4Res.text);

      // 4. Guardian
      setActiveAgent('BRAND_GUARDIAN');
      const b5Res = await runAgent(apiKey, 'BRAND_GUARDIAN', "Audit the Creative output for risks and accuracy.", context);
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
          <h2 className="text-2xl font-mono font-bold text-avispa-accent tracking-tighter">MARKET_COMMAND</h2>
          <p className="text-xs text-slate-400 font-mono">SIEE ACTIVE SEQUENCE</p>
        </div>
        {activeAgent && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 ${AGENTS[activeAgent].color} bg-opacity-20 animate-pulse`}>
            <span className="text-xl">{AGENTS[activeAgent].icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white">{AGENTS[activeAgent].name}</span>
              <span className="text-[10px] text-white/70">PROCESSING...</span>
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
              Awaiting Directives. <br/>
              Enter a product or market objective to initiate protocol.
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
                     <p className="text-xs font-mono text-avispa-accent mb-2">INTELLIGENCE SOURCES:</p>
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
             <span className="loading-indicator text-avispa-accent font-mono animate-pulse">INITIALIZING SEQUENCE...</span>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-900 border-t border-avispa-panel">
        <div className="relative max-w-4xl mx-auto flex items-end gap-2">
          <textarea
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-sm p-4 text-white focus:outline-none focus:border-avispa-accent focus:ring-1 focus:ring-avispa-accent resize-none font-mono text-sm transition-all"
            rows={3}
            placeholder="ENTER STRATEGIC OBJECTIVE (e.g. 'Launch a premium coffee subscription for remote workers')"
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
            {isProcessing ? 'RUNNING' : 'EXECUTE'}
          </button>
        </div>
      </div>
    </div>
  );
};