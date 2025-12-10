import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentRole, CampaignConfig, CampaignPlan, GrowthMatrixData } from "../types";
import { Language } from "../i18n";

// Helper to get client (assumes API key is passed from UI state)
const getClient = (apiKey: string) => new GoogleGenAI({ apiKey });

// --- AGENT PROMPTS ---

const PROMPTS = {
  MARKET_INTEL: `You are Agent B2 (Market Intelligence) for "La Avispa". 
  Your Goal: Deep Research using Google Search.
  Task: Identify competitors, market share, consumer trends, and pricing. 
  CRITICAL: If a URL is provided (e.g. aguabonitacoffee.com), prioritize extracting facts from that specific source using Google Search. Verify origins (e.g. Colombia) and product details accurately. Do not hallucinate based on similar brand names from other countries.
  Output: Factual, data-driven report. Cite sources.`,
  
  STRATEGIST: `You are Agent B3 (CMO / Strategist). 
  Your Goal: Define Go-to-Market Strategy.
  Task: Based on market intelligence, define the Blue Ocean/Red Ocean strategy, positioning, and conversion funnels. 
  Use your high reasoning capabilities to simulate market scenarios.`,

  CREATIVE: `You are Agent B4 (Creative Director).
  Your Goal: Narrative and Copywriting.
  Task: Generate high-impact taglines, ad copy, and scripts based on the Strategy. 
  Tone: Adaptable but generally persuasive and high-quality.`,

  BRAND_GUARDIAN: `You are Agent B5 (Brand Guardian / Legal).
  Your Goal: Risk Management and Consistency.
  Task: Audit the Creative output. Check for false promises, brand safety risks, and compliance. Use Google Search to fact-check claims if necessary.`
};

// --- CORE FUNCTIONS ---

export const runAgent = async (
  apiKey: string,
  role: AgentRole,
  input: string,
  context: string = "",
  language: Language = 'es'
): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  const ai = getClient(apiKey);
  
  let model = 'gemini-3-pro-preview'; // Default for complex tasks
  let tools: any[] = [];
  let thinkingConfig: any = undefined;
  
  // Inject language instruction
  let systemInstruction = PROMPTS[role] + `\n\nCRITICAL INSTRUCTION: You MUST output your response in the following language code: "${language}".`;

  // Specific Configuration per Role
  switch (role) {
    case 'MARKET_INTEL':
      model = 'gemini-3-pro-preview'; // Need search tool
      tools = [{ googleSearch: {} }];
      break;
    case 'STRATEGIST':
      model = 'gemini-3-pro-preview';
      // High reasoning budget for strategy
      thinkingConfig = { thinkingBudget: 4096 }; 
      break;
    case 'CREATIVE':
      model = 'gemini-2.5-flash'; // Faster, creative model
      break;
    case 'BRAND_GUARDIAN':
      model = 'gemini-3-pro-preview'; // Search for fact checking
      tools = [{ googleSearch: {} }];
      break;
  }

  const combinedPrompt = `${context ? `PREVIOUS CONTEXT:\n${context}\n\n` : ''}CURRENT TASK:\n${input}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: combinedPrompt,
      config: {
        systemInstruction,
        tools: tools.length > 0 ? tools : undefined,
        thinkingConfig,
      }
    });

    const text = response.text || "No response generated.";
    
    // Extract Grounding Metadata if available
    let sources: { title: string; uri: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error(`Error running agent ${role}:`, error);
    throw error;
  }
};

// --- MATRIX GENERATION ---

export const generateGrowthMatrix = async (
  apiKey: string,
  productName: string,
  personas: string[],
  valueProps: string[],
  language: Language = 'es'
): Promise<GrowthMatrixData[]> => {
  const ai = getClient(apiKey);

  const prompt = `
    Context: We are building a Growth Grid for "${productName}".
    
    Task: For each combination of Buyer Persona and Value Proposition, generate a specific "Viral Payload".
    
    Personas: ${personas.join(', ')}
    Value Propositions: ${valueProps.join(', ')}
    
    CRITICAL: The content of 'headline', 'painPoint', and 'solutionPitch' MUST be in language: "${language}".

    Requirements:
    - 'headline': A catchy hook/subject line.
    - 'painPoint': The specific problem addressed.
    - 'solutionPitch': The educational value/solution.
    - 'channel': Best channel (LinkedIn, TikTok, Email, etc).
  `;

  // Schema for structured output
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        persona: { type: Type.STRING },
        valueProp: { type: Type.STRING },
        payload: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            painPoint: { type: Type.STRING },
            solutionPitch: { type: Type.STRING },
            channel: { type: Type.STRING }
          },
          required: ['headline', 'painPoint', 'solutionPitch', 'channel']
        }
      },
      required: ['persona', 'valueProp', 'payload']
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Matrix JSON", e);
    return [];
  }
};

// --- CAMPAIGN CONFIG AUTO-FILL ---

export const autoConfigureCampaign = async (
  apiKey: string,
  magicPrompt: string,
  language: Language = 'es'
): Promise<Partial<CampaignConfig>> => {
  const ai = getClient(apiKey);
  
  const prompt = `
    Act as an expert Marketing Strategist.
    Analyze the following user intent (Magic Prompt) and map it to the best configuration parameters for a social media campaign.
    
    USER PROMPT: "${magicPrompt}"

    Available Options Mapping (Select the closest match):
    - Tone: 'Cercano / Ciudadano', 'Corporativo / Serio', 'Disruptivo / Viral', 'Inspiracional / Épico', 'Comparativo / Agresivo', 'Satírico / Burlón'
    - Frequency: 'Alta (Dominancia de Algoritmo)', 'Media (Estándar de Mercado)', 'Baja (Mantenimiento)'
    - Resource Level: 'Alto (Producción/Estudio)', 'Medio (In-House)', 'Bajo (UGC/Móvil)'
    - KPI: 'Conversión (Intención de Voto)', 'Leads (Captación)', 'Alcance (Brand Awareness)', 'Engagement (Comunidad)', 'Robo de Cuota (Market Share)'
    - Content Mix: 'Promocional (Venta Directa)', 'Educativo (Valor)', 'Entretenimiento (Viral)', 'Híbrido (40/40/20)'

    Task:
    1. Extract a concise 'strategicObjective' (max 20 words).
    2. Suggest the best 'tone', 'frequency', 'resourceLevel', 'kpi', and 'contentMix'.
    3. Select top 2 'platforms' and top 2 'formats' best suited for this goal.
    4. Determine if 'campaignMode' should be 'GROWTH' (standard) or 'DOMINATION' (aggressive/competitor focused).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      strategicObjective: { type: Type.STRING },
      tone: { type: Type.STRING },
      frequency: { type: Type.STRING },
      resourceLevel: { type: Type.STRING },
      kpi: { type: Type.STRING },
      contentMix: { type: Type.STRING },
      campaignMode: { type: Type.STRING, enum: ['GROWTH', 'DOMINATION'] },
      platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
      formats: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['strategicObjective', 'tone', 'frequency', 'kpi', 'platforms']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AutoConfig JSON", e);
    return {};
  }
}

