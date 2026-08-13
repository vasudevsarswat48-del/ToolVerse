"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, FileText, CheckCircle } from "lucide-react";

export default function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [creator, setCreator] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const arrayBuf = await selected.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuf);

    setFile(selected);
    setBuffer(arrayBuf);
    setTitle(pdfDoc.getTitle() || "");
    setAuthor(pdfDoc.getAuthor() || "");
    setSubject(pdfDoc.getSubject() || "");
    setKeywords(pdfDoc.getKeywords() || "");
    setCreator(pdfDoc.getCreator() || "");
  };

  const handleSave = async () => {
    if (!buffer) return;
    const pdfDoc = await PDFDocument.load(buffer);
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(author);
    pdfDoc.setSubject(subject);
    pdfDoc.setKeywords(keywords.split(",").map((k) => k.trim()));
    pdfDoc.setCreator(creator);

    const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `edited_${file?.name || "document.pdf"}`;
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> PDF Metadata Editor
          </h2>
          <p className="text-xs text-slate-400">View and update metadata attributes of PDF documents.</p>
        </div>
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950 p-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors">
          <Upload className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-semibold text-slate-200">Upload PDF Document</span>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Document Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Keywords (Comma separated)</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
            <Download className="w-4 h-4" /> Save Updated PDF
          </button>
        </div>
      )}
    </div>
  );
}
