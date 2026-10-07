import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { SeniorDevReview } from '../types/review';

interface SeniorSweTabProps {
  sweReview: SeniorDevReview;
  onJumpToLine?: (line: string) => void;
}

export const SeniorSweTab: React.FC<SeniorSweTabProps> = ({ sweReview, onJumpToLine }) => {
  const { summary, topStrengths, codeSmells, idiomaticAdvice, lineComments } = sweReview;

  return (
    <div className="space-y-4">
      {/* Persona Header Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-900/60 border border-sky-700/60 flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Senior Software Engineer Review
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-semibold">
                Staff / Principal SWE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Focus: Clean code, TypeScript safety, idiomatic patterns, maintainability & refactoring.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          {summary}
        </p>
      </div>

      {/* Code Smells & Strengths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Code Smells */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Anti-Patterns & Code Smells</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {codeSmells && codeSmells.length > 0 ? (
              codeSmells.map((smell, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{smell}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No significant code smells detected.</li>
            )}
          </ul>
        </div>

        {/* Strengths / Clean Patterns */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Positive Patterns & Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {topStrengths && topStrengths.length > 0 ? (
              topStrengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{strength}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Functional baseline present.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Idiomatic Advice */}
      {idiomaticAdvice && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs font-semibold text-indigo-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Language & Idiomatic Conventions</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {idiomaticAdvice}
          </p>
        </div>
      )}

      {/* Inline Code Comments */}
      {lineComments && lineComments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Senior SWE Line Comments ({lineComments.length})
          </h4>
          <div className="space-y-2">
            {lineComments.map((comment, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onJumpToLine?.(comment.line)}
                    className="flex items-center gap-1 text-[11px] font-mono font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60"
                  >
                    <span>Line {comment.line}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800">
                    {comment.severity || 'NOTE'}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {comment.comment}
                </p>
                {comment.suggestedChange && (
                  <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-300">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Suggested syntax:</span>
                    <code>{comment.suggestedChange}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
