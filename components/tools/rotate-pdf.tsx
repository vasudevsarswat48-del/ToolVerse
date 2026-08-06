"use client";

import React, { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw } from "lucide-react";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const rotatePdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      pdfDoc.getPages().forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotated.pdf";
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
      <select
        value={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
        className="w-full glass-input p-3 rounded-xl text-sm bg-zinc-900 text-white"
      >
        <option value={90}>Rotate 90° Clockwise</option>
        <option value={180}>Rotate 180°</option>
        <option value={270}>Rotate 270° Clockwise</option>
      </select>
      <button
        onClick={rotatePdf}
        disabled={!file || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <RotateCw className="w-4 h-4" /> {isProcessing ? "Processing..." : "Rotate PDF"}
      </button>
    </div>
  );
}