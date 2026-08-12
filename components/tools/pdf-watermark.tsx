"use client";

import React, { useState } from "react";
import { Upload, Download, Stamp, RefreshCw, FileCheck, Type, RotateCw, Eye } from "lucide-react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export default function PdfWatermark() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState<number>(48);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [angle, setAngle] = useState<number>(45);
  const [colorHex, setColorHex] = useState("#ef4444"); // Default red
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string | null>(null);

  // Convert Hex color to RGB ratios (0.0 to 1.0) for pdf-lib
  const hexToRgbRatio = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
    return rgb(r, g, b);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setWatermarkedPdfUrl(null);
    }
  };

  const handleApplyWatermark = async () => {
    if (!pdfFile || !text.trim()) return;

    try {
      setIsProcessing(true);
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const watermarkColor = hexToRgbRatio(colorHex);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Center position calculations
        const x = (width - textWidth) / 2;
        const y = (height - textHeight) / 2;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: degrees(angle),
        });
      }

      const watermarkedpdfBytes = await pdfDoc.save();
const blob = new Blob([watermarkedpdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });;
      
      const url = URL.createObjectURL(blob);

      setWatermarkedPdfUrl(url);
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Failed to apply watermark. Please try another PDF file.");
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
              <Upload className="w-4 h-4 text-blue-400" /> 1. Select PDF File
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload the document you want to watermark</p>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/40">
            <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs text-slate-200 font-medium truncate max-w-[200px]">
              {pdfFile ? pdfFile.name : "Choose PDF file"}
            </span>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Step 2: Customization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Stamp className="w-4 h-4 text-purple-400" /> 2. Watermark Customization
          </h3>

          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-400" /> Watermark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL / DRAFT"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Font Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="100"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" /> Opacity ({Math.round(opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Angle */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-slate-400" /> Angle ({angle}°)
              </label>
              <select
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-white focus:outline-none"
              >
                <option value={0}>0° (Horizontal)</option>
                <option value={45}>45° (Diagonal)</option>
                <option value={90}>90° (Vertical)</option>
                <option value={-45}>-45° (Reverse Diagonal)</option>
              </select>
            </div>

            {/* Color */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400">{colorHex.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Apply & Export</h4>
          <p className="text-xs text-slate-400">Applies your custom watermark across every page of the document</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyWatermark}
            disabled={!pdfFile || !text.trim() || isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stamp className="w-4 h-4" />}
            {isProcessing ? "Processing..." : "Apply Watermark"}
          </button>

          {watermarkedPdfUrl && (
            <a
              href={watermarkedPdfUrl}
              download={`watermarked_${pdfFile?.name || "document.pdf"}`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download Watermarked PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
