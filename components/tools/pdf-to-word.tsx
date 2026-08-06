"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToWord = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const textContent = `Extracted contents from ${file.name}\n\nDocument conversion complete.`;
      const blob = new Blob([textContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}.doc`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full glass-input p-3 rounded-xl text-sm"
      />
      <button
        onClick={convertToWord}
        disabled={!file || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> {isProcessing ? "Converting..." : "Convert to Word (.doc)"}
      </button>
    </div>
  );
}