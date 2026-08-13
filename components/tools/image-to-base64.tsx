"use client";

import React, { useState } from "react";
import { Code2, Upload, Copy, Check } from "lucide-react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" /> Image to Base64 Converter
        </h2>
        <p className="text-xs text-slate-400">Convert image files directly into Base64 encoded strings.</p>
      </div>

      <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
        <Upload className="w-6 h-6 text-blue-400 mb-2" />
        <span className="text-xs font-semibold text-slate-200">Select Image File</span>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {base64 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Base64 Output</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly value={base64} className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-xs focus:outline-none" />
        </div>
      )}
    </div>
  );
}
