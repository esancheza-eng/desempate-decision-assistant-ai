export interface ProConItem {
  id: string;
  text: string;
  category: string; // e.g., 'Financiero', 'Paz Mental', 'Tiempo', 'Crecimiento', 'Riesgo'
  impact: number; // -5 (muy negativo) a +5 (muy positivo)
  explanation?: string;
}

export interface OptionAnalysis {
  optionId: string;
  title: string;
  description?: string;
  pros: ProConItem[];
  cons: ProConItem[];
  overallScore: number; // 0-100
  summary: string;
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number; // 1-10 (importancia)
  scores: Record<string, number>; // optionId -> score (1-10)
  notes: Record<string, string>; // optionId -> nota o razón
  bestOptionId?: string;
}

export interface SwotAnalysis {
  fortalezas: string[];
  oportunidades: string[];
  debilidades: string[];
  amenazas: string[];
  estrategias?: {
    FO: string; // Usar Fortalezas para aprovechar Oportunidades
    DO: string; // Superar Debilidades aprovechando Oportunidades
    FA: string; // Usar Fortalezas para evitar Amenazas
    DA: string; // Minimizar Debilidades y evitar Amenazas
  };
}

export interface DecisionAnalysisResponse {
  title: string;
  dilemmaContext: string;
  recommendedOptionId: string;
  recommendationReason: string;
  confidenceScore: number; // 0 - 100
  options: OptionAnalysis[];
  comparisonCriteria: ComparisonCriteria[];
  swot: Record<string, SwotAnalysis>; // optionId -> SWOT
  nextSteps: string[];
  riskMitigationPlan: string;
  keyInsights: string[];
}

export interface DecisionInput {
  title: string;
  context?: string;
  options: string[]; // List of option titles, e.g. ["Aceptar oferta en Madrid", "Quedarme en el trabajo actual"]
  userPriorities?: string[]; // e.g. ["Dinero", "Tiempo con familia", "Paz mental", "Crecimiento profesional"]
  urgency?: 'Baja' | 'Media' | 'Alta';
  analysisMode?: 'completo' | 'ventajas_desventajas' | 'comparativa' | 'foda';
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  input: DecisionInput;
  analysis: DecisionAnalysisResponse;
  status: 'pending' | 'decided' | 'archived';
  selectedOptionId?: string;
  userNotes?: string;
  customWeights?: Record<string, number>; // criteriaId -> custom weight
}

export interface DecisionTemplate {
  id: string;
  category: string;
  title: string;
  context: string;
  options: string[];
  userPriorities: string[];
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
