'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Search, Hash, AlignLeft, Binary, FileText } from 'lucide-react';

export default function StringInspectorTool() {
  const [text, setText] = useState(
    'ToolVerse Inspector v1.0 — Analyze text metrics, character frequencies, and byte sizes instantly!'
  );
  const [copiedStats, setCopiedStats] = useState(false);

  // Compute text statistics & breakdown
  const stats = useMemo(() => {
    if (!text) {
      return {
        charCount: 0,
        wordCount: 0,
        lineCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        utf8Bytes: 0,
        letters: 0,
        digits: 0,
        spaces: 0,
        specials: 0,
        uniqueWords: 0,
        avgWordLength: 0,
        topChars: [] as { char: string; count: number }[],
      };
    }

    const charCount = text.length;
    const trimmed = text.trim();
    const wordMatches = trimmed ? trimmed.match(/\b[\w'-]+\b/g) || [] : [];
    const wordCount = wordMatches.length;
    const lineCount = text.split('\n').length;
    const sentenceCount = trimmed ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
    const paragraphCount = trimmed ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const utf8Bytes = new TextEncoder().encode(text).length;

    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const specials = charCount - letters - digits - spaces;

    const uniqueWords = new Set(wordMatches.map((w) => w.toLowerCase())).size;
    const avgWordLength = wordCount > 0 ? (letters / wordCount).toFixed(1) : '0';

    // Character Frequency Analysis
    const charMap: Record<string, number> = {};
    for (const char of text) {
      if (char === ' ') continue; // ignore plain spaces in top freq
      charMap[char] = (charMap[char] || 0) + 1;
    }

    const topChars = Object.entries(charMap)
      .map(([char, count]) => ({ char, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      charCount,
      wordCount,
      lineCount,
      sentenceCount,
      paragraphCount,
      utf8Bytes,
      letters,
      digits,
      spaces,
      specials,
      uniqueWords,
      avgWordLength,
      topChars,
    };
  }, [text]);

  const handleCopyStats = async () => {
    const summary = `Text Analysis Summary:
- Characters: ${stats.charCount}
- Words: ${stats.wordCount} (Unique: ${stats.uniqueWords})
- Lines: ${stats.lineCount}
- Sentences: ${stats.sentenceCount}
- UTF-8 Size: ${stats.utf8Bytes} Bytes
- Letters: ${stats.letters} | Digits: ${stats.digits} | Spaces: ${stats.spaces} | Special: ${stats.specials}`;

    await navigator.clipboard.writeText(summary);
    setCopiedStats(true);
    setTimeout(() => setCopiedStats(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>String Metrics & Character Inspector</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!text}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Characters', val: stats.charCount, icon: Hash, color: 'text-cyan-400' },
          { label: 'Words', val: stats.wordCount, icon: FileText, color: 'text-emerald-400' },
          { label: 'Lines', val: stats.lineCount, icon: AlignLeft, color: 'text-indigo-400' },
          { label: 'Sentences', val: stats.sentenceCount, icon: FileText, color: 'text-amber-400' },
          { label: 'Paragraphs', val: stats.paragraphCount, icon: AlignLeft, color: 'text-rose-400' },
          { label: 'UTF-8 Bytes', val: stats.utf8Bytes, icon: Binary, color: 'text-purple-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">{item.label}</span>
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <p className="text-xl font-bold font-mono text-slate-100">{item.val.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Text Input */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Source Text Input
            </label>
            <span className="text-[11px] text-slate-500">{text.length} chars</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here to inspect..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Detailed Character Breakdown */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Analysis Breakdown
            </span>
            <button
              onClick={handleCopyStats}
              disabled={!text}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
            >
              {copiedStats ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Stats
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4 text-xs font-mono">
            {/* Character Composition */}
            <div className="space-y-2">
              <span className="text-[11px] font-sans font-semibold uppercase text-slate-500 tracking-wider block">
                Composition
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60 flex justify-between">
                  <span>Letters:</span> <strong className="text-cyan-400">{stats.letters}</strong>
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60 flex justify-between">
                  <span>Digits:</span> <strong className="text-emerald-400">{stats.digits}</strong>
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60 flex justify-between">
                  <span>Spaces:</span> <strong className="text-amber-400">{stats.spaces}</strong>
                </div>
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60 flex justify-between">
                  <span>Special:</span> <strong className="text-rose-400">{stats.specials}</strong>
                </div>
              </div>
            </div>

            {/* Word Analysis */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-sans font-semibold uppercase text-slate-500 tracking-wider block">
                Vocabulary
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Unique Words:</span>
                  <span className="text-slate-100 font-bold">{stats.uniqueWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Word Length:</span>
                  <span className="text-slate-100 font-bold">{stats.avgWordLength} chars</span>
                </div>
              </div>
            </div>

            {/* Frequent Characters */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-sans font-semibold uppercase text-slate-500 tracking-wider block">
                Top Characters
              </span>
              {stats.topChars.length === 0 ? (
                <span className="text-slate-600 italic">No characters...</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {stats.topChars.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[11px]"
                    >
                      <strong className="text-cyan-400 font-bold">{item.char === '\n' ? '\\n' : item.char}</strong>:{' '}
                      <span className="text-slate-400">{item.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
