import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bug, 
  ShieldAlert, 
  Cpu, 
  Briefcase, 
  TestTube2, 
  Wrench, 
  MessageSquare, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Columns3, 
  FileCode, 
  Shield, 
  Activity,
  Terminal,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Monitor
} from 'lucide-react';

import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { CodeEditor } from './components/CodeEditor';
import { ReviewOverview } from './components/ReviewOverview';
import { IssuesList } from './components/IssuesList';
import { SeniorSweTab } from './components/SeniorSweTab';
import { SeniorQaTab } from './components/SeniorQaTab';
import { EngManagerTab } from './components/EngManagerTab';
import { RefactoredCodeView } from './components/RefactoredCodeView';
import { ReviewerChat } from './components/ReviewerChat';
import { PrContextModal } from './components/PrContextModal';
import { ExportModal } from './components/ExportModal';
import { WindowsExeModal } from './components/WindowsExeModal';

import { SAMPLE_CODES, CodeSample } from './data/samples';
import { ReviewResponse } from './types/review';

export default function App() {
  // Initialize with the realistic auth & race condition sample code
  const [code, setCode] = useState<string>(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState<string>(SAMPLE_CODES[0].language);
  const [context, setContext] = useState<string>(SAMPLE_CODES[0].context);

  const [layoutMode, setLayoutMode] = useState<'split' | 'code' | 'review'>('split');
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'swe' | 'qa' | 'em' | 'refactor' | 'chat'>('overview');
  const [highlightLine, setHighlightLine] = useState<string | null>(null);

  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [lastReviewedCode, setLastReviewedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState<boolean>(false);

  // Detect whether the code was modified since the last review
  const hasCodeChanges = Boolean(review && lastReviewedCode !== null && code.trim() !== lastReviewedCode.trim());

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to trigger review or resubmit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (code.trim() && !isReviewing) {
          handleRunReview();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isReviewing, language, context]);

  const handleSelectSample = (sample: CodeSample) => {
    setCode(sample.code);
    setLanguage(sample.language);
    setContext(sample.context);
    setReview(null);
    setLastReviewedCode(null);
    setError(null);
    setHighlightLine(null);
    setActiveTab('overview');
  };

  const handleClear = () => {
    setCode('');
    setReview(null);
    setLastReviewedCode(null);
    setError(null);
    setHighlightLine(null);
    setContext('');
  };

  const handleJumpToLine = (line: string) => {
    setHighlightLine(line);
    // If in review-only layout mode, automatically switch to split so user sees line in editor!
    if (layoutMode === 'review') {
      setLayoutMode('split');
    }
  };

  const handleApplyRefactor = (newCode: string) => {
    setCode(newCode);
    setHighlightLine(null);
  };

  const handleRunReview = async () => {
    if (!code.trim() || isReviewing) return;

    setIsReviewing(true);
    setError(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          context,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with HTTP ${res.status}`);
      }

      const reviewData: ReviewResponse = await res.json();
      setReview(reviewData);
      setLastReviewedCode(code);
      setActiveTab('overview');
      // If user was on code-only view, flip to split to see feedback!
      if (layoutMode === 'code') {
        setLayoutMode('split');
      }
    } catch (err: any) {
      console.error('Review error:', err);
      setError(err.message || 'Failed to complete AI code review.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Windows 11 Title Bar */}
      <TitleBar
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        language={language}
        isReviewing={isReviewing}
        score={review?.overallScore ?? null}
        onOpenWindowsModal={() => setIsWindowsModalOpen(true)}
      />

      {/* Studio Command Toolbar */}
      <Toolbar
        language={language}
        setLanguage={setLanguage}
        onSelectSample={handleSelectSample}
        onRunReview={handleRunReview}
        onClear={handleClear}
        isReviewing={isReviewing}
        hasCode={Boolean(code.trim())}
        onOpenContext={() => setIsContextModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenWindowsModal={() => setIsWindowsModalOpen(true)}
        hasContext={Boolean(context.trim())}
        hasReview={Boolean(review)}
        hasCodeChanges={hasCodeChanges}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Code Editor */}
        <div
          className={`h-full transition-all duration-300 ${
            layoutMode === 'code'
              ? 'w-full'
              : layoutMode === 'review'
              ? 'hidden'
              : 'w-full lg:w-1/2 flex-1'
          }`}
        >
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            highlightLine={highlightLine}
            onClearHighlight={() => setHighlightLine(null)}
            onRunReview={handleRunReview}
            isReviewing={isReviewing}
            hasCodeChanges={hasCodeChanges}
            hasReview={Boolean(review)}
          />
        </div>

        {/* Right Pane: 3-Persona Review Dashboard */}
        <div
          className={`h-full flex flex-col bg-slate-920 transition-all duration-300 ${
            layoutMode === 'review'
              ? 'w-full'
              : layoutMode === 'code'
              ? 'hidden'
              : 'w-full lg:w-1/2 flex-1 border-l border-slate-800'
          }`}
        >
          {/* Code Changed Notification Banner (when code is rewritten after a review) */}
          {hasCodeChanges && !isReviewing && (
            <div className="m-2.5 p-2.5 rounded-lg bg-amber-950/80 border border-amber-700/80 text-amber-200 text-xs flex items-center justify-between shadow-lg shadow-amber-950/40">
              <span className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Source code was modified. Resubmit to update the review.</span>
              </span>
              <button
                onClick={handleRunReview}
                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                title="Resubmit code for a fresh 3-Persona review (Ctrl + Enter)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resubmit Code (Ctrl+Enter)</span>
              </button>
            </div>
          )}

          {/* Review Panel Header / Tabs Navigation */}
          <div className="bg-slate-950 border-b border-slate-800 px-3 pt-2 flex items-center justify-between overflow-x-auto gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Verdict</span>
              </button>

              <button
                onClick={() => setActiveTab('issues')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'issues'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>Issues Matrix</span>
                {review && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                    {review.issues.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('swe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'swe'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Senior SWE</span>
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'qa'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <TestTube2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Senior QA</span>
                {review?.qaReview?.testPlan?.length && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                    {review.qaReview.testPlan.length} tests
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('em')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'em'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Eng Manager</span>
              </button>

              <button
                onClick={() => setActiveTab('refactor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'refactor'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>Refactored Code</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-colors border-t border-x ${
                  activeTab === 'chat'
                    ? 'bg-slate-900 text-slate-100 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask Reviewers</span>
              </button>
            </div>
          </div>

          {/* Review Panel Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-925">
            {/* Loading State */}
            {isReviewing && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-900/30">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  Engineering Committee Reviewing Code
                </h3>
                <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                  Synthesizing perspectives from Senior SWE (clean code & typing), Senior QA (edge cases & test plans), and Engineering Manager (security & architecture)...
                </p>

                {/* Persona indicators */}
                <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm w-full text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sky-300 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Senior SWE</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 flex items-center gap-2">
                    <Bug className="w-3.5 h-3.5 animate-pulse" />
                    <span>Senior QA</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Eng Mgr</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !isReviewing && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs space-y-2 mb-4">
                <div className="flex items-center gap-2 font-semibold text-rose-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Review Processing Error</span>
                </div>
                <p>{error}</p>
                <button
                  onClick={handleRunReview}
                  className="px-3 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-white font-medium transition-colors cursor-pointer"
                >
                  Retry Analysis
                </button>
              </div>
            )}

            {/* Empty State before first review run */}
            {!review && !isReviewing && !error && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">
                  Awaiting Code Submission
                </h3>
                <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                  Click <strong className="text-slate-200">"Simulate 3-Persona Review"</strong> or press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 text-[10px] font-mono">Ctrl + Enter</kbd> to inspect the source code.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-lg w-full text-left">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-1">
                      <Cpu className="w-4 h-4" /> Senior SWE
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Catches anti-patterns, typing flaws, and provides clean refactorings.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
                      <Bug className="w-4 h-4" /> Senior QA
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Uncovers edge cases, concurrency races, and writes automated test suites.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
                      <Briefcase className="w-4 h-4" /> Eng Manager
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Audits OWASP security risks, scalability bottlenecks, and merge verdict.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRunReview}
                  className="mt-6 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Review Committee</span>
                </button>
              </div>
            )}

            {/* Review Content Active */}
            {review && !isReviewing && (
              <>
                {activeTab === 'overview' && (
                  <ReviewOverview
                    review={review}
                    onSelectTab={(tab) => setActiveTab(tab as any)}
                  />
                )}

                {activeTab === 'issues' && (
                  <IssuesList
                    issues={review.issues}
                    onJumpToLine={handleJumpToLine}
                  />
                )}

                {activeTab === 'swe' && (
                  <SeniorSweTab
                    sweReview={review.seniorDevReview}
                    onJumpToLine={handleJumpToLine}
                  />
                )}

                {activeTab === 'qa' && (
                  <SeniorQaTab
                    qaReview={review.qaReview}
                    language={language}
                  />
                )}

                {activeTab === 'em' && (
                  <EngManagerTab
                    emReview={review.engManagerReview}
                  />
                )}

                {activeTab === 'refactor' && (
                  <RefactoredCodeView
                    refactoredCode={review.refactoredCode}
                    refactorHighlights={review.refactorHighlights}
                    language={language}
                    onApplyRefactor={handleApplyRefactor}
                  />
                )}

                {activeTab === 'chat' && (
                  <ReviewerChat
                    code={code}
                    language={language}
                    review={review}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Windows App Status Bar Footer */}
      <div className="h-6 bg-slate-950 border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 font-sans select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">DevPulse Engine Online</span>
          </div>
          <span className="text-slate-700">|</span>
          <span>Model: gemini-3.8-flash</span>
          {review && (
            <>
              <span className="text-slate-700">|</span>
              <span className="text-indigo-400">
                Issues: {review.issues.length} detected
              </span>
            </>
          )}
          {hasCodeChanges && (
            <>
              <span className="text-slate-700">|</span>
              <span className="text-amber-400 font-medium">
                Unsaved changes (Press Ctrl+Enter to resubmit)
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <button
            onClick={() => setIsWindowsModalOpen(true)}
            className="hover:text-indigo-300 text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Monitor className="w-3 h-3 text-sky-400" />
            <span>Windows Desktop (.exe)</span>
          </button>
          <span className="text-slate-700">|</span>
          <span>Committees: SSE • QA • EM</span>
        </div>
      </div>

      {/* PR Context Settings Modal */}
      <PrContextModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        context={context}
        setContext={setContext}
      />

      {/* Export Report Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        review={review}
        language={language}
      />

      {/* Windows .exe Packaging & Running Guide Modal */}
      <WindowsExeModal
        isOpen={isWindowsModalOpen}
        onClose={() => setIsWindowsModalOpen(false)}
        appUrl={window.location.origin}
      />
    </div>
  );
}
