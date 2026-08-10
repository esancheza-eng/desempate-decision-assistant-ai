import React, { useState, useEffect } from 'react';
import { DecisionInput, DecisionAnalysisResponse, SavedDecision, DecisionTemplate } from './types';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { TemplatesModal } from './components/TemplatesModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Scale, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysisResponse | null>(null);
  const [currentInput, setCurrentInput] = useState<DecisionInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Saved decisions state (localStorage)
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(() => {
    try {
      const stored = localStorage.getItem('desempate_saved_decisions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync saved decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('desempate_saved_decisions', JSON.stringify(savedDecisions));
    } catch (err) {
      console.error('Error saving decisions to localStorage', err);
    }
  }, [savedDecisions]);

  // Handle submitting decision form
  const handleAnalyzeDecision = async (input: DecisionInput) => {
    setIsLoading(true);
    setError(null);
    setCurrentInput(input);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicar con el servidor de análisis.');
      }

      setCurrentAnalysis(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error en handleAnalyzeDecision:', err);
      setError(err.message || 'Error inesperado al procesar tu decisión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: DecisionTemplate) => {
    handleAnalyzeDecision({
      title: template.title,
      context: template.context,
      options: template.options,
      userPriorities: template.userPriorities,
      urgency: 'Media',
      analysisMode: 'completo',
    });
  };

  // Save current decision analysis
  const handleSaveCurrentDecision = () => {
    if (!currentAnalysis || !currentInput) return;

    // Check if already saved
    const existingIndex = savedDecisions.findIndex(
      (d) => d.input.title === currentInput.title && d.analysis.title === currentAnalysis.title
    );

    if (existingIndex >= 0) {
      // Already saved, toggle or keep
      return;
    }

    const newSaved: SavedDecision = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      input: currentInput,
      analysis: currentAnalysis,
      status: 'pending',
    };

    setSavedDecisions([newSaved, ...savedDecisions]);
  };

  const isCurrentDecisionSaved = Boolean(
    currentAnalysis &&
      savedDecisions.some((d) => d.analysis.title === currentAnalysis.title)
  );

  // History Actions
  const handleDeleteDecision = (id: string) => {
    setSavedDecisions(savedDecisions.filter((d) => d.id !== id));
  };

  const handleUpdateStatus = (
    id: string,
    status: SavedDecision['status'],
    selectedOptionId?: string
  ) => {
    setSavedDecisions(
      savedDecisions.map((d) =>
        d.id === id ? { ...d, status, selectedOptionId: selectedOptionId || d.selectedOptionId } : d
      )
    );
  };

  const handleSelectSavedDecision = (saved: SavedDecision) => {
    setCurrentInput(saved.input);
    setCurrentAnalysis(saved.analysis);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToNew = () => {
    setCurrentAnalysis(null);
    setCurrentInput(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        onNewDecision={handleResetToNew}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedDecisions.length}
      />

      {/* Main Content Area */}
      <main className="pb-16">
        {/* Error Alert */}
        {error && (
          <div className="mx-auto max-w-4xl px-4 pt-6">
            <div className="flex items-start justify-between rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-950/60 dark:bg-red-950/40">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                    Ocurrió un inconveniente al analizar
                  </h4>
                  <p className="mt-0.5 text-xs text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold text-red-700 hover:text-red-900 dark:text-red-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* View Mode Router: Form vs Analysis */}
        {currentAnalysis ? (
          <AnalysisView
            analysis={currentAnalysis}
            onNewDecision={handleResetToNew}
            onSaveDecision={handleSaveCurrentDecision}
            isSaved={isCurrentDecisionSaved}
          />
        ) : (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Desempate AI</span>
            <span>— Toma decisiones claras con inteligencia artificial</span>
          </div>
          <p>
            Análisis cuantitativo de pros/contras, comparación ponderada y FODA.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSavedDecision}
        onDeleteDecision={handleDeleteDecision}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
