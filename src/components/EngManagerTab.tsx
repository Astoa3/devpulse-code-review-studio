import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Cpu, 
  TrendingDown, 
  AlertOctagon, 
  CheckCircle2, 
  Compass, 
  Gauge,
  Briefcase
} from 'lucide-react';
import { EngManagerReview } from '../types/review';

interface EngManagerTabProps {
  emReview: EngManagerReview;
}

export const EngManagerTab: React.FC<EngManagerTabProps> = ({ emReview }) => {
  const { 
    summary, 
    architecturalRisks, 
    securityRisks, 
    scalabilityBottlenecks, 
    techDebtAssessment, 
    rolloutRisks, 
    recommendedAction 
  } = emReview;

  return (
    <div className="space-y-4">
      {/* Persona Header Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Engineering Manager / Director of Eng
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-semibold">
                Eng Management
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Focus: Architectural coherence, security risk posture, scalability boundaries, tech debt & deployment rollout safety.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          {summary}
        </p>
      </div>

      {/* Strategic Risks Grid: Architecture, Security, Scalability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Architectural Risks */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Architecture & Coupling</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {architecturalRisks && architecturalRisks.length > 0 ? (
              architecturalRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No critical architectural fractures.</li>
            )}
          </ul>
        </div>

        {/* Security Risks */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Security Posture & OWASP</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {securityRisks && securityRisks.length > 0 ? (
              securityRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-rose-400 font-bold">!</span>
                  <span>{risk}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No CVE or credential leaks identified.</li>
            )}
          </ul>
        </div>

        {/* Scalability Bottlenecks */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>Scalability & Load Limits</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {scalabilityBottlenecks && scalabilityBottlenecks.length > 0 ? (
              scalabilityBottlenecks.map((bottle, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-amber-400 font-bold">⚡</span>
                  <span>{bottle}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Scalability bounds acceptable.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Tech Debt Assessment */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <TrendingDown className="w-4 h-4 text-indigo-400" />
          <span>Technical Debt & Ongoing Maintenance Burden</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          {techDebtAssessment}
        </p>
      </div>

      {/* Recommended Action & Rollout Strategy */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-800/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Managerial Rollout Strategy & Deployment Guardrails</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {recommendedAction}
        </p>

        {rolloutRisks && rolloutRisks.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Rollout Contingency Safeguards:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {rolloutRisks.map((rr, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-indigo-400">→</span>
                  <span>{rr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
