'use client';

import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');

    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        const utf8Bytes = new TextEncoder().encode(text);
        const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
        setOutput(btoa(binaryString));
      } else {
        const binaryString = atob(text.trim());
        const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch {
      setError(
        currentMode === 'decode'
          ? 'Invalid Base64 string format.'
          : 'Failed to encode input.'
      );
      setOutput('');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    handleProcess(input, newMode);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
              mode === 'encode'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
              mode === 'decode'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode
          </button>
        </div>

        <button
          onClick={handleClear}
          disabled={!input && !output}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-slate-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Input / Output Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Text Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})
            </label>
            <span className="text-[11px] text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleProcess(e.target.value, mode)}
            placeholder={
              mode === 'encode'
                ? 'Type or paste plain text here...'
                : 'Paste Base64 encoded string here...'
            }
            className="w-full h-64 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-sm resize-none transition"
          />
        </div>

        {/* Output Text Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{output.length} chars</span>
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
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full h-64 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-400 placeholder:text-slate-600 focus:outline-none font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
