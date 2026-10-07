import React, { useState } from 'react';
import { 
  Play, 
  FolderOpen, 
  FileText, 
  Trash2, 
  Share2, 
  SlidersHorizontal, 
  Sparkles, 
  UserCheck, 
  Bug, 
  ShieldAlert, 
  Cpu, 
  RotateCcw, 
  Check, 
  ChevronDown,
  Monitor,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { SAMPLE_CODES, CodeSample } from '../data/samples';

interface ToolbarProps {
  language: string;
  setLanguage: (lang: string) => void;
  onSelectSample: (sample: CodeSample) => void;
  onRunReview: () => void;
  onClear: () => void;
  isReviewing: boolean;
  hasCode: boolean;
  onOpenContext: () => void;
  onOpenExport: () => void;
  onOpenWindowsModal: () => void;
  hasContext: boolean;
  hasReview: boolean;
  hasCodeChanges: boolean;
}

const LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go (Golang)' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  language,
  setLanguage,
  onSelectSample,
  onRunReview,
  onClear,
  isReviewing,
  hasCode,
  onOpenContext,
  onOpenExport,
  onOpenWindowsModal,
  hasContext,
  hasReview,
  hasCodeChanges,
}) => {
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left controls: Language & Presets */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs">
          <span className="text-slate-400 font-medium">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-slate-900 text-slate-200">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Load Sample Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSamplesMenu(!showSamplesMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Sample Buggy Code</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSamplesMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSamplesMenu(false)} 
              />
              <div className="absolute left-0 mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl shadow-black/50 z-50 py-1.5 overflow-hidden">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Vulnerable / Flawed Code Sample
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-850">
                  {SAMPLE_CODES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample);
                        setShowSamplesMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors group flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                        <span>{sample.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {sample.language}
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-400/90 font-medium">
                        {sample.category}
                      </span>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                        {sample.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PR Context / Specs modal trigger */}
        <button
          onClick={onOpenContext}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors relative ${
            hasContext
              ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
              : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300'
          }`}
          title="Add PR Description, Architecture Constraints, or Deployment SLA"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>PR Context</span>
          {hasContext && (
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          )}
        </button>

        {/* Windows .exe Packaging Button */}
        <button
          onClick={onOpenWindowsModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-colors"
          title="Get DevPulse as a Windows Desktop App (.exe)"
        >
          <Monitor className="w-3.5 h-3.5 text-sky-400" />
          <span>Windows .exe App</span>
        </button>

        {/* Clear code button */}
        {hasCode && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Clear Editor (To rewrite from blank scratch)"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Right controls: Resubmit / Review Action & Export */}
      <div className="flex items-center gap-2">
        {/* Code edited notice indicator */}
        {hasCodeChanges && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Code modified</span>
          </div>
        )}

        {/* Committee representation badges */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] bg-slate-950/70 border border-slate-800 px-2 py-1 rounded-md text-slate-400">
          <span className="text-slate-500">Reviewers:</span>
          <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
            <Cpu className="w-3 h-3" /> Senior SWE
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
            <Bug className="w-3 h-3" /> Senior QA
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-purple-400 font-medium">
            <ShieldAlert className="w-3 h-3" /> Eng Mgr
          </span>
        </div>

        {/* Export Report */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>

        {/* 1-Click Download Project .zip for GitHub */}
        <button
          onClick={() => {
            window.location.href = '/api/download-zip';
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-800/90 hover:bg-slate-750 text-emerald-300 border border-slate-700 hover:border-emerald-700 transition-colors cursor-pointer"
          title="Download entire codebase as a clean zip to push to GitHub"
        >
          <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Project .zip</span>
        </button>

        {/* Primary Review / Resubmit Button */}
        <button
          onClick={onRunReview}
          disabled={isReviewing || !hasCode}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold shadow-md transition-all ${
            isReviewing
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : !hasCode
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : hasCodeChanges
              ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white shadow-amber-600/30 hover:shadow-amber-600/50 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-amber-500/50'
              : hasReview
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98]'
          }`}
          title="Resubmit or Run Review (Ctrl + Enter)"
        >
          {isReviewing ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Analyzing Code...</span>
            </>
          ) : hasCodeChanges ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-white animate-spin-slow" />
              <span>Resubmit Modified Code (Ctrl+Enter)</span>
            </>
          ) : hasReview ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-indigo-200" />
              <span>Resubmit / Re-Review (Ctrl+Enter)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Simulate 3-Persona Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
