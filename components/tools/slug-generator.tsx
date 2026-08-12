'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function SlugGeneratorTool() {
  const [text, setText] = useState('Hello World! Building a ToolVerse React Component 🚀');
  const [separator, setSeparator] = useState<'-' | '_' | '.'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [copied, setCopied] = useState(false);

  const stopWords = useMemo(
    () =>
      new Set([
        'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
        'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
        'by', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'in', 'into', 'is', 'it',
        'its', 'of', 'on', 'once', 'only', 'or', 'other', 'out', 'over', 'own', 'same', 'so', 'than',
        'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
        'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
        'which', 'while', 'who', 'whom', 'why', 'with'
      ]),
    []
  );

  const generatedSlug = useMemo(() => {
    if (!text.trim()) return '';

    let result = text
      // Normalize unicode accents / diacritics (e.g. é -> e)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (lowercase) {
      result = result.toLowerCase();
    }

    // Strip non-alphanumeric chars except space/hyphen
    let words = result
      .replace(/[^\w\s-]/g, '')
      .trim()
      .split(/\s+/);

    if (removeStopWords) {
      words = words.filter((w) => !stopWords.has(w.toLowerCase()));
    }

    return words
      .join(separator)
      .replace(new RegExp(`\\${separator}+`, 'g'), separator);
  }, [text, separator, lowercase, removeStopWords, stopWords]);

  const handleCopy = async () => {
    if (!generatedSlug) return;
    await navigator.clipboard.writeText(generatedSlug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <LinkIcon className="w-4 h-4 text-cyan-400" />
          <span>URL Slug Generator</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!text}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Options */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Configuration
        </span>
        <div className="flex flex-wrap items-center gap-6">
          {/* Separator Selection */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Separator:</span>
            {[
              { label: 'Dash (-)', val: '-' },
              { label: 'Underscore (_)', val: '_' },
              { label: 'Dot (.)', val: '.' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setSeparator(item.val as '-' | '_' | '.')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition border ${
                  separator === item.val
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Lowercase</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Filter Stop Words</span>
          </label>
        </div>
      </div>

      {/* Inputs & Outputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Source String
            </label>
            <span className="text-[11px] text-slate-500">{text.length} chars</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste headline / title..."
            className="w-full h-48 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Generated Slug Result */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Generated Slug
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{generatedSlug.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!generatedSlug}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Slug
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="w-full h-48 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg font-mono text-xs text-cyan-300 break-all leading-relaxed">
              {generatedSlug || <span className="text-slate-600 italic">Slug preview will appear here...</span>}
            </div>

            {generatedSlug && (
              <div className="text-[11px] text-slate-500 font-mono break-all pt-2 border-t border-slate-800/60">
                <span className="text-slate-400">Preview: </span>
                https://example.com/posts/<span className="text-cyan-400">{generatedSlug}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
