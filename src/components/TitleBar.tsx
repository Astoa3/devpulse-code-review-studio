import React from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Terminal, 
  Sparkles, 
  Layers, 
  Maximize2, 
  Columns3, 
  FileCode, 
  ShieldCheck,
  Zap,
  Monitor
} from 'lucide-react';

interface TitleBarProps {
  layoutMode: 'split' | 'code' | 'review';
  setLayoutMode: (mode: 'split' | 'code' | 'review') => void;
  language: string;
  isReviewing: boolean;
  score: number | null;
  onOpenWindowsModal?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  layoutMode,
  setLayoutMode,
  language,
  isReviewing,
  score,
  onOpenWindowsModal,
}) => {
  return (
    <div className="h-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-3 select-none text-xs text-slate-300 font-sans z-50">
      {/* Left: Windows App Branding & Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-sm shadow-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-100 font-semibold tracking-wide">DevPulse</span>
          <span className="text-slate-400">Review Studio</span>
          <button
            onClick={onOpenWindowsModal}
            className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-200 border border-indigo-800/60 transition-colors flex items-center gap-1"
            title="Click to view instructions for running or exporting as Windows .exe"
          >
            <Monitor className="w-2.5 h-2.5 text-sky-400" />
            <span>Win64 .exe</span>
          </button>
        </div>
        <span className="text-slate-600">|</span>
        <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-200">workspace.{language === 'python' ? 'py' : language === 'go' ? 'go' : 'ts'}</span>
          {score !== null && (
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
              score >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
              score >= 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              Score: {score}/100
            </span>
          )}
        </div>
      </div>

      {/* Middle: Shortcut / Review Status */}
      <div className="hidden lg:flex items-center gap-3">
        {isReviewing ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Senior SWE, QA & EM Committee in Session...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[11px]">Simulating:</span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/70 text-sky-300 text-[10px]">Senior SWE</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/70 text-amber-300 text-[10px]">Senior QA</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/70 text-purple-300 text-[10px]">Engineering Mgr</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl + Enter
            </kbd>
          </div>
        )}
      </div>

      {/* Right: Layout Switcher & Windows Window Controls */}
      <div className="flex items-center gap-2">
        {/* Layout Modes */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 mr-2">
          <button
            onClick={() => setLayoutMode('split')}
            title="Split View (Code + Review)"
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
              layoutMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns3 className="w-3 h-3" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setLayoutMode('code')}
            title="Code Editor Only"
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
              layoutMode === 'code' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            onClick={() => setLayoutMode('review')}
            title="Review Panel Only"
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
              layoutMode === 'review' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Review</span>
          </button>
        </div>

        {/* Windows Standard Controls */}
        <div className="flex items-center -mr-2">
          <button 
            className="w-9 h-10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            className="w-9 h-10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Maximize"
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
