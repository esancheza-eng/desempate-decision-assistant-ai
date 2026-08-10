import React, { useState, useEffect } from 'react';
import { ComparisonCriteria, OptionAnalysis } from '../types';
import { Sliders, Award, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface InteractiveMatrixProps {
  initialCriteria: ComparisonCriteria[];
  options: OptionAnalysis[];
  onWeightsChanged?: (customWeights: Record<string, number>) => void;
}

export const InteractiveMatrix: React.FC<InteractiveMatrixProps> = ({
  initialCriteria,
  options,
  onWeightsChanged,
}) => {
  // State for criterion weights: criteriaId -> weight (1-10)
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialCriteria.forEach((c) => {
      map[c.id] = c.weight || 5;
    });
    return map;
  });

  // State for option ratings: `${criteriaId}_${optionId}` -> score (1-10)
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialCriteria.forEach((c) => {
      options.forEach((opt) => {
        const key = `${c.id}_${opt.optionId}`;
        map[key] = c.scores?.[opt.optionId] || 5;
      });
    });
    return map;
  });

  // Calculate weighted total scores for each option
  const calculateOptionTotals = () => {
    const totals: Record<string, number> = {};
    let totalWeight = 0;

    initialCriteria.forEach((c) => {
      const w = weights[c.id] ?? 5;
      totalWeight += w;
    });

    options.forEach((opt) => {
      let weightedSum = 0;
      initialCriteria.forEach((c) => {
        const w = weights[c.id] ?? 5;
        const key = `${c.id}_${opt.optionId}`;
        const s = scores[key] ?? 5;
        weightedSum += s * w;
      });

      // Normalize to 0-100 scale
      totals[opt.optionId] = totalWeight > 0 ? Math.round((weightedSum / (totalWeight * 10)) * 100) : 0;
    });

    return totals;
  };

  const optionTotals = calculateOptionTotals();

  // Find the highest scoring option
  let bestOptionId = '';
  let highestScore = -1;
  Object.entries(optionTotals).forEach(([optId, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestOptionId = optId;
    }
  });

  const handleWeightChange = (criteriaId: string, val: number) => {
    const updated = { ...weights, [criteriaId]: val };
    setWeights(updated);
    if (onWeightsChanged) {
      onWeightsChanged(updated);
    }
  };

  const handleScoreChange = (key: string, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    const resetWeights: Record<string, number> = {};
    const resetScores: Record<string, number> = {};
    initialCriteria.forEach((c) => {
      resetWeights[c.id] = c.weight || 5;
      options.forEach((opt) => {
        resetScores[`${c.id}_${opt.optionId}`] = c.scores?.[opt.optionId] || 5;
      });
    });
    setWeights(resetWeights);
    setScores(resetScores);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Matriz Interactiva de Ponderación
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ajusta la importancia de cada criterio y las calificaciones para recalcular el ganador personalizado en tiempo real
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 self-start sm:self-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Restablecer Ponderaciones</span>
        </button>
      </div>

      {/* Dynamic Results Bar */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {options.map((opt) => {
          const score = optionTotals[opt.optionId] || 0;
          const isWinner = opt.optionId === bestOptionId;

          return (
            <div
              key={opt.optionId}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                isWinner
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/30'
                  : 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              {isWinner && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Award className="h-3 w-3" />
                  <span>Ganador Matemático</span>
                </div>
              )}
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 pr-16">
                {opt.title}
              </h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {score}%
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Puntuación Afin</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isWinner ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Criteria Table / Sliders */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <th className="p-3 font-bold text-slate-700 dark:text-slate-200 min-w-[180px]">
                Criterio de Evaluación
              </th>
              <th className="p-3 font-bold text-slate-700 dark:text-slate-200 min-w-[160px]">
                Importancia para ti (1-10)
              </th>
              {options.map((opt) => (
                <th key={opt.optionId} className="p-3 font-bold text-slate-700 dark:text-slate-200 min-w-[140px]">
                  {opt.title} (1-10)
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {initialCriteria.map((criterion) => {
              const currentWeight = weights[criterion.id] ?? 5;

              return (
                <tr key={criterion.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {criterion.name}
                    </span>
                  </td>

                  {/* Weight Slider */}
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={currentWeight}
                        onChange={(e) => handleWeightChange(criterion.id, parseInt(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500 dark:bg-slate-700"
                      />
                      <span className="w-6 text-center font-bold text-amber-600 dark:text-amber-400">
                        {currentWeight}
                      </span>
                    </div>
                  </td>

                  {/* Option Scores */}
                  {options.map((opt) => {
                    const scoreKey = `${criterion.id}_${opt.optionId}`;
                    const currentScore = scores[scoreKey] ?? 5;
                    const note = criterion.notes?.[opt.optionId];

                    return (
                      <td key={opt.optionId} className="p-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={currentScore}
                              onChange={(e) => handleScoreChange(scoreKey, parseInt(e.target.value))}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-600 dark:bg-slate-700"
                            />
                            <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-200">
                              {currentScore}
                            </span>
                          </div>
                          {note && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1" title={note}>
                              {note}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
