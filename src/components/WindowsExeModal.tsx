import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Monitor, 
  Package, 
  Check, 
  Clipboard, 
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';

interface WindowsExeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const WindowsExeModal: React.FC<WindowsExeModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = appUrl || window.location.href;

  const nativefierCmd = `npx nativefier --name "DevPulse Studio" --platform "windows" --arch "x64" --single-instance "${currentUrl}"`;

  const electronSteps = `# 1. Clone or download this project folder
git clone <your-repo-url>
cd react-example

# 2. Install dependencies & electron
npm install
npm install -D electron electron-builder

# 3. Build & generate Windows .exe installer
npm run build
npx electron-builder --win`;

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-700/60 text-indigo-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Run DevPulse as a Windows Desktop App (.exe)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Windows 10 / 11
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose the fastest method to get this running as a desktop app on your PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {/* Option 1: Instant PWA Native Window (No coding or compiler needed!) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-800/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-indigo-300 flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-indigo-400" />
                Option 1: 1-Click Windows App Install (Instant)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                Recommended • 10 Seconds
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              You can run this right now in a native, standalone, borderless Windows desktop window with a desktop shortcut and taskbar pinning:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <li>In <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>, click the <strong>Install / App icon</strong> in the address bar (or menu <kbd className="px-1 py-0.2 bg-slate-800 border border-slate-700 rounded text-[10px]">⋮</kbd> → <em>Apps</em> → <em>"Install DevPulse Review Studio"</em>).</li>
              <li>Check <strong>"Create Desktop Shortcut"</strong> and <strong>"Pin to Taskbar"</strong>.</li>
              <li>DevPulse opens immediately as an isolated desktop window without browser bars, running with hardware acceleration.</li>
            </ol>
          </div>

          {/* Option 2: 1-Line Command to build .exe with Nativefier */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-sky-400" />
                Option 2: Generate Standalone .exe in 1 Command
              </span>
              <span className="text-[10px] text-slate-400">Node / NPX</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Open PowerShell or Command Prompt on your Windows computer and run this single command to produce a compiled Windows folder with <code className="text-sky-300">DevPulse Studio.exe</code>:
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed pr-10">
                <code>{nativefierCmd}</code>
              </pre>
              <button
                onClick={() => handleCopy('nativefier', nativefierCmd)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'nativefier' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Clipboard className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Option 3: Compile Full Electron Installer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4 text-purple-400" />
                Option 3: Full Electron .exe Installer Build
              </span>
              <span className="text-[10px] text-slate-400">Offline Full-Stack</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We have configured an <code className="text-purple-300 font-mono">electron-main.cjs</code> entry point in the project. You can build an official Windows installer wizard (.exe):
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed pr-10">
                <code>{electronSteps}</code>
              </pre>
              <button
                onClick={() => handleCopy('electron', electronSteps)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Copy Electron instructions"
              >
                {copiedCmd === 'electron' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Clipboard className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            DevPulse is 100% portable and Windows 10/11 ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
