'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Copy,
  Check,
  Globe,
  Sparkles,
  FileCode,
  ImageIcon,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface FaviconSpec {
  name: string;
  size: number;
  label: string;
  rel: string;
  category: 'Favicon' | 'Apple' | 'Android';
}

const FAVICON_SPECS: FaviconSpec[] = [
  { name: 'favicon-16x16.png', size: 16, label: '16×16 Small', rel: 'icon', category: 'Favicon' },
  { name: 'favicon-32x32.png', size: 32, label: '32×32 Standard', rel: 'icon', category: 'Favicon' },
  { name: 'favicon-48x48.png', size: 48, label: '48×48 Large', rel: 'icon', category: 'Favicon' },
  { name: 'apple-touch-icon.png', size: 180, label: '180×180 Apple Touch', rel: 'apple-touch-icon', category: 'Apple' },
  { name: 'android-chrome-192x192.png', size: 192, label: '192×192 Android', rel: 'icon', category: 'Android' },
  { name: 'android-chrome-512x512.png', size: 512, label: '512×512 Android', rel: 'icon', category: 'Android' },
];

interface GeneratedFavicon {
  spec: FaviconSpec;
  url: string;
  blob: Blob;
}

export default function FaviconGeneratorTool() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([]);
  const [paddingPercent, setPaddingPercent] = useState<number>(0);
  const [borderRadiusPercent, setBorderRadiusPercent] = useState<number>(0);
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFavicons = useCallback(() => {
    if (!sourcePreview) return;

    setIsProcessing(true);
    const img = new Image();
    img.src = sourcePreview;

    img.onload = () => {
      const results: GeneratedFavicon[] = [];

      FAVICON_SPECS.forEach((spec) => {
        const canvas = document.createElement('canvas');
        canvas.width = spec.size;
        canvas.height = spec.size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, spec.size, spec.size);

        // Apply background fill if set
        if (backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          if (borderRadiusPercent > 0) {
            const radius = (spec.size * borderRadiusPercent) / 100 / 2;
            ctx.beginPath();
            ctx.roundRect(0, 0, spec.size, spec.size, radius);
            ctx.fill();
            ctx.clip();
          } else {
            ctx.fillRect(0, 0, spec.size, spec.size);
          }
        }

        // Apply padding
        const paddingPixels = (spec.size * paddingPercent) / 100 / 2;
        const targetSize = spec.size - paddingPixels * 2;

        if (borderRadiusPercent > 0 && backgroundColor === 'transparent') {
          const radius = (spec.size * borderRadiusPercent) / 100 / 2;
          ctx.beginPath();
          ctx.roundRect(0, 0, spec.size, spec.size, radius);
          ctx.clip();
        }

        ctx.drawImage(img, paddingPixels, paddingPixels, targetSize, targetSize);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            results.push({ spec, url, blob });

            if (results.length === FAVICON_SPECS.length) {
              setGeneratedFavicons(results);
              setIsProcessing(false);
            }
          }
        }, 'image/png');
      });
    };
  }, [sourcePreview, paddingPercent, borderRadiusPercent, backgroundColor]);

  useEffect(() => {
    if (sourcePreview) {
      generateFavicons();
    }
  }, [sourcePreview, paddingPercent, borderRadiusPercent, backgroundColor, generateFavicons]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    generatedFavicons.forEach((f) => URL.revokeObjectURL(f.url));
    setGeneratedFavicons([]);

    setSourceFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSourcePreview(objectUrl);
  };

  const handleClear = () => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    generatedFavicons.forEach((f) => URL.revokeObjectURL(f.url));

    setSourceFile(null);
    setSourcePreview(null);
    setGeneratedFavicons([]);
    setPaddingPercent(0);
    setBorderRadiusPercent(0);
    setBackgroundColor('transparent');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadSingle = (fav: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.href = fav.url;
    link.download = fav.spec.name;
    link.click();
  };

  const htmlHeadSnippet = `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(htmlHeadSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Multi-Format Favicon & Web App Icon Generator</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!sourceFile}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {!sourcePreview ? (
        /* Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileSelect(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <div className="p-3 bg-slate-800/80 rounded-full text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Click or drag & drop image to generate favicons
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports high-res PNG, JPEG, WebP, SVG (512x512+ recommended)
            </p>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Customization & Padding
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Padding Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="text-slate-300">Inner Padding ({paddingPercent}%)</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={paddingPercent}
                  onChange={(e) => setPaddingPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Corner Radius Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="text-slate-300">Border Radius ({borderRadiusPercent}%)</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={borderRadiusPercent}
                  onChange={(e) => setBorderRadiusPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Background Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor === 'transparent' ? '#000000' : backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-9 h-9 p-0.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                  />
                  <button
                    onClick={() => setBackgroundColor('transparent')}
                    className={`px-3 py-2 text-xs font-mono font-medium rounded-lg border transition ${
                      backgroundColor === 'transparent'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Transparent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Previews Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Generated Favicon Sizes
              </span>
              {isProcessing && (
                <div className="flex items-center gap-1 text-xs font-mono text-cyan-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rendering...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FAVICON_SPECS.map((spec) => {
                const fav = generatedFavicons.find((f) => f.spec.name === spec.name);
                return (
                  <div
                    key={spec.name}
                    className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Image Preview Box */}
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative p-1">
                        {fav ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={fav.url}
                            alt={spec.label}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-700" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {spec.label}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                          {spec.name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => fav && handleDownloadSingle(fav)}
                      disabled={!fav}
                      className="p-2 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition disabled:opacity-30 shrink-0"
                      title={`Download ${spec.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HTML Snippet Section */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" /> HTML &lt;head&gt; Link Tags
              </span>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                {copiedCode ? (
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

            <textarea
              readOnly
              rows={4}
              value={htmlHeadSnippet}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
