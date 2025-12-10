// Roles definitions
export type AgentRole = 'MARKET_INTEL' | 'STRATEGIST' | 'CREATIVE' | 'BRAND_GUARDIAN';

export interface AgentDef {
  id: AgentRole;
  name: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  agent?: AgentRole;
  content: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  isThinking?: boolean;
}

// Matrix (Growth Grid) Types
export interface MatrixPayload {
  headline: string;
  painPoint: string;
  solutionPitch: string;
  channel: string;
}

export interface GrowthMatrixData {
  persona: string;
  valueProp: string;
  payload: MatrixPayload;
}

// Campaign Types
export interface CampaignStep {
  day: number;
  date?: string;
  phase: string;
  channel: string;
  format: string;
  contentParams: string;
  kpiTarget: string;
}

export interface CampaignPlan {
  productName: string; // Mapped from Magic Prompt or Objective
  strategySummary: string;
  steps: CampaignStep[];
}

export interface CampaignConfig {
  magicPrompt: string;
  
  // Parámetros Temporales
  duration: string;
  startDate: string;
  frequency: string;

  // Estrategia de Contenido
  tone: string;
  contentMix: string;
  kpi: string;
  
  // Canales y Recursos
  resourceLevel: string;
  platforms: string[]; // ['Instagram', 'TikTok', ...]
  formats: string[];   // ['Reels', 'Stories', ...]

  // Objetivo Estratégico (Y)
  strategicObjective: string;
}