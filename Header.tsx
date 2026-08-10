import React from 'react';
import { Scale, History, Sparkles, PlusCircle, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenTemplates,
  onOpenHistory,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Name */}
        <div
          onClick={onNewDecision}
          className="group flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30">
            <Scale className="h-6 w-6 transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Desiciones
              </h1>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                IA Decisiones
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Transforma dudas en decisiones claras con análisis de Pros, Comparación y FODA
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenTemplates}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Ver plantillas rápidas de ejemplo"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="hidden xs:inline">Plantillas</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Ver mi historial de decisiones"
          >
            <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Historial</span>
            {savedCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onNewDecision}
            className="flex items-center space-x-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-500 active:scale-95 sm:text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nueva Decisión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
