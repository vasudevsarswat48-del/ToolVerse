"use client";

import React, { useState } from "react";
import {
  Upload,
  RotateCw,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Download,
  FileText,
  RefreshCw,
} from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
}

export default function PdfOrganizer() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle PDF Upload & Initialization
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== "application/pdf") return;

    setIsProcessing(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const count = pdfDoc.getPageCount();

      const initialPages: PageItem[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i}-${Date.now()}`,
        originalIndex: i,
        rotation: 0,
      }));

      setFile(selectedFile);
      setFileBuffer(buffer);
      setPages(initialPages);
    } catch (err) {
      alert("Failed to load PDF file. Please ensure it is a valid, unencrypted PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reorder Pages
  const movePage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const [movedPage] = newPages.splice(index, 1);
    newPages.splice(targetIndex, 0, movedPage);
    setPages(newPages);
  };

  // Rotate Page
  const rotatePage = (index: number, angle: number) => {
    setPages((prev) =>
      prev.map((page, i) => {
        if (i !== index) return page;
        const newRotation = (page.rotation + angle + 360) % 360;
        return { ...page, rotation: newRotation };
      })
    );
  };

  // Delete Page
  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      alert("The document must contain at least one page.");
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate & Download Re-organized PDF
  const handleDownload = async () => {
    if (!fileBuffer || pages.length === 0) return;

    setIsDownloading(true);
    try {
      const srcPdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();

      for (const item of pages) {
        const [copiedPage] = await newPdf.copyPages(srcPdf, [item.originalIndex]);
        if (item.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
        }
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file ? `organized_${file.name}` : "organized_document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error generating reordered PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileBuffer(null);
    setPages([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            PDF Page Organizer & Reorder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Reorder, rotate, or delete pages, then export a restructured PDF.
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-600/20 transition-colors disabled:opacity-50"
            >
              {isDownloading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Upload Dropzone */}
      {!file && (
        <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/50 hover:bg-slate-900/80 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl mb-4">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {isProcessing ? "Reading PDF structure..." : "Click or drag PDF file here to upload"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports standard, unencrypted PDF files</p>
        </label>
      )}

      {/* Pages Grid */}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Total Pages: <strong className="text-slate-200">{pages.length}</strong>
            </span>
            <span>Use controls on each page card to adjust order or rotation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-between space-y-3 transition-colors group"
              >
                {/* Page Number Label */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span className="font-semibold text-slate-300">Pos: {index + 1}</span>
                  <span className="text-[10px] text-slate-500">
                    Orig: #{page.originalIndex + 1}
                  </span>
                </div>

                {/* Simulated Thumbnail Card */}
                <div
                  className="w-full h-32 bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center space-y-1 transition-transform duration-200"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                >
                  <FileText className="w-8 h-8 text-blue-400/80" />
                  <span className="text-[10px] font-bold text-slate-400">
                    Page {page.originalIndex + 1}
                  </span>
                </div>

                {/* Card Toolbar */}
                <div className="w-full space-y-1.5 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => rotatePage(index, -90)}
                      title="Rotate Counter-Clockwise"
                      className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {page.rotation}°
                    </span>
                    <button
                      onClick={() => rotatePage(index, 90)}
                      title="Rotate Clockwise"
                      className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => movePage(index, "left")}
                      disabled={index === 0}
                      title="Move Left"
                      className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded disabled:opacity-20 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deletePage(index)}
                      title="Delete Page"
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => movePage(index, "right")}
                      disabled={index === pages.length - 1}
                      title="Move Right"
                      className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded disabled:opacity-20 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
