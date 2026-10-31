"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function PasswordChecker() {
  const [pass, setPass] = useState("");

  const length = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasNum = /[0-9]/.test(pass);
  const hasSym = /[^A-Za-z0-9]/.test(pass);

  const score = [length, hasUpper, hasNum, hasSym].filter(Boolean).length;
  const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" /> Password Strength Checker
        </h2>
        <p className="text-xs text-slate-400">Evaluate password entropy and security metrics.</p>
      </div>

      <div className="space-y-4">
        <input type="password" placeholder="Enter password to test..." value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none" />

        {pass && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Strength Rating:</span>
              <span className="font-bold">{labels[score]}</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full transition-all ${score <= 2 ? "bg-red-500" : score === 3 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(score / 4) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
