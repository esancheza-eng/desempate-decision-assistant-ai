import React, { useState } from 'react';
import { DecisionAnalysisResponse, SavedDecision } from '../types';
import { InteractiveMatrix } from './InteractiveMatrix';
import { ChatTab } from './ChatTab';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Bookmark,
  RotateCcw,
  Sliders,
  FileText,
  Table,
  Grid2X2,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Filter,
  Check
} from 'lucide-react';

interface AnalysisViewProps {
  analysis: DecisionAnalysisResponse;
  onNewDecision: () => void;
  onSaveDecision: () => void;
  isSaved: boolean;
  savedDecisionId?: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onNewDecision,
  onSaveDecision,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'veredicto' | 'pros_cons' | 'comparativa' | 'foda' | 'chat'>(
    'veredicto'
  );

  const [selectedProConCategory, setSelectedProConCategory] = useState<string>('all');
  const [selectedSwotOptionId, setSelectedSwotOptionId] = useState<string>(
    analysis.options[0]?.optionId || 'opt_0'
  );
  const [showMatrix, setShowMatrix] = useState(false);

  const recommendedOption = analysis.options.find(
    (o) => o.optionId === analysis.recommendedOptionId
  ) || analysis.options[0];

  // Extract all categories from pros/cons for filtering
  const allCategories = Array.from(
    new Set(
      analysis.options.flatMap((o) => [
        ...o.pros.map((p) => p.category),
        ...o.cons.map((c) => c.category),
      ])
    )
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Banner & Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 print:shadow-none print:border-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Análisis Desempate Generado</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {analysis.title}
            </h1>
            {analysis.dilemmaContext && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Contexto: {analysis.dilemmaContext}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={onSaveDecision}
              className={`inline-flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>{isSaved ? 'Guardada en Historial' : 'Guardar Decisión'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Exportar o Imprimir informe en PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onNewDecision}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Nueva Decisión</span>
            </button>
          </div>
        </div>

        {/* Verdict Highlight Card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30 p-6 dark:bg-amber-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Opción Recomendada por el Desempate
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {recommendedOption?.title}
                </h2>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.recommendationReason}
                </p>
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="flex shrink-0 items-center space-x-3 rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-center">
                <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                  {analysis.confidenceScore}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Afinidad IA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 dark:border-slate-800 overflow-x-auto print:hidden">
        {[
          { id: 'veredicto', label: '🏆 Veredicto y Matriz', icon: Award },
          { id: 'pros_cons', label: '⚖️ Ventajas y Desventajas', icon: FileText },
          { id: 'comparativa', label: '📊 Tabla Comparativa', icon: Table },
          { id: 'foda', label: '🎯 Análisis FODA (SWOT)', icon: Grid2X2 },
          { id: 'chat', label: '💬 Consultoría IA', icon: MessageSquare },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VEREDICTO & MATRIZ INTERACTIVA */}
      {activeTab === 'veredicto' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Options Overview Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {analysis.options.map((opt) => {
              const isWinner = opt.optionId === analysis.recommendedOptionId;

              return (
                <div
                  key={opt.optionId}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                    isWinner
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {opt.optionId.toUpperCase()}
                      </span>
                      {isWinner && (
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          Recomendada
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {opt.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {opt.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Score General:
                    </span>
                    <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      {opt.overallScore}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Weight Matrix Toggle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-amber-500" />
                  <span>Calculadora de Ponderaciones Personalizadas</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ¿Quieres ajustar el peso de cada criterio según lo que más te importa hoy?
                </p>
              </div>

              <button
                onClick={() => setShowMatrix(!showMatrix)}
                className="inline-flex items-center space-x-1 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <span>{showMatrix ? 'Ocultar Matriz' : 'Personalizar Ponderaciones'}</span>
                {showMatrix ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {showMatrix && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <InteractiveMatrix
                  initialCriteria={analysis.comparisonCriteria}
                  options={analysis.options}
                />
              </div>
            )}
          </div>

          {/* Key Insights & Next Steps */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Insights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Hallazgos Clave (Key Insights)</span>
              </h3>
              <ul className="space-y-2.5">
                {analysis.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ArrowRight className="h-4 w-4 text-amber-500" />
                <span>Pasos Recomendados para Ejecutar</span>
              </h3>
              <ol className="space-y-2.5">
                {analysis.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Risk Mitigation Plan */}
          {analysis.riskMitigationPlan && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
              <h3 className="mb-2 text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Plan B y Mitigación de Riesgos</span>
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {analysis.riskMitigationPlan}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VENTAJAS Y DESVENTAJAS */}
      {activeTab === 'pros_cons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category Filter Pills */}
          {allCategories.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <span className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filtrar Categoría:
              </span>
              <button
                onClick={() => setSelectedProConCategory('all')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  selectedProConCategory === 'all'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Todas
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProConCategory(cat)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition whitespace-nowrap ${
                    selectedProConCategory === cat
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Side by side options pros/cons */}
          <div className="grid gap-6 md:grid-cols-2">
            {analysis.options.map((opt) => {
              const filteredPros =
                selectedProConCategory === 'all'
                  ? opt.pros
                  : opt.pros.filter((p) => p.category === selectedProConCategory);

              const filteredCons =
                selectedProConCategory === 'all'
                  ? opt.cons
                  : opt.cons.filter((c) => c.category === selectedProConCategory);

              return (
                <div
                  key={opt.optionId}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6"
                >
                  <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                      Opción Evaluada
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </h3>
                  </div>

                  {/* Pros Column */}
                  <div>
                    <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700">
                        +
                      </span>
                      <span>Ventajas / Pros ({filteredPros.length})</span>
                    </h4>

                    {filteredPros.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No hay pros para esta categoría</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredPros.map((pro) => (
                          <li
                            key={pro.id}
                            className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-950/40 dark:bg-emerald-950/20"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {pro.text}
                              </span>
                              <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                +{pro.impact}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                                {pro.category}
                              </span>
                              {pro.explanation && (
                                <span className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                                  {pro.explanation}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Cons Column */}
                  <div>
                    <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700">
                        -
                      </span>
                      <span>Desventajas / Contras ({filteredCons.length})</span>
                    </h4>

                    {filteredCons.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No hay contras para esta categoría</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredCons.map((con) => (
                          <li
                            key={con.id}
                            className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 dark:border-rose-950/40 dark:bg-rose-950/20"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {con.text}
                              </span>
                              <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                {con.impact}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                                {con.category}
                              </span>
                              {con.explanation && (
                                <span className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                                  {con.explanation}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TABLA COMPARATIVA */}
      {activeTab === 'comparativa' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Tabla Comparativa de Criterios Clave
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Evaluación detallada de cada alternativa frente a los factores de decisión más relevantes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
                  <th className="p-3.5 font-bold text-slate-800 dark:text-slate-200 min-w-[160px]">
                    Criterio Evaluado
                  </th>
                  <th className="p-3.5 font-bold text-slate-800 dark:text-slate-200 w-24">
                    Importancia
                  </th>
                  {analysis.options.map((opt) => (
                    <th key={opt.optionId} className="p-3.5 font-bold text-slate-800 dark:text-slate-200 min-w-[200px]">
                      {opt.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analysis.comparisonCriteria.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                      {c.weight}/10
                    </td>
                    {analysis.options.map((opt) => {
                      const score = c.scores?.[opt.optionId] || 5;
                      const note = c.notes?.[opt.optionId];
                      const isWinner = c.bestOptionId === opt.optionId;

                      return (
                        <td key={opt.optionId} className="p-3.5">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                  className={`h-full rounded-full ${
                                    isWinner ? 'bg-amber-500' : 'bg-slate-500'
                                  }`}
                                  style={{ width: `${score * 10}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{score}/10</span>
                              {isWinner && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                  Mejor
                                </span>
                              )}
                            </div>
                            {note && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                {note}
                              </p>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ANÁLISIS FODA (SWOT) */}
      {activeTab === 'foda' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Option Selector for SWOT */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Ver FODA de la opción:
            </span>
            {analysis.options.map((opt) => (
              <button
                key={opt.optionId}
                onClick={() => setSelectedSwotOptionId(opt.optionId)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedSwotOptionId === opt.optionId
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {opt.title}
              </button>
            ))}
          </div>

          {/* SWOT Grid */}
          {(() => {
            const currentSwot = analysis.swot?.[selectedSwotOptionId] || {
              fortalezas: [],
              oportunidades: [],
              debilidades: [],
              amenazas: [],
            };

            return (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Fortalezas */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 dark:border-emerald-950/40 dark:bg-emerald-950/10">
                    <h4 className="mb-3 text-sm font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs">
                        F
                      </span>
                      <span>Fortalezas (Factores Internos Positivos)</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentSwot.fortalezas?.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Oportunidades */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-950/40 dark:bg-blue-950/10">
                    <h4 className="mb-3 text-sm font-extrabold text-blue-800 dark:text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 text-white text-xs">
                        O
                      </span>
                      <span>Oportunidades (Factores Externos Positivos)</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentSwot.oportunidades?.map((o, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200">
                          <Check className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Debilidades */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 dark:border-amber-950/40 dark:bg-amber-950/10">
                    <h4 className="mb-3 text-sm font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white text-xs">
                        D
                      </span>
                      <span>Debilidades (Factores Internos a Mejorar)</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentSwot.debilidades?.map((d, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Amenazas */}
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 dark:border-rose-950/40 dark:bg-rose-950/10">
                    <h4 className="mb-3 text-sm font-extrabold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500 text-white text-xs">
                        A
                      </span>
                      <span>Amenazas (Riesgos del Entorno)</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentSwot.amenazas?.map((a, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Action Matrix */}
                {currentSwot.estrategias && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
                      Estrategias Cruzadas FODA
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Estrategia FO (Fortalezas + Oportunidades)
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {currentSwot.estrategias.FO}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Estrategia DO (Debilidades + Oportunidades)
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {currentSwot.estrategias.DO}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Estrategia FA (Fortalezas + Amenazas)
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {currentSwot.estrategias.FA}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Estrategia DA (Debilidades + Amenazas)
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {currentSwot.estrategias.DA}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: CONSULTORÍA CHAT IA */}
      {activeTab === 'chat' && (
        <div className="animate-in fade-in duration-200">
          <ChatTab decisionTitle={analysis.title} analysis={analysis} />
        </div>
      )}
    </div>
  );
};
