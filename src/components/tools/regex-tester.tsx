'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState(
    'Contact us at support@example.com or sales@toolverse.dev for assistance.'
  );
  const [copied, setCopied] = useState(false);

  const activeFlags = useMemo(() => {
    return Object.entries(flags)
      .filter(([, active]) => active)
      .map(([flag]) => flag)
      .join('');
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: '' };

    try {
      const regex = new RegExp(pattern, activeFlags);
      const results: MatchResult[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let lastIndex = -1;

        while ((match = regex.exec(testText)) !== null) {
          // Prevent infinite loops with zero-width matches
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;

          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { matches: results, error: '' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid Regular Expression';
      return { matches: [], error: errorMessage };
    }
  }, [pattern, activeFlags, testText, flags.g]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopyPattern = async () => {
    if (!pattern) return;
    const fullRegex = `/${pattern}/${activeFlags}`;
    await navigator.clipboard.writeText(fullRegex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPattern('');
    setTestText('');
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input & Flag Selector */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-cyan-400 font-mono font-bold text-sm select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full pl-7 pr-12 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition"
            />
            <span className="absolute right-3 text-cyan-400 font-mono font-bold text-sm select-none">/{activeFlags}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPattern}
              disabled={!pattern}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Regex</span>
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={!pattern && !testText}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Flag Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flags:</span>
          {(['g', 'i', 'm', 's'] as const).map((flag) => {
            const labels: Record<string, string> = {
              g: 'Global (g)',
              i: 'Case Insensitive (i)',
              m: 'Multiline (m)',
              s: 'Dot All (s)',
            };
            return (
              <label key={flag} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={() => toggleFlag(flag)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span>{labels[flag]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Invalid Regex Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Text Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Test String
            </label>
            <span className="text-[11px] text-slate-500">{testText.length} chars</span>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Paste text here to test matches..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Matches Breakdown */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Match Results
            </label>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          <div className="w-full h-80 bg-slate-900/80 border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-3 font-mono text-xs">
            {matches.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                {pattern ? 'No matches found.' : 'Enter a pattern to test.'}
              </div>
            ) : (
              matches.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-400 font-bold">Match #{idx + 1}</span>
                    <span className="text-slate-500">Index: {item.index}</span>
                  </div>
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-300 break-all font-semibold">
                    {item.match}
                  </div>
                  {item.groups.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Capture Groups:</span>
                      {item.groups.map((group, gIdx) => (
                        <div key={gIdx} className="text-[11px] text-slate-300 pl-2 border-l-2 border-slate-700">
                          Group ${gIdx + 1}: <span className="text-emerald-400">{group || 'undefined'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
