import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Wrench, 
  CheckCheck,
  Quote
} from 'lucide-react';
import { ReviewResponse, ReviewVerdict } from '../types/review';

interface ReviewOverviewProps {
  review: ReviewResponse;
  onSelectTab: (tab: string) => void;
}

export const ReviewOverview: React.FC<ReviewOverviewProps> = ({ review, onSelectTab }) => {
  const { overallScore, verdict, verdictReason, consensusSummary, metrics, issues, qaReview } = review;

  const criticalIssuesCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssuesCount = issues.filter(i => i.severity === 'HIGH').length;
  const mediumIssuesCount = issues.filter(i => i.severity === 'MEDIUM').length;

  const getVerdictDetails = (v: ReviewVerdict) => {
    switch (v) {
      case 'CRITICAL_BLOCKER':
        return {
          title: 'Merge Blocked',
          badgeClass: 'bg-rose-950 text-rose-300 border-rose-700/80',
          bgBanner: 'from-rose-950/40 via-slate-900 to-slate-900 border-rose-800/60',
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
          desc: 'High severity security flaws, memory leaks, or crash hazards detected. Immediate rework required before deployment.',
        };
      case 'REQUEST_CHANGES':
        return {
          title: 'Changes Requested',
          badgeClass: 'bg-amber-950 text-amber-300 border-amber-700/80',
          bgBanner: 'from-amber-950/40 via-slate-900 to-slate-900 border-amber-800/60',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          desc: 'Architectural issues, logic bugs, or edge-case handling must be addressed before merge approval.',
        };
      case 'APPROVED_WITH_COMMENTS':
        return {
          title: 'Approved with Comments',
          badgeClass: 'bg-sky-950 text-sky-300 border-sky-700/80',
          bgBanner: 'from-sky-950/40 via-slate-900 to-slate-900 border-sky-800/60',
          icon: <CheckCircle2 className="w-5 h-5 text-sky-400" />,
          desc: 'Code is fundamentally sound. Reviewers recommend non-blocking code cleanups and minor test additions.',
        };
      case 'APPROVED':
        return {
          title: 'Approved (Production Ready)',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-700/80',
          bgBanner: 'from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-800/60',
          icon: <CheckCheck className="w-5 h-5 text-emerald-400" />,
          desc: 'Excellent code health. Adheres to quality, safety, and scalability standards.',
        };
    }
  };

  const verdictMeta = getVerdictDetails(verdict);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  return (
    <div className="space-y-4">
      {/* Executive Verdict Banner */}
      <div className={`p-4 rounded-xl border bg-gradient-to-r ${verdictMeta.bgBanner} shadow-lg relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 shadow-inner">
              {verdictMeta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  PR Governance Verdict
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${verdictMeta.badgeClass}`}>
                  {verdictMeta.title}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {verdictReason || verdictMeta.desc}
              </p>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-3 self-end sm:self-center bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl shadow-inner">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Health Index</div>
              <div className="text-xs text-slate-500">Benchmark /100</div>
            </div>
            <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-bold font-mono text-xl ${getScoreColor(overallScore)}`}>
              <span>{overallScore}</span>
            </div>
          </div>
        </div>

        {/* Committee Consensus Quote */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5">
          <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed italic">
            <span className="font-semibold not-italic text-indigo-300 mr-1.5">Consensus Review:</span>
            {consensusSummary}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onSelectTab('issues')}
          className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 transition-colors text-left group"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Critical Blockers</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {criticalIssuesCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 group-hover:text-indigo-300">
            {criticalIssuesCount > 0 ? 'Requires immediate fix' : 'No critical blockers'}
          </div>
        </button>

        <button
          onClick={() => onSelectTab('issues')}
          className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 transition-colors text-left group"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Major & Medium</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {highIssuesCount + mediumIssuesCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 group-hover:text-indigo-300">
            {highIssuesCount} High, {mediumIssuesCount} Medium
          </div>
        </button>

        <button
          onClick={() => onSelectTab('qa')}
          className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 transition-colors text-left group"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>QA Test Cases</span>
            <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400 mt-1">
            {qaReview?.testPlan?.length || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 group-hover:text-indigo-300">
            Ready-to-run suite generated
          </div>
        </button>

        <button
          onClick={() => onSelectTab('refactor')}
          className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 transition-colors text-left group"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Clean Refactor</span>
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            100%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 group-hover:text-indigo-300">
            Ready to apply & diff
          </div>
        </button>
      </div>

      {/* Metrics Diagnostic Progress Bars */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Quality Vector Breakdown</span>
          <span className="text-[10px] text-slate-500 font-normal">Audited against enterprise standards</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* Correctness */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Correctness & Logic
              </span>
              <span className="font-mono font-bold text-slate-200">{metrics.correctness}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.correctness >= 80 ? 'bg-emerald-500' : metrics.correctness >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.correctness}%` }}
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" /> Security & OWASP Posture
              </span>
              <span className="font-mono font-bold text-slate-200">{metrics.security}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.security >= 80 ? 'bg-emerald-500' : metrics.security >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.security}%` }}
              />
            </div>
          </div>

          {/* Performance */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" /> Performance & Concurrency
              </span>
              <span className="font-mono font-bold text-slate-200">{metrics.performance}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.performance >= 80 ? 'bg-emerald-500' : metrics.performance >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.performance}%` }}
              />
            </div>
          </div>

          {/* Maintainability */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-400" /> Architecture & Maintainability
              </span>
              <span className="font-mono font-bold text-slate-200">{metrics.maintainability}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.maintainability >= 80 ? 'bg-emerald-500' : metrics.maintainability >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.maintainability}%` }}
              />
            </div>
          </div>

          {/* Testability */}
          <div className="sm:col-span-2">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-indigo-400" /> Testability & Resilience
              </span>
              <span className="font-mono font-bold text-slate-200">{metrics.testability}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.testability >= 80 ? 'bg-emerald-500' : metrics.testability >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.testability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
