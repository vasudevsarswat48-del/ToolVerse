"use client";

import React, { useState } from "react";
import { Copy, Download, QrCode } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://toolverse.dev");
  const [size, setSize] = useState(250);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text || " "
  )}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL..."
              rows={4}
              className="w-full glass-input p-3 rounded-xl focus:outline-none focus:border-accent text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image Size: {size}px
            </label>
            <input
              type="range"
              min="150"
              max="400"
              step="10"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-xl space-y-4">
          {text ? (
            <img
              src={qrUrl}
              alt="Generated QR Code"
              className="w-48 h-48 rounded-lg bg-white p-2 border border-surface-border"
            />
          ) : (
            <div className="w-48 h-48 rounded-lg border border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 text-xs">
              <QrCode className="w-8 h-8 mb-2" />
              Enter text to generate
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={!text}
            className="w-full py-2.5 px-4 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}