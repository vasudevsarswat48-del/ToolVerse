"use client";

import React, { useState } from "react";
import { GitCompare } from "lucide-react";

export default function JsonDiff() {
  const [left, setLeft] = useState('{\n  "name": "ToolVerse"\n}');
  const [right, setRight] = useState('{\n  "name": "ToolVerse",\n  "version": "1.0"\n}');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-blue-400" /> JSON & Code Structural Diff
        </h2>
        <p className="text-xs text-slate-400">Compare structural changes between two payload versions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Original JSON</label>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Modified JSON</label>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none" />
        </div>
      </div>
    </div>
  );
}
