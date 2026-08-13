"use client";

import React, { useState } from "react";
import { Ruler } from "lucide-react";

export default function UnitConverter() {
  const [val, setVal] = useState<number>(1);
  const [type, setType] = useState<"length" | "weight">("length");

  const meters = val;
  const feet = (val * 3.28084).toFixed(2);
  const inches = (val * 39.3701).toFixed(2);
  const km = (val / 1000).toFixed(4);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-400" /> Unit Converter
        </h2>
        <p className="text-xs text-slate-400">Convert standard length and metric measurements.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Value (Meters)</label>
          <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Feet</span>
            <span className="font-bold text-slate-200">{feet} ft</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Inches</span>
            <span className="font-bold text-slate-200">{inches} in</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Kilometers</span>
            <span className="font-bold text-slate-200">{km} km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
