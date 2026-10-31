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
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Sidebar: category list */}
      <div className="md:w-60 shrink-0 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-4">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap text-left transition-all ${
                category === cat
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {UNIT_CATEGORIES[cat].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 p-6 md:p-8 space-y-6">
        {/* Top title bar */}
        <div className="bg-cyan-500 text-slate-950 font-bold text-center tracking-widest text-lg py-3 rounded-xl">
          UNIT CONVERTER
        </div>

        <h2 className="text-2xl font-bold text-white">
          Convert {UNIT_CATEGORIES[category].name}
        </h2>

        {/* From panel */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5">
            <span className="text-sm font-semibold text-slate-200">From</span>
            <button
              onClick={handleSwap}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 flex flex-col sm:flex-row gap-3 bg-slate-900">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-cyan-500 text-sm font-mono"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="sm:w-56 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 text-sm"
            >
              {availableUnits.map((u) => (
                <option key={u} value={u}>
                  {UNIT_CATEGORIES[category].units[u].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* To panel */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800 px-4 py-2.5">
            <span className="text-sm font-semibold text-slate-200">To</span>
          </div>
          <div className="p-4 flex flex-col sm:flex-row gap-3 bg-slate-900">
            <div className="relative flex-1">
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
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="sm:w-56 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 text-sm"
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
    </div>
  );
}
