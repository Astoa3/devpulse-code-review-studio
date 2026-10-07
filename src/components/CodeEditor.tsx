import React, { useRef, useEffect, useState } from 'react';
import { 
  Clipboard, 
  Upload, 
  FileCode, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Maximize2,
  Sparkles,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  highlightLine?: string | null;
  onClearHighlight?: () => void;
  onRunReview?: () => void;
  isReviewing?: boolean;
  hasCodeChanges?: boolean;
  hasReview?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  highlightLine,
  onClearHighlight,
  onRunReview,
  isReviewing = false,
  hasCodeChanges = false,
  hasReview = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);

  const lines = code.split('\n');
  const totalLines = Math.max(lines.length, 1);

  // Sync scroll between textarea and line number gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position to highlight current line
  const handleKeyUpOrClick = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, pos);
    const lineNum = textBefore.split('\n').length;
    setActiveLineNumber(lineNum);
  };

  // Handle Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Scroll to highlighted line from review panel if specified
  useEffect(() => {
    if (highlightLine && textareaRef.current) {
      const match = highlightLine.match(/\d+/);
      if (match) {
        const lineNum = parseInt(match[0], 10);
        if (lineNum > 0 && lineNum <= lines.length) {
          const lineHeight = 20; // approximate line height in px
          textareaRef.current.scrollTop = Math.max(0, (lineNum - 4) * lineHeight);
          setActiveLineNumber(lineNum);
        }
      }
    }
  }, [highlightLine, lines.length]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleCopyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-100 font-mono text-sm relative">
      {/* Editor Subheader / Info Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400 select-none gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Source Editor</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400">
            {totalLines} lines • {code.length} chars
          </span>
          {highlightLine && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 text-[11px]">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Target: Line {highlightLine}</span>
              <button 
                onClick={onClearHighlight} 
                className="hover:text-amber-100 ml-1 font-bold text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Action buttons including immediate RESUBMIT BUTTON */}
        <div className="flex items-center gap-1.5">
          {/* Prominent Resubmit Code Button right here on the editor */}
          {onRunReview && code.trim() && (
            <button
              onClick={onRunReview}
              disabled={isReviewing}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all ${
                isReviewing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : hasCodeChanges
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400/50 animate-pulse'
                  : hasReview
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
              title="Resubmit current code to 3-Persona review panel (Ctrl + Enter)"
            >
              {isReviewing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Reviewing...</span>
                </>
              ) : hasCodeChanges ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resubmit Changes (Ctrl+Enter)</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{hasReview ? 'Resubmit Code' : 'Review Code'}</span>
                </>
              )}
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".ts,.js,.tsx,.jsx,.py,.go,.rs,.java,.cpp,.c,.sql,.json,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] transition-colors"
            title="Upload source file from disk"
          >
            <Upload className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={handlePasteClipboard}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] transition-colors"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {code && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] transition-colors"
              title="Copy current code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body: Line numbers + Monospace Textarea */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="w-12 py-3 bg-slate-950/80 border-r border-slate-800/80 select-none text-right pr-2 text-slate-600 font-mono text-xs overflow-hidden"
          style={{ lineHeight: '1.5rem' }}
        >
          {Array.from({ length: totalLines }).map((_, i) => {
            const lineNum = i + 1;
            const isTarget = highlightLine && highlightLine.includes(lineNum.toString());
            const isActive = activeLineNumber === lineNum;
            return (
              <div
                key={lineNum}
                className={`transition-colors ${
                  isTarget
                    ? 'text-amber-400 font-bold bg-amber-950/50 -mr-2 pr-2'
                    : isActive
                    ? 'text-indigo-400 font-medium'
                    : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onKeyUp={handleKeyUpOrClick}
          onClick={handleKeyUpOrClick}
          onKeyDown={handleKeyDown}
          placeholder={`// Paste your ${language} code here to review...\n// Or click "Load Sample Buggy Code" above to test immediately.\n// Edit anytime and click "Resubmit Code" or press Ctrl+Enter.`}
          className="flex-1 p-3 bg-slate-950 text-slate-200 font-mono text-xs md:text-sm leading-6 resize-none focus:outline-none selection:bg-indigo-700 selection:text-white overflow-y-auto whitespace-pre tab-4"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />

        {/* Empty state helper overlay if no code */}
        {!code && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            <div className="max-w-md bg-slate-900/80 border border-slate-800 p-6 rounded-xl text-center backdrop-blur-sm shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                Paste or Write Code to Review
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Paste any function, middleware, component, or algorithm. You can edit code freely at any time and click <strong className="text-indigo-300">Resubmit Code</strong> to re-evaluate!
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] text-left">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-sky-400 block">Senior SWE</span>
                  <span className="text-slate-400 text-[10px]">Clean code, idioms & logic bugs</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-amber-400 block">Senior QA</span>
                  <span className="text-slate-400 text-[10px]">Edge cases, boundary & tests</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-purple-400 block">Eng Manager</span>
                  <span className="text-slate-400 text-[10px]">Security, scale & tech debt</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Footer */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-3 py-1 flex items-center justify-between text-[11px] text-slate-500 font-sans select-none">
        <div className="flex items-center gap-3">
          <span>Ln {activeLineNumber}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          {hasCodeChanges && (
            <span className="text-amber-400 font-medium animate-pulse">
              ● Modified (Press Ctrl+Enter to resubmit)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-indigo-400">{language}</span>
        </div>
      </div>
    </div>
  );
};
