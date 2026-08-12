'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Trash2,
  Upload,
  Download,
  Sparkles,
  Eye,
  Code2,
  Sliders,
  RefreshCw,
} from 'lucide-react';

interface MinifyOptions {
  removeComments: boolean;
  removeXmlDecl: boolean;
  removeDoctype: boolean;
  removeTitleDesc: boolean;
  collapseWhitespace: boolean;
  trimPrecision: boolean;
}

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Sample SVG Icon -->
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <g id="layer1">
    <circle cx="50.0000" cy="50.0000" r="40.0000" fill="#06b6d4" stroke="#0891b2" stroke-width="4.0000" />
    <path d="M 35.0000 50.0000 L 45.0000 60.0000 L 65.0000 40.0000" stroke="#ffffff" stroke-width="6.0000" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  </g>
</svg>`;

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function SvgMinifierTool() {
  const [inputSvg, setInputSvg] = useState<string>(DEFAULT_SVG);
  const [minifiedSvg, setMinifiedSvg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const [options, setOptions] = useState<MinifyOptions>({
    removeComments: true,
    removeXmlDecl: true,
    removeDoctype: true,
    removeTitleDesc: true,
    collapseWhitespace: true,
    trimPrecision: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const minifySvgCode = useCallback((raw: string, opts: MinifyOptions): string => {
    if (!raw.trim()) return '';

    let svg = raw;

    // Remove XML declaration
    if (opts.removeXmlDecl) {
      svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, '');
    }

    // Remove DOCTYPE
    if (opts.removeDoctype) {
      svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
    }

    // Remove comments
    if (opts.removeComments) {
      svg = svg.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove title & desc tags
    if (opts.removeTitleDesc) {
      svg = svg.replace(/<(title|desc)[\s\S]*?<\/(title|desc)>/gi, '');
      svg = svg.replace(/<(title|desc)[\s\S]*?\/>/gi, '');
    }

    // Trim floating point numbers precision (e.g., 50.0000 -> 50)
    if (opts.trimPrecision) {
      svg = svg.replace(/(\d+)\.(\d{2,})/g, (_, intPart, decPart) => {
        const rounded = parseFloat(`0.${decPart}`).toFixed(2).slice(2);
        const trimmedDec = rounded.replace(/0+$/, '');
        return trimmedDec ? `${intPart}.${trimmedDec}` : intPart;
      });
      svg = svg.replace(/(\d+)\.0+\b/g, '$1');
    }

    // Collapse whitespace
    if (opts.collapseWhitespace) {
      svg = svg.replace(/>\s+</g, '><');
      svg = svg.replace(/\s+/g, ' ');
      svg = svg.trim();
    }

    return svg;
  }, []);

  useEffect(() => {
    const result = minifySvgCode(inputSvg, options);
    setMinifiedSvg(result);
  }, [inputSvg, options, minifySvgCode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputSvg(content);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!minifiedSvg) return;
    await navigator.clipboard.writeText(minifiedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!minifiedSvg) return;
    const blob = new Blob([minifiedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const downloadName = fileName
      ? fileName.replace(/\.svg$/i, '-minified.svg')
      : 'optimized.svg';

    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputSvg('');
    setMinifiedSvg('');
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const originalSize = new Blob([inputSvg]).size;
  const minifiedSize = new Blob([minifiedSvg]).size;
  const savingsPercent =
    originalSize > 0
      ? Math.max(0, Math.round(((originalSize - minifiedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Control */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>SVG Cleaner & Code Minifier</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Input
          </button>
        </div>
      </div>

      {/* Options Panel */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Optimization Rules
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-medium">
          {[
            { key: 'removeComments', label: 'Comments' },
            { key: 'removeXmlDecl', label: 'XML Decl' },
            { key: 'removeDoctype', label: 'Doctype' },
            { key: 'removeTitleDesc', label: 'Title/Desc' },
            { key: 'collapseWhitespace', label: 'Whitespace' },
            { key: 'trimPrecision', label: 'Decimals' },
          ].map((opt) => {
            const isChecked = options[opt.key as keyof MinifyOptions];
            return (
              <label
                key={opt.key}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition ${
                  isChecked
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    setOptions({ ...options, [opt.key]: e.target.checked })
                  }
                  className="accent-cyan-400"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Original Code Size
          </span>
          <p className="text-base font-bold font-mono text-slate-200">
            {formatBytes(originalSize)}
          </p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Minified Size
          </span>
          <p className="text-base font-bold font-mono text-emerald-400">
            {formatBytes(minifiedSize)}
          </p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Space Saved
            </span>
            <p className="text-base font-bold font-mono text-cyan-400">
              {savingsPercent}% Reduced
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={!minifiedSvg}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea & File Upload */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Source SVG Code
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {inputSvg.length} characters
            </span>
          </div>

          <textarea
            value={inputSvg}
            onChange={(e) => {
              setInputSvg(e.target.value);
              setFileName(null);
            }}
            rows={12}
            placeholder="Paste raw <svg> code here..."
            className="w-full p-3.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-xs focus:outline-none transition resize-none leading-relaxed"
          />

          {/* Upload Button Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 rounded-xl p-3.5 text-center transition group cursor-pointer flex items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            <span className="text-xs font-medium text-slate-300">
              {fileName ? `Loaded file: ${fileName}` : 'Or click to upload .svg file'}
            </span>
          </div>
        </div>

        {/* Right: Output Preview / Code View */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition ${
                  activeTab === 'code'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Code2 className="w-3 h-3" /> Minified Code
              </button>
            </div>

            <button
              onClick={handleCopy}
              disabled={!minifiedSvg}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-30 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          {activeTab === 'preview' ? (
            /* Visual Render Preview Box */
            <div className="h-72 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-6 overflow-hidden relative">
              {minifiedSvg ? (
                <div
                  className="max-w-full max-h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: output }}
                  />
              ) : (
                <span className="text-xs text-slate-600 italic">No valid SVG output</span>
              )}
            </div>
          ) : (
            /* Minified Code Text Area */
            <textarea
              value={minifiedSvg}
              readOnly
              rows={12}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none transition resize-none leading-relaxed select-all"
            />
          )}
        </div>
      </div>
    </div>
  );
}
