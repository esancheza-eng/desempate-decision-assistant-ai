import React from 'react';
import { DECISION_TEMPLATES } from './templates';
import { DecisionTemplate } from './types';
import {
  X,
  Briefcase,
  Home,
  Rocket,
  GraduationCap,
  Car,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DecisionTemplate) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Home,
  Rocket,
  GraduationCap,
  Car,
};

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Plantillas Rápidas de Decisión
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Selecciona un escenario de ejemplo para probar el análisis en un solo clic
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content / Templates List */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {DECISION_TEMPLATES.map((template) => {
              const IconComponent =
                ICON_MAP[template.iconName] || Sparkles;

              return (
                <div
                  key={template.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ' '
                    ) {
                      event.preventDefault();
                      onSelectTemplate(template);
                      onClose();
                    }
                  }}
                  className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-amber-500"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        {template.category}
                      </span>

                      <div className="rounded-lg bg-slate-100 p-2 transition-colors group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-slate-700 dark:group-hover:bg-amber-900/40 dark:group-hover:text-amber-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <h3 className="mb-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                      {template.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
                      {template.context}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700/60">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {template.options.length} Opciones a comparar
                    </span>

                    <span className="flex items-center text-xs font-semibold text-amber-600 transition-transform group-hover:translate-x-0.5 dark:text-amber-400">
                      Usar Plantilla
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-right dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
