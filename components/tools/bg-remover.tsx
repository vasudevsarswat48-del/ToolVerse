"use client";

import React, { useState } from "react";
import { Eraser, Upload, Download, RefreshCw } from "lucide-react";

export default function BgRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setProcessed(null);
  };

  const removeBgCanvas = () => {
    if (!image) return;
    setLoading(true);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imgData) {
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 230 && d[i + 1] > 230 && d[i + 2] > 230) {
            d[i + 3] = 0;
          }
        }
        ctx?.putImageData(imgData, 0, 0);
        setProcessed(canvas.toDataURL("image/png"));
      }
      setLoading(false);
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Eraser className="w-5 h-5 text-blue-400" /> Image Background Remover
          </h2>
          <p className="text-xs text-slate-400">Remove solid backgrounds instantly in browser.</p>
        </div>
      </div>

      {!image ? (
        <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-semibold text-slate-200">Upload Image File</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-2">Original</span>
              <img src={image} alt="Original" className="max-h-60 mx-auto rounded" />
            </div>
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-2">Result</span>
              {processed ? (
                <img src={processed} alt="Result" className="max-h-60 mx-auto rounded bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
              ) : (
                <div className="h-60 flex items-center justify-center text-xs text-slate-500">Click process below</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={removeBgCanvas} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />} Clear Background
            </button>
            {processed && (
              <a href={processed} download="no-bg.png" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
                <Download className="w-4 h-4" /> Download PNG
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
