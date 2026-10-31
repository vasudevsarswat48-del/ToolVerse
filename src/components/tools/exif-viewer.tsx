"use client";

import React, { useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";

export default function ExifViewer() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      setCleanedUrl(canvas.toDataURL("image/jpeg"));
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" /> EXIF Data Viewer & Stripper
        </h2>
        <p className="text-xs text-slate-400">Inspect file attributes and strip EXIF metadata tags.</p>
      </div>

      <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
        <Upload className="w-6 h-6 text-blue-400 mb-2" />
        <span className="text-xs font-semibold text-slate-200">Upload JPG Image</span>
        <input type="file" accept="image/jpeg,image/png" onChange={handleUpload} className="hidden" />
      </label>

      {fileName && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1 text-slate-300">
            <div><strong>File:</strong> {fileName}</div>
            <div><strong>Size:</strong> {fileSize}</div>
          </div>
          {cleanedUrl && (
            <a href={cleanedUrl} download={`clean_${fileName}`} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg w-max">
              <Trash2 className="w-4 h-4" /> Download EXIF-Stripped Image
            </a>
          )}
        </div>
      )}
    </div>
  );
}
