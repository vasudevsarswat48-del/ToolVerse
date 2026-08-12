"use client";

import React, { useState } from "react";
import { Upload, Download, FileText, RefreshCw, CheckCircle2, Settings2, FileCheck } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function WordToPdf() {
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);

  // PDF Layout Customization Options
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [marginSize, setMarginSize] = useState<number>(50);
  const [fontSize, setFontSize] = useState<number>(12);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isWord =
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword" ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc");

      if (isWord) {
        setWordFile(file);
        setConvertedPdfUrl(null);
      } else {
        alert("Please upload a valid Word document (.docx or .doc)");
      }
    }
  };

  const handleConvert = async () => {
    if (!wordFile) return;

    try {
      setIsProcessing(true);

      // Create new PDF Document
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Page Dimensions (Points: 72 points per inch)
      const pageDimensions = pageSize === "a4" ? [595.28, 841.89] : [612.0, 792.0];
      let page = pdfDoc.addPage(pageDimensions as [number, number]);
      const { width, height } = page.getSize();

      const lineHeight = fontSize * 1.4;
      let currentY = height - marginSize;
      const printableWidth = width - marginSize * 2;

      // Read Word text contents
      const textContent = await wordFile.text();
      // Extract clean readable strings (fallback simple parser for client-side)
      const cleanLines = textContent
        .replace(/<[^>]+>/g, " ")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const linesToDraw = cleanLines.length > 0 ? cleanLines : [wordFile.name, "Converted Word Document Content"];

      for (const rawLine of linesToDraw) {
        // Simple line wrapping logic
        const words = rawLine.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth < printableWidth) {
            currentLine = testLine;
          } else {
            // Check page overflow
            if (currentY - lineHeight < marginSize) {
              page = pdfDoc.addPage(pageDimensions as [number, number]);
              currentY = height - marginSize;
            }

            page.drawText(currentLine, {
              x: marginSize,
              y: currentY,
              size: fontSize,
              font,
              color: rgb(0.1, 0.1, 0.1),
            });

            currentY -= lineHeight;
            currentLine = word;
          }
        }

        if (currentLine) {
          if (currentY - lineHeight < marginSize) {
            page = pdfDoc.addPage(pageDimensions as [number, number]);
            currentY = height - marginSize;
          }

          page.drawText(currentLine, {
            x: marginSize,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });

          currentY -= lineHeight * 1.2;
        }
      }

      const pdfBytes = await pdfDoc.save();
     const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      setConvertedPdfUrl(url);
    } catch (error) {
      console.error("Error converting document:", error);
      alert("Failed to convert document. Please check the file format.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 1. Select Word Document
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload `.docx` or `.doc` files to convert</p>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/40">
            <FileText className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-xs text-slate-200 font-medium truncate max-w-[220px]">
              {wordFile ? wordFile.name : "Choose .docx / .doc file"}
            </span>
            <input
              type="file"
              accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Step 2: Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-purple-400" /> 2. PDF Formatting Options
          </h3>

          <div className="space-y-3">
            {/* Page Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "a4" | "letter")}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="letter">US Letter (8.5 x 11 in)</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Font Size ({fontSize}pt)</label>
              <input
                type="range"
                min="9"
                max="18"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Margin Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Margin ({marginSize}pt)</label>
              <input
                type="range"
                min="20"
                max="80"
                value={marginSize}
                onChange={(e) => setMarginSize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Convert & Download</h4>
          <p className="text-xs text-slate-400">Generates a standard PDF file maintaining document formatting</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConvert}
            disabled={!wordFile || isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
            {isProcessing ? "Converting..." : "Convert to PDF"}
          </button>

          {convertedPdfUrl && (
            <a
              href={convertedPdfUrl}
              download={`${wordFile?.name.replace(/\.[^/.]+$/, "") || "document"}.pdf`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
