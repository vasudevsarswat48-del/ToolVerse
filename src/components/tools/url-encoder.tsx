'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, ArrowLeftRight, Sparkles, Globe, AlertCircle } from 'lucide-react';

type Mode = 'encode' | 'decode';
type EncodingType = 'component' | 'full';

export default function UrlEncoderTool() {
  const [input, setInput] = useState('https://example.com/search?q=hello world & test=100%');
  const [mode, setMode] = useState<Mode>('encode');
  const [encodingType, setEncodingType] = useState<EncodingType>('component');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null };

    try {
      if (mode === 'encode') {
        const result =
          encodingType === 'component'
            ? encodeURIComponent(input)
            : encodeURI(input);
        return { output: result, error: null };
      } else {
        const result =
          encodingType === 'component'
            ? decodeURIComponent(input)
            : decodeURI(input);
        return { output: result, error: null };
      }
    } catch (err) {
      return {
        output: '',
        error: (err as Error).message || 'Invalid URI sequence for decoding.',
      };
    }
  }, [input, mode, encodingType]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const toggleMode = () => {
    if (output && !error) {
      setInput(output);
    }
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>URL Encoder & Decoder</span>
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
          Configuration
        </span>

        <div className="flex flex-wrap items-center gap-6">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Mode:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMode('encode')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  mode === 'encode'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  mode === 'decode'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          {/* Quick Swap Button */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition"
            title="Swap input with output and switch mode"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" /> Swap Output
          </button>

          {/* Encoding Standard Type */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Scope:</span>
            {[
              { label: 'Component (encodeURIComponent)', val: 'component' },
              { label: 'Full URI (encodeURI)', val: 'full' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setEncodingType(item.val as EncodingType)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border ${
                  encodingType === item.val
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

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Input String
            </label>
            <span className="text-[11px] text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter plain text or URL to encode...'
                : 'Enter encoded URL component to decode...'
            }
            className="w-full h-64 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Result Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{output.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!output || !!error}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Result
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative w-full h-64 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            {error ? (
              <div className="flex items-start gap-2 text-rose-400 p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Decoding Error</strong>
                  {error}
                </div>
              </div>
            ) : (
              <textarea
                value={output}
                readOnly
                placeholder="Conversion result will appear here..."
                className="w-full h-full bg-transparent text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
