"use client";

import React, { useState, useEffect, useRef } from "react";
import { Barcode, Download } from "lucide-react";
import JsBarcode from "jsbarcode";

export default function BarcodeGenerator() {
  const [text, setText] = useState("123456789012");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && text) {
      try {
        JsBarcode(svgRef.current, text, { format: "CODE128", width: 2, height: 80 });
      } catch (e) {}
    }
  }, [text]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Barcode className="w-5 h-5 text-blue-400" /> Barcode Generator
        </h2>
        <p className="text-xs text-slate-400">Generate standard Code128 barcodes instantly.</p>
      </div>

      <div className="space-y-4">
        <input value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none" />
        <div className="bg-white p-6 rounded-xl flex justify-center">
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
  );
}
