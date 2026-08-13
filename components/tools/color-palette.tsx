"use client";

import React, { useState } from "react";
import { Palette, Upload, Copy, Check } from "lucide-react";

export default function ColorPalette() {
  const [colors, setColors] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;
      ctx?.drawImage(img, 0, 0, 100, 100);

      const data = ctx?.getImageData(0, 0, 100, 100).data;
      if (!data) return;

      const extracted: string[] = [];
      for (let i = 0; i < data.length; i += 1000) {
        const hex = `#${((1 << 24) + (data[i] << 16) + (data[i + 1] << 8) + data[i + 2]).toString(16).slice(1)}`;
        if (!extracted.includes(hex)) extracted.push(hex);
      }
      setColors(extracted.slice(0, 6));
    };
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" /> Color Palette Extractor
        </h2>
        <p className="text-xs text-slate-400">Extract dominant HEX colors from uploaded images.</p>
      </div>

      <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
        <Upload className="w-6 h-6 text-blue-400 mb-2" />
        <span className="text-xs font-semibold text-slate-200">Upload Image</span>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {colors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((hex) => (
            <div key={hex} onClick={() => copyHex(hex)} className="bg-slate-950 border border-slate-800 rounded-xl p-3 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="h-16 rounded-lg mb-2 border border-slate-800" style={{ backgroundColor: hex }} />
              <div className="flex justify-between items-center text-xs font-mono text-slate-200">
                <span>{hex}</span>
                {copiedColor === hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
