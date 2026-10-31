"use client";

import React, { useState } from "react";
import { Upload, Download, FileSpreadsheet, RefreshCw, Settings2, FileCheck } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function ExcelToPdf() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [marginSize, setMarginSize] = useState<number>(40);
  const [fontSize, setFontSize] = useState<number>(10);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv");

      if (isExcel) {
        setExcelFile(file);
        setConvertedPdfUrl(null);
      } else {
        alert("Please upload a valid Excel or CSV spreadsheet file.");
      }
    }
  };

  const handleConvert = async () => {
    if (!excelFile) return;

    try {
      setIsProcessing(true);

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageDimensions = pageSize === "a4" ? [595.28, 841.89] : [612.0, 792.0];
      let page = pdfDoc.addPage(pageDimensions as [number, number]);
      const { width, height } = page.getSize();

      const lineHeight = fontSize * 1.5;
      let currentY = height - marginSize;
      const printableWidth = width - marginSize * 2;

      // Read raw text/CSV content
      const textContent = await excelFile.text();
      const lines = textContent
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      // Render Title Header
      page.drawText(`Spreadsheet Export: ${excelFile.name}`, {
        x: marginSize,
        y: currentY,
        size: fontSize + 4,
        font: fontBold,
        color: rgb(0.1, 0.4, 0.8),
      });
      currentY -= lineHeight * 2;

      for (let i = 0; i < lines.length; i++) {
        const rowText = lines[i].replace(/,/g, "   |   ");

        if (currentY - lineHeight < marginSize) {
          page = pdfDoc.addPage(pageDimensions as [number, number]);
          currentY = height - marginSize;
        }

        const isHeaderRow = i === 0;
        page.drawText(rowText.substring(0, 110), {
          x: marginSize,
          y: currentY,
          size: fontSize,
          font: isHeaderRow ? fontBold : font,
          color: isHeaderRow ? rgb(0.2, 0.2, 0.2) : rgb(0.3, 0.3, 0.3),
        });

        currentY -= lineHeight;
      }

  
     const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
const url = URL.createObjectURL(blob);
      setConvertedPdfUrl(url);
    } catch (error) {
      console.error("Error converting excel file:", error);
      alert("Failed to convert spreadsheet. Please check the file contents.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> 1. Select Excel File
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload `.xlsx`, `.xls`, or `.csv` spreadsheets</p>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/40">
            <FileSpreadsheet className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="text-xs text-slate-200 font-medium truncate max-w-[220px]">
              {excelFile ? excelFile.name : "Choose .xlsx / .csv file"}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Step 2: Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-purple-400" /> 2. Export Formatting
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "a4" | "letter")}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="letter">US Letter (8.5 x 11 in)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Font Size ({fontSize}pt)</label>
              <input
                type="range"
                min="8"
                max="14"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Margin ({marginSize}pt)</label>
              <input
                type="range"
                min="20"
                max="60"
                value={marginSize}
                onChange={(e) => setMarginSize(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Convert & Export</h4>
          <p className="text-xs text-slate-400">Renders spreadsheet rows into a standard printable PDF</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConvert}
            disabled={!excelFile || isProcessing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
            {isProcessing ? "Converting..." : "Convert to PDF"}
          </button>

          {convertedPdfUrl && (
            <a
              href={convertedPdfUrl}
              download={`${excelFile?.name.replace(/\.[^/.]+$/, "") || "spreadsheet"}.pdf`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
