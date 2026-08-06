"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
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
        onClick={compressPdf}
        disabled={!file || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> {isProcessing ? "Compressing..." : "Compress PDF"}
      </button>
    </div>
  );
}