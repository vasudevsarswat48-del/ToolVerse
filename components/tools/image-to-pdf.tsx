"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToPdf = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images-converted.pdf";
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
        multiple
        accept="image/png, image/jpeg"
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="w-full glass-input p-3 rounded-xl text-sm"
      />
      <button
        onClick={convertToPdf}
        disabled={!files.length || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> {isProcessing ? "Converting..." : "Convert to PDF"}
      </button>
    </div>
  );
}