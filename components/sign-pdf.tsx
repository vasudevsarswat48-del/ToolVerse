"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, Trash2, Edit3, FileCheck, RefreshCw } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SignPdf() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setSignedPdfUrl(null);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Embed Signature into PDF using pdf-lib
  const handleEmbedSignature = async () => {
    if (!pdfFile || !hasSignature || !canvasRef.current) return;

    try {
      setIsProcessing(true);
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Convert Canvas Signature to PNG Image Data
      const signatureDataUrl = canvasRef.current.toDataURL("image/png");
      const signatureImage = await pdfDoc.embedPng(signatureDataUrl);

      // Get the first page of the PDF
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width } = firstPage.getSize();

      // Draw signature on the bottom right of the first page
      const sigDims = signatureImage.scale(0.4);
      firstPage.drawImage(signatureImage, {
        x: width - sigDims.width - 50,
        y: 50,
        width: sigDims.width,
        height: sigDims.height,
      });

      // Save modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setSignedPdfUrl(url);
    } catch (error) {
      console.error("Error signing PDF:", error);
      alert("Failed to sign PDF. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload & Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Upload PDF */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 1. Upload PDF
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select the document you wish to sign</p>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/40">
            <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs text-slate-200 font-medium truncate max-w-[200px]">
              {pdfFile ? pdfFile.name : "Choose PDF file"}
            </span>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Step 2: Draw Signature */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-400" /> 2. Draw Signature
            </h3>
            <button
              onClick={clearSignature}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden touch-none relative">
            <canvas
              ref={canvasRef}
              width={350}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair"
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-600">
                Sign inside this box
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process & Download Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Apply & Download</h4>
          <p className="text-xs text-slate-400">Embeds your signature onto page 1 of the PDF</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEmbedSignature}
            disabled={!pdfFile || !hasSignature || isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
            {isProcessing ? "Processing..." : "Sign PDF"}
          </button>

          {signedPdfUrl && (
            <a
              href={signedPdfUrl}
              download={`signed_${pdfFile?.name || "document.pdf"}`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download Signed PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
