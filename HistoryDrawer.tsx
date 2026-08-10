import React, { useState } from 'react';
import { SavedDecision } from '../types';
import { X, History, Trash2, ExternalLink, CheckCircle, Clock, Archive, Download, Calendar } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  onUpdateStatus: (id: string, status: SavedDecision['status'], selectedOptionId?: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'decided' | 'archived'>('all');

  if (!isOpen) return null;

  const filteredDecisions = savedDecisions.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const getStatusBadge = (status: SavedDecision['status']) => {
    switch (status) {
      case 'decided':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle className="h-3 w-3" />
            <span>Decisión Tomada</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Archive className="h-3 w-3" />
            <span>Archivada</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            <span>En Evaluación</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Historial de Decisiones
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-1 border-b border-slate-200 px-6 py-2.5 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 text-xs">
            {(['all', 'pending', 'decided', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  filter === tab
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tab === 'all' && 'Todas'}
                {tab === 'pending' && 'Pendientes'}
                {tab === 'decided' && 'Tomadas'}
                {tab === 'archived' && 'Archivadas'}
              </button>
            ))}
          </div>

          {/* Decision List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredDecisions.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <History className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No hay decisiones guardadas aquí
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Guarda un análisis desde la pantalla principal para consultarlo más tarde
                </p>
              </div>
            ) : (
              filteredDecisions.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-amber-500"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {getStatusBadge(item.status)}
                    <span className="flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {item.analysis.title || item.input.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    Recomendación: <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {item.analysis.options.find((o) => o.optionId === item.analysis.recommendedOptionId)?.title || 'Ver análisis'}
                    </span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                    >
                      <span>Ver Análisis</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {item.status !== 'decided' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'decided')}
                          className="rounded p-1 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="Marcar como decisión tomada"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteDecision(item.id)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        title="Eliminar de historial"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
