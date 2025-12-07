import React from 'react';
import { AnalysisResult } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX 
} from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const SafetyIcon = () => {
    switch (result.safetyLevel) {
      case 'Safe': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Caution': return <ShieldAlert className="w-6 h-6 text-yellow-400" />;
      case 'Dangerous': return <ShieldX className="w-6 h-6 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{result.exerciseName}</h2>
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4" />
              <span>Целевые мышцы: {result.muscleGroups.join(', ')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Оценка</div>
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}<span className="text-lg text-slate-500">/10</span>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="text-center flex flex-col items-center">
              <div className="text-sm text-slate-400 mb-1">Безопасность</div>
              <div className="flex items-center gap-2 font-medium text-slate-200">
                <SafetyIcon />
                {result.safetyLevel === 'Safe' ? 'Безопасно' : 
                 result.safetyLevel === 'Caution' ? 'Осторожно' : 'Опасно'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Плохая техника</span>
            <span>Идеальная техника</span>
          </div>
          <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreBg(result.score)} transition-all duration-1000 ease-out`}
              style={{ width: `${result.score * 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Good Points */}
        <div className="bg-slate-800/30 border border-emerald-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Правильно</h3>
          </div>
          <ul className="space-y-3">
            {result.goodPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="w-1.5 h-1.5 mt-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Mistakes */}
        <div className="bg-slate-800/30 border border-red-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Ошибки</h3>
          </div>
          {result.mistakes.length > 0 ? (
            <ul className="space-y-3">
              {result.mistakes.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="w-1.5 h-1.5 mt-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">Существенных ошибок не обнаружено.</p>
          )}
        </div>

      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Рекомендации тренера</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};