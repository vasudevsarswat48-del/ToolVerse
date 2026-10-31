'use client';

import { useState } from 'react';
import { Trash2, GitCompare, Plus, Minus } from 'lucide-react';

export default function DiffCheckerTool() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');

  // Simple line-by-line diff algorithm
  const computeDiff = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const maxLines = Math.max(origLines.length, modLines.length);

    const diffResult = [];

    for (let i = 0; i < maxLines; i++) {
      const orig = origLines[i];
      const mod = modLines[i];

      if (orig === mod) {
        if (orig !== undefined) {
          diffResult.push({ type: 'unchanged', text: orig, line: i + 1 });
        }
      } else {
        if (orig !== undefined) {
          diffResult.push({ type: 'removed', text: orig, line: i + 1 });
        }
        if (mod !== undefined) {
          diffResult.push({ type: 'added', text: mod, line: i + 1 });
        }
      }
    }

    return diffResult;
  };

  const diffLines = computeDiff();

  const handleClear = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <GitCompare className="w-4 h-4 text-cyan-400" />
          <span>Line-by-Line Difference Comparison</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!original && !modified}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-slate-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Text */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Original Text
            </label>
            <span className="text-[11px] text-slate-500">{original.length} chars</span>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original version here..."
            className="w-full h-56 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition"
          />
        </div>

        {/* Modified Text */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Modified Text
            </label>
            <span className="text-[11px] text-slate-500">{modified.length} chars</span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste updated version here..."
            className="w-full h-56 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition"
          />
        </div>
      </div>

      {/* Visual Diff View */}
      {(original || modified) && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 block">
            Diff Output
          </label>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs max-h-96 overflow-y-auto divide-y divide-slate-800/50">
            {diffLines.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No content to compare.</div>
            ) : (
              diffLines.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 px-4 py-2 leading-relaxed ${
                    item.type === 'added'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : item.type === 'removed'
                      ? 'bg-rose-500/10 text-rose-300'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="w-5 text-right text-slate-600 shrink-0 select-none">
                    {item.line}
                  </span>
                  <span className="shrink-0 pt-0.5">
                    {item.type === 'added' && <Plus className="w-3.5 h-3.5 text-emerald-400" />}
                    {item.type === 'removed' && <Minus className="w-3.5 h-3.5 text-rose-400" />}
                    {item.type === 'unchanged' && <span className="w-3.5 inline-block" />}
                  </span>
                  <pre className="whitespace-pre-wrap break-all font-mono">{item.text || ' '}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
