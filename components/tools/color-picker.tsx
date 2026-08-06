"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ColorPicker() {
  const [color, setColor] = useState("#3b82f6");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: hexToRgb(color) },
    { label: "HSL", value: hexToHsl(color) },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-32 h-32 rounded-xl border border-surface-border cursor-pointer bg-transparent"
        />
        <div className="flex-1 space-y-3 w-full">
          {formats.map((fmt) => (
            <div key={fmt.label} className="flex items-center justify-between glass-input p-3 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">{fmt.label}</span>
              <span className="font-mono text-white">{fmt.value}</span>
              <button
                onClick={() => copy(fmt.value, fmt.label)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {copiedKey === fmt.label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}