import React from 'react';
import { DECISION_TEMPLATES } from '../data/templates';
import { DecisionTemplate } from '../types';
import { X, Briefcase, Home, Rocket, GraduationCap, Car, Sparkles, ArrowRight } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Plantillas Rápidas de Decisión
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona un escenario de ejemplo para probar el análisis en un solo clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content / Templates List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {DECISION_TEMPLATES.map((template) => {
              const IconComponent = ICON_MAP[template.iconName] || Sparkles;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-amber-500 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        {template.category}
                      </span>
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-slate-700 dark:group-hover:bg-amber-900/40 dark:group-hover:text-amber-400 transition-colors">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                      {template.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                      {template.context}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {template.options.length} Opciones a comparar
                    </span>
                    <span className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      Usar Plantilla <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 text-right">
          <button
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
