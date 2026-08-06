"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const startIndex = Math.max(0, startPage - 1);
      const endIndex = Math.min(pdfDoc.getPageCount(), endPage);

      const indices = [];
      for (let i = startIndex; i < endIndex; i++) indices.push(i);

      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split-pages-${startPage}-to-${endPage}.pdf`;
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400">Start Page</label>
          <input
            type="number"
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(Number(e.target.value))}
            className="w-full glass-input p-3 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">End Page</label>
          <input
            type="number"
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(Number(e.target.value))}
            className="w-full glass-input p-3 rounded-xl text-sm"
          />
        </div>
      </div>
      <button
        onClick={splitPdf}
        disabled={!file || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> {isProcessing ? "Splitting..." : "Split PDF"}
      </button>
    </div>
  );
}