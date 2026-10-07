import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Cpu, 
  Bug, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw,
  Clipboard,
  Check
} from 'lucide-react';
import { ChatMessage, ReviewResponse } from '../types/review';

interface ReviewerChatProps {
  code: string;
  language: string;
  review?: ReviewResponse | null;
}

export const ReviewerChat: React.FC<ReviewerChatProps> = ({ code, language, review }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<'sse' | 'qa' | 'em' | 'panel'>('panel');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Suggested prompt pills based on review context
  const quickPrompts = [
    { label: '🧪 Generate Unit Test Suite', text: 'Can you generate comprehensive unit tests covering all edge cases?' },
    { label: '⚡ Scale to 50k RPS', text: 'How do we re-architect this to safely handle 50,000 concurrent requests per second?' },
    { label: '🛡️ Explain OWASP Exploit', text: 'Explain step-by-step how an attacker could exploit the security vulnerability in this code.' },
    { label: '📊 Telemetry & Metrics', text: 'What observability, structured logs, and Prometheus metrics should we add?' },
    { label: '🔄 Zero-Downtime Rollout', text: 'How should we roll out this refactoring in production without downtime or rollback risk?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      persona,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          question: textToSend,
          code,
          language,
          reviewContext: review
            ? {
                verdict: review.verdict,
                overallScore: review.overallScore,
                issuesSummary: review.issues.map((i) => `${i.severity}: ${i.title}`).slice(0, 5),
              }
            : null,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate reviewer response');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        persona,
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        persona,
        content: `Error: ${err.message || 'Unable to connect to reviewer model.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (idx: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPersonaBadge = (p: 'sse' | 'qa' | 'em' | 'panel') => {
    switch (p) {
      case 'sse':
        return {
          name: 'Senior SWE',
          color: 'text-sky-300 bg-sky-950/80 border-sky-800',
          icon: <Cpu className="w-3.5 h-3.5 text-sky-400" />,
        };
      case 'qa':
        return {
          name: 'Senior QA / SDET',
          color: 'text-amber-300 bg-amber-950/80 border-amber-800',
          icon: <Bug className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'em':
        return {
          name: 'Engineering Manager',
          color: 'text-purple-300 bg-purple-950/80 border-purple-800',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
        };
      case 'panel':
      default:
        return {
          name: 'Joint Committee (All 3)',
          color: 'text-indigo-300 bg-indigo-950/80 border-indigo-800',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
        };
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
      {/* Chat Header & Persona Selector */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">
            Interactive Review Committee Q&A
          </span>
        </div>

        {/* Persona toggle buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setPersona('panel')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              persona === 'panel'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Committee</span>
          </button>
          <button
            onClick={() => setPersona('sse')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              persona === 'sse'
                ? 'bg-sky-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Senior SWE</span>
          </button>
          <button
            onClick={() => setPersona('qa')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              persona === 'qa'
                ? 'bg-amber-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bug className="w-3 h-3" />
            <span>Senior QA</span>
          </button>
          <button
            onClick={() => setPersona('em')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              persona === 'em'
                ? 'bg-purple-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Eng Mgr</span>
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-2.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              Ask Any Reviewer Directly
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Ask for alternative patterns, test fixtures, performance optimizations, or production migration guidance.
            </p>

            {/* Quick Prompts */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-4 max-w-md">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 text-[11px] transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const meta = getPersonaBadge(msg.persona);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1">
                  {!isUser && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border ${meta.color}`}>
                      {meta.icon}
                      <span>{meta.name}</span>
                    </span>
                  )}
                  {isUser && <span className="font-medium text-slate-400">You (Author)</span>}
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap font-sans'
                  }`}
                >
                  <div>{msg.content}</div>

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(idx, msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-850 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Clipboard className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-indigo-300 text-xs">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>{getPersonaBadge(persona).name} is writing detailed feedback...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Quick Prompt Ribbon */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${getPersonaBadge(persona).name} anything about this code...`}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-colors ${
              !input.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
            title="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
