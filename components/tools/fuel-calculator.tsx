"use client";

import React, { useState } from "react";
import { Fuel, MapPin, Gauge, DollarSign, RotateCcw, Car } from "lucide-react";

export default function FuelCalculator() {
  const [distance, setDistance] = useState<number>(350);
  const [efficiency, setEfficiency] = useState<number>(15); // km/L or MPG
  const [pricePerUnit, setPricePerUnit] = useState<number>(1.85); // price per liter or gallon
  const [passengers, setPassengers] = useState<number>(1);

  // Calculations
  const totalFuelNeeded = efficiency > 0 ? distance / efficiency : 0;
  const totalCost = totalFuelNeeded * pricePerUnit;
  const costPerPerson = passengers > 0 ? totalCost / passengers : totalCost;
  const costPerDistance = distance > 0 ? totalCost / distance : 0;

  const resetAll = () => {
    setDistance(350);
    setEfficiency(15);
    setPricePerUnit(1.85);
    setPassengers(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Trip Fuel & Cost Calculator</h2>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trip Distance */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Trip Distance (km / miles)
              </label>
              <input
                type="number"
                min="1"
                value={distance}
                onChange={(e) => setDistance(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Fuel Efficiency */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Fuel Efficiency (km/L or MPG)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={efficiency}
                onChange={(e) => setEfficiency(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Fuel Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Fuel Price (per L / Gal)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Passengers */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-purple-400" /> Passengers (for cost split)
              </label>
              <input
                type="number"
                min="1"
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Trip Cost
            </span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              ${totalCost.toFixed(2)}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Fuel Needed</span>
              <span className="text-white font-mono">{totalFuelNeeded.toFixed(1)} L / Gal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cost per Distance Unit</span>
              <span className="text-slate-200 font-mono">${costPerDistance.toFixed(3)}</span>
            </div>
            {passengers > 1 && (
              <div className="flex justify-between border-t border-slate-800/80 pt-2 font-semibold">
                <span className="text-purple-400">Cost per Person ({passengers})</span>
                <span className="text-purple-300 font-mono">${costPerPerson.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
