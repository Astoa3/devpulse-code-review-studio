import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Clipboard, 
  Download, 
  ArrowRightLeft, 
  CheckCircle2, 
  FileCode,
  Zap
} from 'lucide-react';

interface RefactoredCodeViewProps {
  refactoredCode: string;
  refactorHighlights?: string[];
  language: string;
  onApplyRefactor: (code: string) => void;
}

export const RefactoredCodeView: React.FC<RefactoredCodeViewProps> = ({
  refactoredCode,
  refactorHighlights,
  language,
  onApplyRefactor,
}) => {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const lines = refactoredCode.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyRefactor(refactoredCode);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : language === 'go' ? 'go' : 'ts';
    const blob = new Blob([refactoredCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refactored_clean.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              Production-Grade Clean Refactoring
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Issues Resolved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized by Senior SWE, QA & EM with strict typing, security sanitation, and high concurrency resilience.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleApply}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all ${
              applied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02]'
            }`}
            title="Replace original code in editor with this refactored code"
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied to Editor!</span>
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Apply to Editor</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Refactor Highlights */}
      {refactorHighlights && refactorHighlights.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Key Architectural & Security Fixes Applied</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {refactorHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refactored Code Block */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
        <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-200">refactored_clean.{language === 'python' ? 'py' : language === 'go' ? 'go' : 'ts'}</span>
            <span className="text-slate-600">|</span>
            <span>{lines.length} lines</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-sans font-medium">Production Hardened</span>
        </div>

        <div className="flex max-h-[500px] overflow-y-auto">
          {/* Gutter */}
          <div className="w-12 py-3 bg-slate-950 border-r border-slate-850 select-none text-right pr-2 text-slate-600 font-mono leading-5">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code */}
          <pre className="p-3 text-slate-200 overflow-x-auto leading-5 flex-1 font-mono">
            <code>{refactoredCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
