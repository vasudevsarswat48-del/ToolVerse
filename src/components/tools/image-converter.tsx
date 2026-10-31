'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  RefreshCw,
  ArrowRightLeft,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

type TargetFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  originalType: string;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  convertedSize: number | null;
  width: number;
  height: number;
  isProcessing: boolean;
  error?: string;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const formatLabels: Record<TargetFormat, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WEBP',
  'image/bmp': 'BMP',
};

const formatExtensions: Record<TargetFormat, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
};

export default function ImageConverterTool() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertSingleFile = useCallback(
    (
      fileObj: ConvertedFile,
      targetType: TargetFormat,
      qualityVal: number,
      sourceFile: File
    ) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setFiles((prev) =>
              prev.map((item) =>
                item.id === fileObj.id
                  ? { ...item, isProcessing: false, error: 'Canvas context failed' }
                  : item
              )
            );
            return;
          }

          // Fill white background for JPEG output if source has transparency
          if (targetType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setFiles((prev) =>
                  prev.map((item) =>
                    item.id === fileObj.id
                      ? { ...item, isProcessing: false, error: 'Conversion failed' }
                      : item
                  )
                );
                return;
              }

              const convertedUrl = URL.createObjectURL(blob);
              setFiles((prev) =>
                prev.map((item) => {
                  if (item.id === fileObj.id) {
                    if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
                    return {
                      ...item,
                      convertedBlob: blob,
                      convertedUrl,
                      convertedSize: blob.size,
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      isProcessing: false,
                    };
                  }
                  return item;
                })
              );
            },
            targetType,
            qualityVal / 100
          );
        };
      };

      reader.readAsDataURL(sourceFile);
    },
    []
  );

  const handleFilesAdded = (fileList: FileList | File[]) => {
    const validFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const newEntries: ConvertedFile[] = validFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      originalName: f.name,
      originalSize: f.size,
      originalType: f.type || 'image/unknown',
      convertedBlob: null,
      convertedUrl: null,
      convertedSize: null,
      width: 0,
      height: 0,
      isProcessing: true,
    }));

    setFiles((prev) => [...prev, ...newEntries]);

    newEntries.forEach((entry, idx) => {
      convertSingleFile(entry, targetFormat, quality, validFiles[idx]);
    });
  };

  const handleFormatChange = (newFormat: TargetFormat) => {
    setTargetFormat(newFormat);
    // Re-trigger conversion if files exist
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((item) => item.id === id);
      if (fileToRemove?.convertedUrl) {
        URL.revokeObjectURL(fileToRemove.convertedUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleDownload = (file: ConvertedFile) => {
    if (!file.convertedUrl) return;
    const baseName =
      file.originalName.substring(0, file.originalName.lastIndexOf('.')) ||
      'converted-image';
    const ext = formatExtensions[targetFormat];

    const link = document.createElement('a');
    link.href = file.convertedUrl;
    link.download = `${baseName}.${ext}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Tool Header Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>Client-Side Image Format Converter</span>
        </div>

        <button
          onClick={handleClearAll}
          disabled={files.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Target Format & Settings Bar */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Target Settings
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Format Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium block">Convert To</label>
            <div className="grid grid-cols-4 gap-2">
              {(['image/webp', 'image/png', 'image/jpeg', 'image/bmp'] as TargetFormat[]).map(
                (fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleFormatChange(fmt)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      targetFormat === fmt
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {formatLabels[fmt]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quality Slider (For JPEG and WebP) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Quality ({quality}%)</label>
              <span className="text-slate-500 font-mono">
                {targetFormat === 'image/png' || targetFormat === 'image/bmp'
                  ? 'Lossless'
                  : `${quality}% Compression`}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              disabled={targetFormat === 'image/png' || targetFormat === 'image/bmp'}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFilesAdded(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFilesAdded(e.target.files);
          }}
        />
        <div className="p-3 bg-slate-800/80 rounded-full text-cyan-400">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            Click or drag & drop images to convert
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports PNG, JPEG, WebP, GIF, SVG, BMP (Batch processing supported)
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Converted Images ({files.length})
          </span>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 transition hover:border-slate-700"
              >
                {/* Left: Thumbnail and Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {file.convertedUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={file.convertedUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {file.originalName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-0.5">
                      <span>{formatBytes(file.originalSize)}</span>
                      <span>→</span>
                      <span className="text-cyan-400 font-bold">
                        {file.convertedSize ? formatBytes(file.convertedSize) : 'Converting...'}
                      </span>
                      {file.width > 0 && (
                        <span>
                          ({file.width}×{file.height}px)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {file.isProcessing ? (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : file.convertedUrl ? (
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{formatLabels[targetFormat]}</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
