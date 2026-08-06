"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2 } from "lucide-react";

export default function RemovePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumbers, setPageNumbers] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const removePages = async () => {
    if (!file || !pageNumbers) return;
    setIsProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const toRemove = pageNumbers
        .split(",")
        .map((n) => parseInt(n.trim()) - 1)
        .filter((n) => !isNaN(n))
        .sort((a, b) => b - a);

      toRemove.forEach((index) => {
        if (index >= 0 && index < pdfDoc.getPageCount()) {
          pdfDoc.removePage(index);
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
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
      <input
        type="text"
        placeholder="Pages to remove (comma-separated, e.g. 1, 3, 5)"
        value={pageNumbers}
        onChange={(e) => setPageNumbers(e.target.value)}
        className="w-full glass-input p-3 rounded-xl text-sm"
      />
      <button
        onClick={removePages}
        disabled={!file || !pageNumbers || isProcessing}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" /> {isProcessing ? "Removing..." : "Remove Pages"}
      </button>
    </div>
  );
}