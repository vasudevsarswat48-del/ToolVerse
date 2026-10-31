'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Scaling,
  Lock,
  Unlock,
  Sparkles,
  Maximize2,
  RefreshCw,
  ImageIcon,
} from 'lucide-react';

interface ImageMetrics {
  width: number;
  height: number;
  size: number;
}

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ImageResizerTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalMetrics, setOriginalMetrics] = useState<ImageMetrics | null>(null);

  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedMetrics, setResizedMetrics] = useState<ImageMetrics | null>(null);

  const [targetWidth, setTargetWidth] = useState<number | ''>('');
  const [targetHeight, setTargetHeight] = useState<number | ''>('');
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [quality, setQuality] = useState<number>(90);
  const [scalePercent, setScalePercent] = useState<number>(100);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize operation via Canvas
  const processResize = useCallback(() => {
    if (!originalPreview || !originalMetrics) return;

    const widthNum = typeof targetWidth === 'number' && targetWidth > 0 ? targetWidth : originalMetrics.width;
    const heightNum = typeof targetHeight === 'number' && targetHeight > 0 ? targetHeight : originalMetrics.height;

    setIsProcessing(true);

    const img = new Image();
    img.src = originalPreview;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = widthNum;
      canvas.height = heightNum;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, widthNum, heightNum);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, widthNum, heightNum);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          if (resizedPreview) URL.revokeObjectURL(resizedPreview);

          const url = URL.createObjectURL(blob);
          setResizedPreview(url);
          setResizedBlob(blob);
          setResizedMetrics({
            width: widthNum,
            height: heightNum,
            size: blob.size,
          });
          setIsProcessing(false);
        },
        format,
        quality / 100
      );
    };
  }, [originalPreview, originalMetrics, targetWidth, targetHeight, format, quality]);

  useEffect(() => {
    if (originalPreview && originalMetrics) {
      processResize();
    }
  }, [originalPreview, originalMetrics, targetWidth, targetHeight, format, quality, processResize]);

  const handleWidthChange = (val: number | '') => {
    setTargetWidth(val);
    if (lockAspectRatio && originalMetrics && typeof val === 'number' && val > 0) {
      const ratio = originalMetrics.height / originalMetrics.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number | '') => {
    setTargetHeight(val);
    if (lockAspectRatio && originalMetrics && typeof val === 'number' && val > 0) {
      const ratio = originalMetrics.width / originalMetrics.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const applyPercentageScale = (percent: number) => {
    if (!originalMetrics) return;
    setScalePercent(percent);
    const newW = Math.round((originalMetrics.width * percent) / 100);
    const newH = Math.round((originalMetrics.height * percent) / 100);
    setTargetWidth(newW);
    setTargetHeight(newH);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (resizedPreview) URL.revokeObjectURL(resizedPreview);

    setResizedPreview(null);
    setResizedBlob(null);
    setResizedMetrics(null);

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
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setScalePercent(100);
    };
  };

  const handleClear = () => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (resizedPreview) URL.revokeObjectURL(resizedPreview);

    setOriginalFile(null);
    setOriginalPreview(null);
    setOriginalMetrics(null);
    setResizedPreview(null);
    setResizedBlob(null);
    setResizedMetrics(null);
    setTargetWidth('');
    setTargetHeight('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!resizedBlob || !originalFile) return;

    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName =
      originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'resized-image';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(resizedBlob);
    link.download = `${baseName}-${targetWidth}x${targetHeight}.${ext}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Scaling className="w-4 h-4 text-cyan-400" />
          <span>Client-Side Image Resizer & Dimension Scaler</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!originalFile}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {!originalPreview ? (
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
              Click to upload or drag & drop an image to resize
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPEG, WebP, GIF, SVG, BMP
            </p>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Dimension & Format Controls
            </span>

            {/* Quick Percentage Scaling */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium block">
                Quick Scale Preset
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[25, 50, 75, 100, 150, 200].slice(0, 5).map((pct) => (
                  <button
                    key={pct}
                    onClick={() => applyPercentageScale(pct)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition ${
                      scalePercent === pct
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Width & Height Inputs */}
              <div className="md:col-span-6 flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) =>
                      handleWidthChange(e.target.value ? Number(e.target.value) : '')
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-xs focus:outline-none transition"
                  />
                </div>

                {/* Aspect Ratio Lock Toggle */}
                <button
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  title={lockAspectRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                  className={`p-2 rounded-lg border transition mt-5 ${
                    lockAspectRatio
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lockAspectRatio ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) =>
                      handleHeightChange(e.target.value ? Number(e.target.value) : '')
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-xs focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Format & Quality */}
              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-slate-100 font-mono text-xs focus:outline-none transition"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">
                    Quality ({quality}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    disabled={format === 'image/png'}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-30 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics & Download Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Original Specs
              </span>
              <p className="text-sm font-bold font-mono text-slate-200">
                {originalMetrics?.width} × {originalMetrics?.height} px
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {originalMetrics ? formatBytes(originalMetrics.size) : '-'}
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Resized Target
              </span>
              <p className="text-sm font-bold font-mono text-cyan-400">
                {resizedMetrics?.width} × {resizedMetrics?.height} px
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {resizedMetrics ? formatBytes(resizedMetrics.size) : 'Calculating...'}
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center">
              <button
                onClick={handleDownload}
                disabled={!resizedBlob || isProcessing}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </button>
            </div>
          </div>

          {/* Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                Original Preview
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

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Resized Preview
              </span>
              <div className="relative h-72 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs font-mono">Resizing...</span>
                  </div>
                ) : resizedPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resizedPreview}
                    alt="Resized Result"
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
