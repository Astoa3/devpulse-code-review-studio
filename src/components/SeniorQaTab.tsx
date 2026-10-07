import React, { useState } from 'react';
import { 
  Bug, 
  CheckCheck, 
  AlertTriangle, 
  Flame, 
  Clipboard, 
  Check, 
  Download, 
  TestTube2,
  FileCode
} from 'lucide-react';
import { SeniorQaReview } from '../types/review';

interface SeniorQaTabProps {
  qaReview: SeniorQaReview;
  language: string;
}

export const SeniorQaTab: React.FC<SeniorQaTabProps> = ({ qaReview, language }) => {
  const { summary, edgeCases, failureScenarios, testPlan, testCodeSnippet } = qaReview;
  const [copied, setCopied] = useState(false);

  const handleCopyTests = async () => {
    if (!testCodeSnippet) return;
    await navigator.clipboard.writeText(testCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTests = () => {
    if (!testCodeSnippet) return;
    const ext = language === 'python' ? 'py' : language === 'go' ? 'go' : 'ts';
    const blob = new Blob([testCodeSnippet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review_suite.test.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Persona Header Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-900/60 border border-amber-700/60 flex items-center justify-center text-amber-400">
            <TestTube2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Senior QA Engineer (SDET Lead)
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-semibold">
                Staff SDET
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Focus: Edge cases, boundary condition testing, race conditions, failure recovery & automated test suites.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          {summary}
        </p>
      </div>

      {/* Edge Cases & Chaos Failure Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Edge Cases */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Boundary & Edge Cases Overlooked</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {edgeCases && edgeCases.length > 0 ? (
              edgeCases.map((ec, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-amber-400 font-bold">⚠</span>
                  <span>{ec}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No critical boundary failures detected.</li>
            )}
          </ul>
        </div>

        {/* Failure & Chaos Scenarios */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Chaos & Breakdown Scenarios</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {failureScenarios && failureScenarios.length > 0 ? (
              failureScenarios.map((fs, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-rose-400 font-bold">✖</span>
                  <span>{fs}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Baseline failure tolerance confirmed.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Structured Test Plan Matrix */}
      {testPlan && testPlan.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-sky-400" />
              <span>Recommended Test Matrix ({testPlan.length} Cases)</span>
            </h4>
            <span className="text-[10px] text-slate-500">Unit, Integration & Chaos Cases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3 font-semibold">Test Case</th>
                  <th className="py-2 px-3 font-semibold">Category</th>
                  <th className="py-2 px-3 font-semibold">Input / Trigger</th>
                  <th className="py-2 px-3 font-semibold">Expected Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {testPlan.map((tc, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      {tc.testCaseName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-sky-300">
                        {tc.testType || 'Unit'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 max-w-[200px] truncate" title={tc.input}>
                      {tc.input || 'Standard test fixtures'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {tc.expectedResult}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generated Automated Test Suite Code */}
      {testCodeSnippet && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                Ready-to-Run Automated Test Suite
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                {language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTests}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition-colors"
                title="Download test file"
              >
                <Download className="w-3 h-3 text-slate-400" />
                <span>Download</span>
              </button>

              <button
                onClick={handleCopyTests}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3 h-3" />
                    <span>Copy Test Suite</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-80 leading-relaxed">
            <code>{testCodeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
