import React, { useState } from 'react';
import { 
  Bug, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  AlertCircle, 
  Check, 
  Clipboard, 
  ChevronDown, 
  ChevronUp, 
  Search,
  ExternalLink,
  Filter,
  UserCheck
} from 'lucide-react';
import { ReviewIssue, IssuePillar, IssueSeverity } from '../types/review';

interface IssuesListProps {
  issues: ReviewIssue[];
  onJumpToLine?: (line: string) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues, onJumpToLine }) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedReviewer, setSelectedReviewer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = async (id: string, code?: string) => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPillarIcon = (pillar: IssuePillar) => {
    switch (pillar) {
      case 'bugs':
        return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case 'performance':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'architecture':
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800 font-bold';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800 font-semibold';
      case 'MEDIUM':
        return 'bg-yellow-950 text-yellow-300 border-yellow-800';
      case 'LOW':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'NITPICK':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedPillar !== 'all' && issue.pillar !== selectedPillar) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedReviewer !== 'all' && !issue.reviewer.toLowerCase().includes(selectedReviewer.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchFix = issue.fixRecommendation.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchFix;
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Filters Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search findings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 text-xs"
          />
        </div>

        {/* Filter by Pillar */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Pillar:</span>
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Pillars ({issues.length})</option>
            <option value="bugs">🐛 Bugs & Logic</option>
            <option value="security">🛡️ Security Flaws</option>
            <option value="performance">⚡ Performance</option>
            <option value="architecture">🏗️ Architecture</option>
          </select>
        </div>

        {/* Filter by Severity */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="NITPICK">Nitpick</option>
          </select>
        </div>

        {/* Filter by Reviewer */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Reviewer:</span>
          <select
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Reviewers</option>
            <option value="swe">Senior SWE</option>
            <option value="qa">Senior QA</option>
            <option value="manager">Eng Manager</option>
          </select>
        </div>
      </div>

      {/* Issues Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredIssues.length} of {issues.length} detected issues</span>
        {(selectedPillar !== 'all' || selectedSeverity !== 'all' || selectedReviewer !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedPillar('all');
              setSelectedSeverity('all');
              setSelectedReviewer('all');
              setSearchQuery('');
            }}
            className="text-indigo-400 hover:text-indigo-300 text-[11px] underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Issues Cards List */}
      <div className="space-y-2.5">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No issues match the selected filters.
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isExpanded = expandedIssues[issue.id] !== false; // default open
            return (
              <div
                key={issue.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700 shadow-sm"
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(issue.id)}
                  className="p-3.5 cursor-pointer flex items-start justify-between gap-3 select-none hover:bg-slate-850/50"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Severity */}
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>

                      {/* Pillar */}
                      <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 capitalize">
                        {getPillarIcon(issue.pillar)}
                        <span>{issue.pillar}</span>
                      </span>

                      {/* Line Number jump button */}
                      {issue.line && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onJumpToLine?.(issue.line);
                          }}
                          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-300 transition-colors"
                          title="Click to jump to line in code editor"
                        >
                          <span>Line {issue.line}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}

                      {/* Reviewer Tag */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                        <UserCheck className="w-3 h-3 text-slate-500" />
                        <span>{issue.reviewer}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 pt-0.5">
                      {issue.title}
                    </h4>
                  </div>

                  <button className="text-slate-400 hover:text-slate-200 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-slate-800/80 bg-slate-950/40 text-xs">
                    {/* Description */}
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Impact & Root Cause
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/60">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 mb-1">
                        Actionable Fix Recommendation
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {issue.fixRecommendation}
                      </p>
                    </div>

                    {/* Code snippet if present */}
                    {issue.suggestedCode && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-400">
                          <span className="font-semibold uppercase tracking-wider">Suggested Fix Code</span>
                          <button
                            onClick={() => handleCopyCode(issue.id, issue.suggestedCode)}
                            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                          >
                            {copiedId === issue.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Clipboard className="w-3 h-3" />
                                <span>Copy Snippet</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                          <code>{issue.suggestedCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
