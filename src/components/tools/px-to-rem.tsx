'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Settings,
  Table,
  Code2,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';

const COMMON_PX_SIZES = [
  2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 128,
];

function getTailwindEquivalent(px: number): string | null {
  const twMap: Record<number, string> = {
    0: '0',
    1: 'px',
    2: '0.5',
    4: '1',
    6: '1.5',
    8: '2',
    10: '2.5',
    12: '3',
    14: '3.5',
    16: '4',
    20: '5',
    24: '6',
    28: '7',
    32: '8',
    36: '9',
    40: '10',
    44: '11',
    48: '12',
    56: '14',
    64: '16',
    80: '20',
    96: '24',
    112: '28',
    128: '32',
    144: '36',
    160: '40',
    176: '44',
    192: '48',
    208: '52',
    224: '56',
    240: '60',
    256: '64',
    288: '72',
    320: '80',
    384: '96',
  };
  return twMap[px] ? `spacing / size: ${twMap[px]} (${px}px)` : null;
}

export default function PxToRemTool() {
  const [basePx, setBasePx] = useState<number>(16);
  const [pxValue, setPxValue] = useState<number | ''>(16);
  const [remValue, setRemValue] = useState<number | ''>(1);
  const [lastFocused, setLastFocused] = useState<'px' | 'rem'>('px');
  const [cssProp, setCssProp] = useState<string>('font-size');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync conversions
  useEffect(() => {
    const base = basePx > 0 ? basePx : 16;

    if (lastFocused === 'px') {
      if (typeof pxValue === 'number') {
        const calculated = Number((pxValue / base).toFixed(4));
        setRemValue(calculated);
      } else {
        setRemValue('');
      }
    } else {
      if (typeof remValue === 'number') {
        const calculated = Number((remValue * base).toFixed(2));
        setPxValue(calculated);
      } else {
        setPxValue('');
      }
    }
  }, [pxValue, remValue, basePx, lastFocused]);

  const handlePxChange = (val: string) => {
    setLastFocused('px');
    if (val === '') {
      setPxValue('');
    } else {
      setPxValue(Number(val));
    }
  };

  const handleRemChange = (val: string) => {
    setLastFocused('rem');
    if (val === '') {
      setRemValue('');
    } else {
      setRemValue(Number(val));
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setPxValue('');
    setRemValue('');
  };

  const currentPxNum = typeof pxValue === 'number' ? pxValue : 0;
  const currentRemNum = typeof remValue === 'number' ? remValue : 0;

  const generatedCss = `${cssProp}: ${currentRemNum}rem; /* ${currentPxNum}px */`;
  const tailwindHint = getTailwindEquivalent(currentPxNum);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>PX to REM / EM Units Converter</span>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Base Font Size Configuration Bar */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-cyan-400" /> Root Base Font Size (&lt;html&gt;)
          </span>
          <span className="text-xs font-mono text-cyan-400">Default: 16px</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <input
              type="number"
              min="1"
              value={basePx}
              onChange={(e) => setBasePx(Math.max(1, Number(e.target.value) || 16))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition pr-12"
            />
            <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-500">
              px
            </span>
          </div>

          {/* Quick Presets for Base Size */}
          <div className="flex items-center gap-1.5">
            {[10, 14, 16, 18].map((preset) => (
              <button
                key={preset}
                onClick={() => setBasePx(preset)}
                className={`px-3 py-2 text-xs font-mono font-semibold rounded-lg border transition ${
                  basePx === preset
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Converter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PX Input Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pixels (PX)
            </label>
            <button
              onClick={() => handleCopy(`${currentPxNum}px`, 'px')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              {copiedKey === 'px' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copy
            </button>
          </div>

          <div className="relative">
            <input
              type="number"
              step="any"
              value={pxValue}
              onChange={(e) => handlePxChange(e.target.value)}
              placeholder="e.g. 16"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-xl focus:outline-none transition"
            />
            <span className="absolute right-4 top-3.5 text-sm font-mono text-slate-500 font-bold">
              PX
            </span>
          </div>

          {tailwindHint && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400/90 bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/20">
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Tailwind Equivalent: {tailwindHint}</span>
            </div>
          )}
        </div>

        {/* REM Input Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Root EM (REM / EM)
            </label>
            <button
              onClick={() => handleCopy(`${currentRemNum}rem`, 'rem')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              {copiedKey === 'rem' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copy
            </button>
          </div>

          <div className="relative">
            <input
              type="number"
              step="any"
              value={remValue}
              onChange={(e) => handleRemChange(e.target.value)}
              placeholder="e.g. 1"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-xl focus:outline-none transition"
            />
            <span className="absolute right-4 top-3.5 text-sm font-mono text-slate-500 font-bold">
              REM
            </span>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            Calculation: {currentPxNum}px / {basePx}px ={' '}
            <span className="text-slate-300 font-bold">{currentRemNum}rem</span>
          </p>
        </div>
      </div>

      {/* CSS Code Snippet Generator */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Export CSS Snippet
          </span>

          <select
            value={cssProp}
            onChange={(e) => setCssProp(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-200 text-xs font-mono focus:outline-none"
          >
            <option value="font-size">font-size</option>
            <option value="padding">padding</option>
            <option value="margin">margin</option>
            <option value="gap">gap</option>
            <option value="width">width</option>
            <option value="height">height</option>
            <option value="line-height">line-height</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-cyan-300">{generatedCss}</span>
          <button
            onClick={() => handleCopy(generatedCss, 'css')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs transition ml-2 shrink-0"
          >
            {copiedKey === 'css' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy CSS
          </button>
        </div>
      </div>

      {/* Common Lookup Quick Reference Table */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Table className="w-3.5 h-3.5 text-cyan-400" /> Common PX to REM Quick Lookup Table
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {COMMON_PX_SIZES.map((px) => {
            const rem = Number((px / basePx).toFixed(4));
            const isSelected = pxValue === px;

            return (
              <button
                key={px}
                onClick={() => {
                  setPxValue(px);
                  setLastFocused('px');
                }}
                className={`p-2.5 rounded-lg border text-left font-mono transition flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-slate-200">{px}px</span>
                <span className="text-[11px] text-cyan-400">{rem}rem</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
