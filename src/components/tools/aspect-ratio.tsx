'use client';

import { useState, useEffect } from 'react';
import {
  Ratio,
  ArrowLeftRight,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Maximize2,
  Sliders,
  Monitor,
  Smartphone,
} from 'lucide-react';

interface Preset {
  label: string;
  w: number;
  h: number;
  category: 'Desktop' | 'Mobile' | 'Photo' | 'Video';
}

const PRESETS: Preset[] = [
  { label: '16:9', w: 16, h: 9, category: 'Desktop' },
  { label: '4:3', w: 4, h: 3, category: 'Desktop' },
  { label: '21:9', w: 21, h: 9, category: 'Desktop' },
  { label: '1:1', w: 1, h: 1, category: 'Photo' },
  { label: '9:16', w: 9, h: 16, category: 'Mobile' },
  { label: '4:5', w: 4, h: 5, category: 'Mobile' },
  { label: '3:2', w: 3, h: 2, category: 'Photo' },
  { label: '5:4', w: 5, h: 4, category: 'Photo' },
];

function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

export default function AspectRatioTool() {
  const [w1, setW1] = useState<number | ''>(1920);
  const [h1, setH1] = useState<number | ''>(1080);
  const [w2, setW2] = useState<number | ''>(1280);
  const [h2, setH2] = useState<number | ''>(720);
  const [lastChanged, setLastChanged] = useState<'w2' | 'h2'>('w2');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate Simplified Ratio (e.g. 1920x1080 -> 16:9)
  const numW1 = typeof w1 === 'number' && w1 > 0 ? w1 : 1;
  const numH1 = typeof h1 === 'number' && h1 > 0 ? h1 : 1;
  const gcd = getGCD(numW1, numH1);
  const simplifiedW = numW1 / gcd;
  const simplifiedH = numH1 / gcd;

  // Compute linked target dimension automatically
  useEffect(() => {
    if (!w1 || !h1 || w1 <= 0 || h1 <= 0) return;

    const ratio = w1 / h1;

    if (lastChanged === 'w2' && typeof w2 === 'number' && w2 > 0) {
      const computedH2 = Math.round(w2 / ratio);
      setH2(computedH2);
    } else if (lastChanged === 'h2' && typeof h2 === 'number' && h2 > 0) {
      const computedW2 = Math.round(h2 * ratio);
      setW2(computedW2);
    }
  }, [w1, h1, w2, h2, lastChanged]);

  const handleApplyPreset = (pw: number, ph: number) => {
    setW1(pw);
    setH1(ph);
    if (typeof w2 === 'number' && w2 > 0) {
      setH2(Math.round(w2 / (pw / ph)));
    }
  };

  const handleSwapDimensions = () => {
    setW1(h1);
    setH1(w1);
    setW2(h2);
    setH2(w2);
  };

  const handleClear = () => {
    setW1('');
    setH1('');
    setW2('');
    setH2('');
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cssAspectRatio = `aspect-ratio: ${simplifiedW} / ${simplifiedH};`;
  const cssPaddingBottom = `padding-bottom: ${((simplifiedH / simplifiedW) * 100).toFixed(2)}%;`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Ratio className="w-4 h-4 text-cyan-400" />
          <span>Aspect Ratio Calculator & Dimensions Resizer</span>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Preset Quick Selection Buttons */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Standard Ratios
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESETS.map((preset) => {
            const isActive =
              simplifiedW === preset.w && simplifiedH === preset.h;
            return (
              <button
                key={preset.label}
                onClick={() => handleApplyPreset(preset.w, preset.h)}
                className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg border transition flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{preset.label}</span>
                <span className="text-[10px] text-slate-500 font-sans font-normal">
                  {preset.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Inputs vs Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Calculations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Base Ratio Input */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Original Ratio / Dimensions
              </span>
              <button
                onClick={handleSwapDimensions}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition font-medium"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 items-center">
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-slate-500 block">Width (W1)</label>
                <input
                  type="number"
                  value={w1}
                  onChange={(e) => setW1(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1920"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition"
                />
              </div>

              <div className="col-span-1 text-center font-bold text-slate-600 text-lg pt-4">
                :
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-slate-500 block">Height (H1)</label>
                <input
                  type="number"
                  value={h1}
                  onChange={(e) => setH1(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1080"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition"
                />
              </div>
            </div>

            {/* Ratio Summary Badge */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Simplified Aspect Ratio:</span>
              <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {simplifiedW}:{simplifiedH}
              </span>
            </div>
          </div>

          {/* New Target Dimensions Resizer */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              2. Target Dimensions Resizer
            </span>

            <div className="grid grid-cols-5 gap-3 items-center">
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-slate-500 block">New Width (W2)</label>
                <input
                  type="number"
                  value={w2}
                  onChange={(e) => {
                    setW2(e.target.value ? Number(e.target.value) : '');
                    setLastChanged('w2');
                  }}
                  placeholder="e.g. 1280"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition"
                />
              </div>

              <div className="col-span-1 text-center font-bold text-slate-600 text-lg pt-4">
                →
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-slate-500 block">New Height (H2)</label>
                <input
                  type="number"
                  value={h2}
                  onChange={(e) => {
                    setH2(e.target.value ? Number(e.target.value) : '');
                    setLastChanged('h2');
                  }}
                  placeholder="e.g. 720"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-sm focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* CSS Code Snippets Export */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              CSS Code Snippets
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-slate-300">{cssAspectRatio}</span>
                <button
                  onClick={() => handleCopy(cssAspectRatio, 'aspect')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs"
                >
                  {copiedKey === 'aspect' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-slate-300">{cssPaddingBottom}</span>
                <button
                  onClick={() => handleCopy(cssPaddingBottom, 'padding')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs"
                >
                  {copiedKey === 'padding' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Box Preview */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex-1 flex flex-col justify-between space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Visual Aspect Preview
            </span>

            {/* Container Box */}
            <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-6 relative overflow-hidden">
              <div
                style={{
                  aspectRatio: `${simplifiedW} / ${simplifiedH}`,
                  maxHeight: '100%',
                  maxWidth: '100%',
                }}
                className="bg-cyan-500/10 border-2 border-cyan-400 rounded-lg flex flex-col items-center justify-center p-4 transition-all duration-300 shadow-lg shadow-cyan-950/50 w-full h-full"
              >
                <div className="font-mono font-bold text-cyan-300 text-lg">
                  {simplifiedW}:{simplifiedH}
                </div>
                <div className="text-[11px] text-cyan-400/80 font-mono mt-1">
                  {w2 || w1 || 0} × {h2 || h1 || 0} px
                </div>
              </div>
            </div>

            {/* Spec Stats Box */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Decimal Ratio
                </span>
                <span className="text-slate-200 font-bold">
                  {(simplifiedW / simplifiedH).toFixed(4)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Orientation
                </span>
                <span className="text-slate-200 font-bold">
                  {simplifiedW > simplifiedH
                    ? 'Landscape'
                    : simplifiedW < simplifiedH
                    ? 'Portrait'
                    : 'Square'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
