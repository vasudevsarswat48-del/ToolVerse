'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Type } from 'lucide-react';

interface CaseOption {
  id: string;
  label: string;
  format: (str: string) => string;
}

export default function CaseConverterTool() {
  const [text, setText] = useState('hello world case converter tool');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to split text into words clean of punctuation
  const getWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/);
  };

  const caseConverters: CaseOption[] = useMemo(
    () => [
      {
        id: 'lowercase',
        label: 'lowercase',
        format: (str) => str.toLowerCase(),
      },
      {
        id: 'uppercase',
        label: 'UPPERCASE',
        format: (str) => str.toUpperCase(),
      },
      {
        id: 'camelCase',
        label: 'camelCase',
        format: (str) => {
          const words = getWords(str);
          if (!words[0]) return '';
          return (
            words[0].toLowerCase() +
            words
              .slice(1)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join('')
          );
        },
      },
      {
        id: 'PascalCase',
        label: 'PascalCase',
        format: (str) =>
          getWords(str)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(''),
      },
      {
        id: 'snake_case',
        label: 'snake_case',
        format: (str) =>
          getWords(str)
            .map((w) => w.toLowerCase())
            .join('_'),
      },
      {
        id: 'kebab-case',
        label: 'kebab-case',
        format: (str) =>
          getWords(str)
            .map((w) => w.toLowerCase())
            .join('-'),
      },
      {
        id: 'CONSTANT_CASE',
        label: 'CONSTANT_CASE',
        format: (str) =>
          getWords(str)
            .map((w) => w.toUpperCase())
            .join('_'),
      },
      {
        id: 'titleCase',
        label: 'Title Case',
        format: (str) =>
          getWords(str)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' '),
      },
      {
        id: 'sentenceCase',
        label: 'Sentence case',
        format: (str) => {
          const cleaned = str.trim().toLowerCase();
          return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        },
      },
    ],
    []
  );

  const handleCopy = async (id: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Type className="w-4 h-4 text-cyan-400" />
          <span>String & Code Case Converter</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!text}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Source Text
          </label>
          <span className="text-[11px] text-slate-500">{text.length} chars</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to convert..."
          className="w-full h-32 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
        />
      </div>

      {/* Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {caseConverters.map((c) => {
          const converted = text ? c.format(text) : '';
          const isCopied = copiedId === c.id;

          return (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between gap-3 hover:border-slate-700 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {c.label}
                </span>
                <button
                  onClick={() => handleCopy(c.id, converted)}
                  disabled={!converted}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-30 transition"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/50 font-mono text-xs text-cyan-300 break-all min-h-[42px] flex items-center">
                {converted || <span className="text-slate-600 italic">Result...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
