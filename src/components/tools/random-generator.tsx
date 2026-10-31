"use client";

import React, { useState } from "react";
import { Dices, Copy } from "lucide-react";

export default function RandomGenerator() {
  const [num, setNum] = useState<number | null>(null);

  const generate = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    setNum((array[0] % 1000000) + 1);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Dices className="w-5 h-5 text-blue-400" /> Cryptographic Random Generator
        </h2>
        <p className="text-xs text-slate-400">Generate secure random numbers and tokens using Web Crypto APIs.</p>
      </div>

      <div className="space-y-4 text-center">
        {num !== null && <div className="text-3xl font-mono font-bold text-blue-400 py-4">{num}</div>}
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg">
          Generate Number
        </button>
      </div>
    </div>
  );
}
