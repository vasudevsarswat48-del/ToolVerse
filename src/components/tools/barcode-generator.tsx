"use client";

import React, { useState } from "react";
import { Barcode } from "lucide-react";

const CODE39_MAP: Record<string, string> = {
  "0": "101001101101", "1": "110100101011", "2": "101100101011", "3": "110110010101",
  "4": "101001101011", "5": "110100110101", "6": "101100110101", "7": "101001011011",
  "8": "110100101101", "9": "101100101101", "A": "110101001011", "B": "101101001011",
  "C": "110110100101", "D": "101011001011", "E": "110101100101", "F": "101101100101",
  "G": "101010011011", "H": "110101001101", "I": "101101001101", "J": "101011001101",
  "K": "110101010011", "L": "101101010011", "M": "110110101001", "N": "101011010011",
  "O": "110101101001", "P": "101101101001", "Q": "101010110011", "R": "110101011001",
  "S": "101101011001", "T": "101011011001", "U": "110010101011", "V": "100110101011",
  "W": "110011010101", "X": "100101101011", "Y": "110010110101", "Z": "100110110101",
  "-": "100101011011", ".": "110010101101", " ": "100110101101", "*": "100101101101"
};

export default function BarcodeGenerator() {
  const [text, setText] = useState("12345678");

  const cleanText = text.toUpperCase().replace(/[^0-9A-Z\-.\s]/g, "");
  const formatted = `*${cleanText}*`;

  const pattern = formatted
    .split("")
    .map((char) => CODE39_MAP[char] || CODE39_MAP["*"])
    .join("0");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Barcode className="w-5 h-5 text-blue-400" /> Barcode Generator
        </h2>
        <p className="text-xs text-slate-400">Generate standard Code39 barcodes instantly.</p>
      </div>

      <div className="space-y-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none"
          placeholder="Enter numbers or uppercase text..."
        />
        <div className="bg-white p-6 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox={`0 0 ${pattern.length * 3} 80`} className="h-20 max-w-full">
            {pattern.split("").map((bit, i) =>
              bit === "1" ? (
                <rect key={i} x={i * 3} y="0" width="3" height="80" fill="#000" />
              ) : null
            )}
          </svg>
          <span className="text-black font-mono text-xs font-bold mt-2">{cleanText}</span>
        </div>
      </div>
    </div>
  );
}
