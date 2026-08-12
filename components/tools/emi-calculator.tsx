"use client";

import React, { useState } from "react";
import { Calculator, DollarSign, Percent, Calendar, PieChart, RotateCcw } from "lucide-react";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const calculateEmi = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalInterest, totalPayment };
  };

  const { emi, totalInterest, totalPayment } = calculateEmi();

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const resetAll = () => {
    setLoanAmount(500000);
    setInterestRate(8.5);
    setTenureYears(5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Equated Monthly Installment (EMI) Calculator</h2>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Controls */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Loan Amount
              </span>
              <span className="text-blue-400 font-mono">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-purple-400" /> Interest Rate (% p.a.)
              </span>
              <span className="text-purple-400 font-mono">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Loan Tenure
              </span>
              <span className="text-emerald-400 font-mono">{tenureYears} Years ({tenureYears * 12} Months)</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Monthly EMI</h3>
            <div className="text-3xl font-extrabold text-blue-400 font-mono">
              ${Math.round(emi).toLocaleString()}
              <span className="text-xs text-slate-500 font-normal"> / mo</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Principal Amount</span>
              <span className="text-white font-mono">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Interest</span>
              <span className="text-purple-400 font-mono">${Math.round(totalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-slate-800/80 pt-2">
              <span className="text-slate-200">Total Payment</span>
              <span className="text-emerald-400 font-mono">${Math.round(totalPayment).toLocaleString()}</span>
            </div>
          </div>

          {/* Distribution Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-blue-400">Principal ({principalRatio.toFixed(1)}%)</span>
              <span className="text-purple-400">Interest ({interestRatio.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalRatio}%` }} className="bg-blue-500 h-full transition-all" />
              <div style={{ width: `${interestRatio}%` }} className="bg-purple-500 h-full transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
