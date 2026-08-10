import React, { useState } from 'react';
import { DecisionInput } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  SlidersHorizontal,
  Clock,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Table,
  Grid2X2,
  Compass
} from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (input: DecisionInput) => void;
  isLoading: boolean;
  onOpenTemplates: () => void;
}

const DEFAULT_PRIORITIES = [
  'Ingresos y Costos (Financiero)',
  'Paz Mental y Nivel de Estrés',
  'Tiempo y Flexibilidad',
  'Crecimiento Profesional',
  'Estabilidad y Seguridad',
  'Impacto en Familia / Relaciones',
  'Salud y Bienestar',
  'Riesgo e Incertidumbre'
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onOpenTemplates,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Ingresos y Costos (Financiero)',
    'Paz Mental y Nivel de Estrés',
    'Tiempo y Flexibilidad'
  ]);
  const [customPriority, setCustomPriority] = useState('');
  const [urgency, setUrgency] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [analysisMode, setAnalysisMode] = useState<'completo' | 'ventajas_desventajas' | 'comparativa' | 'foda'>('completo');

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const togglePriority = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleAddCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPriority.trim() && !selectedPriorities.includes(customPriority.trim())) {
      setSelectedPriorities([...selectedPriorities, customPriority.trim()]);
      setCustomPriority('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter non-empty options
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length === 0) {
      cleanOptions.push('Realizar el cambio');
      cleanOptions.push('Mantener la situación actual');
    } else if (cleanOptions.length === 1) {
      cleanOptions.push('No realizar esta acción (Mantener status quo)');
    }

    onSubmit({
      title: title.trim(),
      context: context.trim(),
      options: cleanOptions,
      userPriorities: selectedPriorities,
      urgency,
      analysisMode,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Hero Header Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl shadow-amber-500/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-100" />
            <span>Asistente de Inteligencia Artificial para Decisiones</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            ¿Atrapado en un dilema o decisión difícil?
          </h2>
          <p className="mt-2 text-sm text-amber-50 sm:text-base">
            Desempate analiza tus alternativas, sopesa los pros y contras, genera tablas comparativas y realiza un análisis FODA estratégico para darte claridad absoluta.
          </p>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-amber-800 shadow-md transition hover:bg-amber-50 sm:text-sm active:scale-95"
          >
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <span>Probar con una plantilla de ejemplo</span>
          </button>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Decision Title */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                1
              </span>
              <span>¿Qué decisión necesitas tomar?</span>
            </label>
            <span className="text-xs text-amber-600 font-semibold dark:text-amber-400">Requerido</span>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: ¿Debería cambiarme al trabajo en la Startup o quedarme en mi puesto actual?"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500"
            required
          />

          {/* Context / Additional details */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Contexto o detalles adicionales (opcional):
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Cuéntanos más sobre la situación: fechas límite, temores, presupuesto, compromisos familiares o cualquier factor clave..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Step 2: Options to Compare */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                2
              </span>
              <span>Opciones a comparar</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Mínimo 2 opciones (o deja 1 y se creará la opción implícita de 'No hacerlo')
            </span>
          </div>

          <div className="space-y-3">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opción ${String.fromCharCode(65 + index)} (Ej: ${
                    index === 0 ? 'Aceptar oferta en la Startup' : 'Permanecer en empleo actual'
                  })`}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Eliminar opción"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 4 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 inline-flex items-center space-x-1 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir otra opción (hasta 4)</span>
            </button>
          )}
        </div>

        {/* Step 3: Priorities & Important Criteria */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <label className="flex items-center space-x-2 text-base font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                3
              </span>
              <span>¿Qué es lo más importante para ti en esta decisión?</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">Selecciona varias</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {DEFAULT_PRIORITIES.map((priority) => {
              const isSelected = selectedPriorities.includes(priority);
              return (
                <button
                  type="button"
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`inline-flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`}
                  />
                  <span>{priority}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom priority input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customPriority}
              onChange={(e) => setCustomPriority(e.target.value)}
              placeholder="Agregar otra prioridad personalizada (Ej: Cercanía a la playa, Aprendizaje)..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddCustomPriority}
              className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Step 4: Urgency & Analysis Mode */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Urgency Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-white">
              Nivel de Urgencia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Baja', 'Media', 'Alta'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    urgency === lvl
                      ? 'bg-slate-900 text-white shadow-md dark:bg-amber-500 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis View Mode */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-white">
              Formato de Análisis Principal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'completo', label: 'Análisis Completo (Recomendado)', icon: Compass },
                { id: 'ventajas_desventajas', label: 'Pros y Contras', icon: FileText },
                { id: 'comparativa', label: 'Tabla Comparativa', icon: Table },
                { id: 'foda', label: 'Análisis FODA / SWOT', icon: Grid2X2 },
              ].map((mode) => {
                const IconComp = mode.icon;
                const isSelected = analysisMode === mode.id;
                return (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() => setAnalysisMode(mode.id as any)}
                    className={`flex items-center space-x-2 rounded-xl p-2.5 text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="group relative flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-4 font-extrabold text-white shadow-xl shadow-amber-500/25 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 text-base"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Analizando decisión con la IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-amber-200 transition-transform group-hover:rotate-12" />
                <span>Analizar Decisión y Desempatar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