// --- CAMPAIGN GENERATION ---

export const generateCampaignPlan = async (
  apiKey: string,
  config: CampaignConfig,
  language: Language = 'es'
): Promise<CampaignPlan> => {
  const ai = getClient(apiKey);

  // Determine specific instructions based on Mode
  let modeInstructions = "";
  if (config.campaignMode === 'DOMINATION') {
    modeInstructions = `
      WARNING: This is a COMPETITOR SUPPRESSION / DOMINATION campaign.
      TARGET RIVALS: ${config.targetRivals}
      
      TACTICAL INSTRUCTIONS:
      1. Aggressive Differentiation: Explicitly contrast our strengths vs rival weaknesses.
      2. Market Saturation: High frequency, use rival hashtags/keywords if platform appropriate.
      3. Counter-Programming: Design posts to "steal the spotlight" from competitors.
      4. Tone: Confident, Fact-Checking, Disruptive, Superior.
      5. KPI Focus: Market Share Theft, Rival Noise Suppression.
    `;
  } else {
    modeInstructions = `
      Standard Growth Campaign. Focus on brand values, community building, and organic reach.
    `;
  }

  const prompt = `
    Create a highly professional Marketing Cronoposting Plan (Campaign Schedule).
    
    CRITICAL: The output (Strategy Summary, Phases, Content Params) MUST be in language: "${language}".

    INPUT CONTEXT (MAGIC PROMPT): "${config.magicPrompt}"
    STRATEGIC OBJECTIVE: "${config.strategicObjective}"
    
    OPERATIONAL MODE: ${config.campaignMode}
    ${modeInstructions}
    
    TECHNICAL PARAMETERS:
    - Duration: ${config.duration}
    - Start Date: ${config.startDate}
    - Posting Frequency: ${config.frequency}
    - Content Strategy Tone: ${config.tone}
    - Content Mix Rule: ${config.contentMix}
    - Main KPI: ${config.kpi}
    - Resource Level: ${config.resourceLevel}
    
    ACTIVE PLATFORMS: ${config.platforms.join(', ')}
    KEY FORMATS: ${config.formats.join(', ')}

    Task:
    1. Summarize the strategy based on the Magic Prompt, Objective and Mode.
    2. Generate a 7-step cronoposting schedule (representing key beats of the campaign).
    3. Strictly assign formats and channels from the provided lists.
    4. Ensure the Content Params are detailed and match the "Resource Level" (e.g. if High, ask for studio quality).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING, description: "Extract a short project name from the prompt" },
      strategySummary: { type: Type.STRING },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            date: { type: Type.STRING, description: "Formatted date string based on start date" },
            phase: { type: Type.STRING },
            channel: { type: Type.STRING },
            format: { type: Type.STRING },
            contentParams: { type: Type.STRING, description: "Detailed production instructions" },
            kpiTarget: { type: Type.STRING }
          }
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Pro for better planning logic
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      thinkingConfig: { thinkingBudget: 4096 } // High thinking for complex logistics
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Campaign JSON", e);
    return { productName: "Campaign", strategySummary: "Error generating plan", steps: [] };
  }
};