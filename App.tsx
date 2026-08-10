import React, { useEffect, useState } from 'react';
import {
  DecisionInput,
  DecisionAnalysisResponse,
  SavedDecision,
  DecisionTemplate,
} from './types';

import { Header } from './Header';
import { DecisionForm } from './DecisionForm';
import { AnalysisView } from './AnalysisView';
import { TemplatesModal } from './TemplatesModal';
import { HistoryDrawer } from './HistoryDrawer';

import { Scale, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] =
    useState<DecisionAnalysisResponse | null>(null);

  const [currentInput, setCurrentInput] =
    useState<DecisionInput | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(
    () => {
      try {
        const stored = localStorage.getItem(
          'desempate_saved_decisions'
        );

        if (!stored) {
          return [];
        }

        return JSON.parse(stored);
      } catch (error) {
        console.error(
          'Error leyendo decisiones guardadas:',
          error
        );

        return [];
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        'desempate_saved_decisions',
        JSON.stringify(savedDecisions)
      );
    } catch (error) {
      console.error(
        'Error guardando decisiones:',
        error
      );
    }
  }, [savedDecisions]);

  const handleAnalyzeDecision = async (
    input: DecisionInput
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentInput(input);

    try {
      const response = await fetch(
        '/api/analyze-decision',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'Error al comunicar con el servidor de análisis.'
        );
      }

      setCurrentAnalysis(data);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (err: any) {
      console.error(
        'Error en handleAnalyzeDecision:',
        err
      );

      setError(
        err?.message ||
          'Error inesperado al procesar tu decisión.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (
    template: DecisionTemplate
  ) => {
    handleAnalyzeDecision({
      title: template.title,
      context: template.context,
      options: template.options,
      userPriorities: template.userPriorities,
      urgency: 'Media',
      analysisMode: 'completo',
    });
  };

  const handleSaveCurrentDecision = () => {
    if (!currentAnalysis || !currentInput) {
      return;
    }

    const alreadySaved = savedDecisions.some(
      (decision) =>
        decision.input.title === currentInput.title &&
        decision.analysis.title === currentAnalysis.title
    );

    if (alreadySaved) {
      return;
    }

    const newSaved: SavedDecision = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      input: currentInput,
      analysis: currentAnalysis,
      status: 'pending',
    };

    setSavedDecisions((previous) => [
      newSaved,
      ...previous,
    ]);
  };

  const isCurrentDecisionSaved = Boolean(
    currentAnalysis &&
      savedDecisions.some(
        (decision) =>
          decision.analysis.title ===
          currentAnalysis.title
      )
  );

  const handleDeleteDecision = (
    id: string
  ) => {
    setSavedDecisions((previous) =>
      previous.filter(
        (decision) => decision.id !== id
      )
    );
  };

  const handleUpdateStatus = (
    id: string,
    status: SavedDecision['status'],
    selectedOptionId?: string
  ) => {
    setSavedDecisions((previous) =>
      previous.map((decision) => {
        if (decision.id !== id) {
          return decision;
        }

        return {
          ...decision,
          status,
          selectedOptionId:
            selectedOptionId ||
            decision.selectedOptionId,
        };
      })
    );
  };

  const handleSelectSavedDecision = (
    saved: SavedDecision
  ) => {
    setCurrentInput(saved.input);
    setCurrentAnalysis(saved.analysis);
    setIsHistoryOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleResetToNew = () => {
    setCurrentAnalysis(null);
    setCurrentInput(null);
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      <Header
        onNewDecision={handleResetToNew}
        onOpenTemplates={() =>
          setIsTemplatesOpen(true)
        }
        onOpenHistory={() =>
          setIsHistoryOpen(true)
        }
        savedCount={savedDecisions.length}
      />

      <main className="pb-16">

        {error && (
          <div className="mx-auto max-w-4xl px-4 pt-6">
            <div className="flex items-start justify-between rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-950/60 dark:bg-red-950/40">

              <div className="flex items-start space-x-3">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                <div>
                  <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                    Ocurrió un inconveniente al analizar
                  </h4>

                  <p className="mt-0.5 text-xs text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs font-semibold text-red-700 hover:text-red-900 dark:text-red-300"
              >
                Cerrar
              </button>

            </div>
          </div>
        )}

        {currentAnalysis ? (
          <AnalysisView
            analysis={currentAnalysis}
            onNewDecision={handleResetToNew}
            onSaveDecision={
              handleSaveCurrentDecision
            }
            isSaved={isCurrentDecisionSaved}
          />
        ) : (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            onOpenTemplates={() =>
              setIsTemplatesOpen(true)
            }
          />
        )}

      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">

          <div className="flex items-center space-x-2">

            <Scale className="h-4 w-4 text-amber-500" />

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Desempate AI
            </span>

            <span>
              — Toma decisiones claras con inteligencia artificial
            </span>

          </div>

          <p>
            Análisis cuantitativo de pros/contras,
            comparación ponderada y FODA.
          </p>

        </div>

      </footer>

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() =>
          setIsTemplatesOpen(false)
        }
        onSelectTemplate={
          handleSelectTemplate
        }
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() =>
          setIsHistoryOpen(false)
        }
        savedDecisions={savedDecisions}
        onSelectDecision={
          handleSelectSavedDecision
        }
        onDeleteDecision={
          handleDeleteDecision
        }
        onUpdateStatus={
          handleUpdateStatus
        }
      />

    </div>
  );
}
