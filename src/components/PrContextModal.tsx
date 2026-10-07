import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';

interface PrContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  setContext: (ctx: string) => void;
}

export const PrContextModal: React.FC<PrContextModalProps> = ({
  isOpen,
  onClose,
  context,
  setContext,
}) => {
  const [tempContext, setTempContext] = useState(context);

  if (!isOpen) return null;

  const handleSave = () => {
    setContext(tempContext);
    onClose();
  };

  const presetContexts = [
    {
      title: 'High-Concurrency Fintech API',
      text: 'Production financial service endpoint. Strict SLA: <50ms p99 latency, zero double-spend or race hazards, PCI-DSS compliance, strict ACID database transactions.',
    },
    {
      title: 'Real-Time Streaming Dashboard',
      text: 'Front-end telemetry component for a 24/7 monitoring cluster. Must not leak memory, avoid UI thread locks, clean up all WebSocket listeners, and maintain 60 FPS.',
    },
    {
      title: 'Distributed Microservice Ingestion',
      text: 'High-throughput Go worker processing millions of messages/hour. Memory leaks, goroutine panics, and channel deadlocks must be caught before rolling to Kubernetes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              PR Context & Architectural Constraints
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Provide additional domain context, PR goals, or constraints (e.g. traffic SLA, regulatory compliance, framework version). The Senior SWE, QA, and EM will tailor their reviews accordingly.
          </p>

          <textarea
            value={tempContext}
            onChange={(e) => setTempContext(e.target.value)}
            rows={4}
            placeholder="e.g. Refactoring legacy auth to JWT. Critical requirement: zero-downtime migration, audit logging for GDPR compliance, and handle up to 20,000 req/sec."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 text-xs leading-relaxed resize-none"
          />

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetContexts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setTempContext(preset.text)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 text-[11px] transition-colors"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setTempContext('');
              setContext('');
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-rose-400"
          >
            Clear Context
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Context</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
