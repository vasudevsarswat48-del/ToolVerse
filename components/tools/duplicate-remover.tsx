'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, ListFilter, Sparkles, ArrowUpDown } from 'lucide-react';

type SortOrder = 'none' | 'asc' | 'desc';

export default function DuplicateRemoverTool() {
  const [input, setInput] = useState(
    `apple\nbanana\nApple\nbanana\norange\napple\ngrape\n  orange  \n\nbanana`
  );
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [copied, setCopied] = useState(false);

  const { output, originalCount, uniqueCount, removedCount } = useMemo(() => {
    if (!input) {
      return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
    }

    const rawLines = input.split('\n');
    const originalCount = rawLines.length;

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (let rawLine of rawLines) {
      let line = trimLines ? rawLine.trim() : rawLine;

      if (removeEmpty && !line) {
        continue;
      }

      const key = caseSensitive ? line : line.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    if (sortOrder === 'asc') {
      uniqueLines.sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === 'desc') {
      uniqueLines.sort((a, b) => b.localeCompare(a));
    }

    const output = uniqueLines.join('\n');
    const uniqueCount = uniqueLines.length;
    const removedCount = Math.max(0, originalCount - uniqueCount);

    return { output, originalCount, uniqueCount, removedCount };
  }, [input, caseSensitive, trimLines, removeEmpty, sortOrder]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ListFilter className="w-4 h-4 text-cyan-400" />
          <span>Duplicate Line Remover & Filter</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!input}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Options Panel */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Filtering Options
        </span>

        <div className="flex flex-wrap items-center gap-6">
          {/* Toggles */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Remove Empty Lines</span>
          </label>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-cyan-400" /> Sort:
            </span>
            {[
              { label: 'Original', val: 'none' },
              { label: 'A → Z', val: 'asc' },
              { label: 'Z → A', val: 'desc' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setSortOrder(item.val as SortOrder)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border ${
                  sortOrder === item.val
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Original Lines
          </span>
          <p className="text-lg font-bold font-mono text-slate-100">{originalCount}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Unique Lines
          </span>
          <p className="text-lg font-bold font-mono text-emerald-400">{uniqueCount}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Removed
          </span>
          <p className="text-lg font-bold font-mono text-rose-400">{removedCount}</p>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Raw List Input
            </label>
            <span className="text-[11px] text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste list here (one item per line)..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Deduplicated Result
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Clean List
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Deduplicated lines will appear here..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
