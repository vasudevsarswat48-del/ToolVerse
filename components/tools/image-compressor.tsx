'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  Download,
  Trash2,
  ImageIcon,
  Sparkles,
  Sliders,
  RefreshCw,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

interface ImageMetrics {
  width: number;
  height: number;
  size: number;
}

type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png';

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ImageCompressorTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalMetrics, setOriginalMetrics] = useState<ImageMetrics | null>(null);

  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedMetrics, setCompressedMetrics] = useState<ImageMetrics | null>(null);

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [maxWidth, setMaxWidth] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image on canvas
  const processImage = useCallback(() => {
    if (!originalPreview || !originalMetrics) return;

    setIsProcessing(true);

    const img = new Image();
    img.src = originalPreview;

    img.onload = () => {
      let width = originalMetrics.width;
      let height = originalMetrics.height;

      // Calculate resized dimensions if max width is specified
      if (maxWidth && typeof maxWidth === 'number' && width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Draw white background for transparent images converted to JPEG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const q = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          if (compressedPreview) {
            URL.revokeObjectURL(compressedPreview);
          }

          const url = URL.createObjectURL(blob);
          setCompressedPreview(url);
          setCompressedBlob(blob);
          setCompressedMetrics({
            width,
            height,
            size: blob.size,
          });
          setIsProcessing(false);
        },
        format,
        q
      );
    };
  }, [originalPreview, originalMetrics, quality, format, maxWidth]);

  // Trigger compression whenever controls or source image change
  useEffect(() => {
    if (originalPreview && originalMetrics) {
      processImage();
    }
  }, [originalPreview, originalMetrics, quality, format, maxWidth]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);

    setCompressedPreview(null);
    setCompressedBlob(null);
    setCompressedMetrics(null);

    setOriginalFile(file);
    const objectUrl = URL.createObjectURL(file);
    setOriginalPreview(objectUrl);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setOriginalMetrics({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
      });
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = () => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);

    setOriginalFile(null);
    setOriginalPreview(null);
    setOriginalMetrics(null);
    setCompressedPreview(null);
    setCompressedBlob(null);
    setCompressedMetrics(null);
    setMaxWidth('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;

    const extension =
      format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName = originalFile.name.substring(
      0,
      originalFile.name.lastIndexOf('.')
    ) || 'compressed-image';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    link.download = `${baseName}-optimized.${extension}`;
    link.click();
  };

  // Metric Calculations
  const savingsPercent =
    originalMetrics && compressedMetrics
      ? Math.max(
          0,
          Math.round(
            ((originalMetrics.size - compressedMetrics.size) /
              originalMetrics.size) *
              100
          )
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <span>Client-Side Image Compressor & Resizer</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!originalFile}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Upload Zone (If no image loaded) */}
      {!originalPreview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
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
            accept="image/png, image/jpeg, image/webp"
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
              Click to upload or drag & drop an image
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPEG, PNG, WebP (Processed entirely in browser)
            </p>
          </div>
        </div>
      ) : (
        /* Workspace when image is uploaded */
        <div className="space-y-6">
          {/* Controls Settings Panel */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Compression Settings
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-300 font-medium">Quality ({quality}%)</label>
                  <span className="text-slate-500 font-mono">
                    {quality > 85 ? 'High Quality' : quality > 50 ? 'Balanced' : 'High Compression'}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  disabled={format === 'image/png'}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-30"
                />
              </div>

              {/* Output Format Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">Output Format</label>
                <div className="flex gap-2">
                  {[
                    { label: 'JPEG', val: 'image/jpeg' },
                    { label: 'WEBP', val: 'image/webp' },
                    { label: 'PNG', val: 'image/png' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setFormat(item.val as OutputFormat)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        format === item.val
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Width Resizer */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">
                  Max Width (px, optional)
                </label>
                <input
                  type="number"
                  placeholder={`Original: ${originalMetrics?.width || 0}px`}
                  value={maxWidth}
                  onChange={(e) =>
                    setMaxWidth(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-xs focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Metrics Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Original Size
              </span>
              <p className="text-base font-bold font-mono text-slate-200">
                {originalMetrics ? formatBytes(originalMetrics.size) : '-'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {originalMetrics?.width} × {originalMetrics?.height} px
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Compressed Size
              </span>
              <p className="text-base font-bold font-mono text-emerald-400">
                {compressedMetrics ? formatBytes(compressedMetrics.size) : 'Calculating...'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {compressedMetrics?.width} × {compressedMetrics?.height} px
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1 flex flex-col justify-between">
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
                disabled={!compressedBlob || isProcessing}
                className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition mt-2"
              >
                <Download className="w-3.5 h-3.5" /> Download Compressed
              </button>
            </div>
          </div>

          {/* Visual Previews Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                Original Image
              </span>
              <div className="relative h-72 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalPreview}
                  alt="Original"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Compressed Result Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Optimized Preview
              </span>
              <div className="relative h-72 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs font-mono">Compressing...</span>
                  </div>
                ) : compressedPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={compressedPreview}
                    alt="Compressed Output"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
