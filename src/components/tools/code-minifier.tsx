'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Minimize2, Code2 } from 'lucide-react';

type LanguageMode = 'javascript' | 'css' | 'html';

export default function CodeMinifierTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<LanguageMode>('javascript');
  const [copied, setCopied] = useState(false);

  // Client-side lightweight minification
  const minifiedOutput = useMemo(() => {
    if (!input.trim()) return '';

    try {
      if (mode === 'javascript') {
        return input
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip single/multi-line comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/\s*([{};:=,\(\)])\s*/g, '$1') // Strip space around operators
          .trim();
      } else if (mode === 'css') {
        return input
          .replace(/\/\*[\s\S]*?\*\//g, '') // Strip CSS comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/\s*([{}:;,])\s*/g, '$1') // Strip space around selectors/declarations
          .replace(/;}/g, '}') // Remove trailing semicolons before block end
          .trim();
      } else if (mode === 'html') {
        return input
          .replace(/<!--[\s\S]*?-->/g, '') // Strip HTML comments
          .replace(/>\s+</g, '><') // Strip whitespace between tags
          .replace(/\s+/g, ' ') // Collapse whitespace inside tags
          .trim();
      }
    } catch {
      return input;
    }

    return input;
  }, [input, mode]);

  // Size reduction stats
  const stats = useMemo(() => {
    const origSize = new Blob([input]).size;
    const miniSize = new Blob([minifiedOutput]).size;
    const saved = origSize > 0 ? Math.round(((origSize - miniSize) / origSize) * 100) : 0;
    return { origSize, miniSize, saved: Math.max(0, saved) };
  }, [input, minifiedOutput]);

  const handleCopy = async () => {
    if (!minifiedOutput) return;
    await navigator.clipboard.writeText(minifiedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar & Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
          {(['javascript', 'css', 'html'] as LanguageMode[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setMode(lang)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase transition ${
                mode === lang
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'javascript' ? 'JS' : lang}
            </button>
          ))}
        </div>

        {/* Compression Statistics & Clear */}
        <div className="flex items-center gap-4">
          {input && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">{stats.origSize} B</span>
              <span className="text-slate-600">→</span>
              <span className="text-cyan-400 font-bold">{stats.miniSize} B</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-semibold">
                -{stats.saved}%
              </span>
            </div>
          )}

          <button
            onClick={handleClear}
            disabled={!input}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Code Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Code Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Source Code ({mode.toUpperCase()})
            </label>
            <span className="text-[11px] text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste unminified ${mode.toUpperCase()} code here...`}
            className="w-full h-80 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Minified Output Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Minimize2 className="w-3.5 h-3.5 text-emerald-400" /> Minified Output
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{minifiedOutput.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!minifiedOutput}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            value={minifiedOutput}
            readOnly
            placeholder="Minified output will appear here..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
