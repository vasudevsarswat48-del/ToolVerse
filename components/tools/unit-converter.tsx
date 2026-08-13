"use client";

import React, { useState, useMemo } from "react";
import { UNIT_CATEGORIES, convertUnit } from "@/lib/constants/units";
import { ArrowLeftRight, Copy, Check } from "lucide-react";

export default function UnitConverter() {
  const categoryKeys = Object.keys(UNIT_CATEGORIES);

  const [category, setCategory] = useState("temperature");
  const [amount, setAmount] = useState<string>("1");

  const availableUnits = Object.keys(UNIT_CATEGORIES[category].units);
  const [fromUnit, setFromUnit] = useState<string>(availableUnits[0]);
  const [toUnit, setToUnit] = useState<string>(availableUnits[1] || availableUnits[0]);
  const [copied, setCopied] = useState(false);

  // Handle category switch and set valid initial units
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const units = Object.keys(UNIT_CATEGORIES[newCat].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const convertedValue = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0";
    const res = convertUnit(num, fromUnit, toUnit, category);
    return Number.isInteger(res) ? res.toString() : res.toFixed(6).replace(/\.?0+$/, "");
  }, [amount, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-6">
      {/* Category Select Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              category === cat
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            {UNIT_CATEGORIES[cat].name}
          </button>
        ))}
      </div>

      {/* Main Conversion Interface */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* From Section */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-medium text-slate-400">From</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-cyan-500 text-sm font-mono"
            placeholder="0"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl outline-none focus:border-cyan-500 text-xs"
          >
            {availableUnits.map((u) => (
              <option key={u} value={u}>
                {UNIT_CATEGORIES[category].units[u].name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:pt-6">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Section */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-medium text-slate-400">To</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={convertedValue}
              className="w-full bg-slate-950/50 border border-slate-800 text-cyan-400 font-bold p-3 rounded-xl outline-none text-sm font-mono pr-10"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl outline-none focus:border-cyan-500 text-xs"
          >
            {availableUnits.map((u) => (
              <option key={u} value={u}>
                {UNIT_CATEGORIES[category].units[u].name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
