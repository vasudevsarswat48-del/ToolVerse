"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Upload, Download } from "lucide-react";

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.max(2, img.height / 100);
        ctx.font = `bold ${Math.max(20, img.height / 10)}px Impact, sans-serif`;
        ctx.textAlign = "center";

        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, img.height / 8);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, img.height / 8);

        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, img.height - img.height / 12);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, img.height - img.height / 12);
      }
    };
  }, [image, topText, bottomText]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Smile className="w-5 h-5 text-blue-400" /> Meme Generator
        </h2>
        <p className="text-xs text-slate-400">Add custom text captions onto meme images.</p>
      </div>

      {!image ? (
        <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-semibold text-slate-200">Upload Image Template</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Top Caption</label>
              <input value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Bottom Caption</label>
              <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none" />
            </div>
            <a href={canvasRef.current?.toDataURL() || "#"} download="meme.png" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg w-max">
              <Download className="w-4 h-4" /> Export Meme
            </a>
          </div>
          <div>
            <canvas ref={canvasRef} className="max-w-full rounded-xl border border-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
}
