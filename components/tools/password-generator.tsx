"use client";

import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      setPassword("");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 glass-panel p-3 rounded-xl">
        <input
          type="text"
          readOnly
          value={password}
          className="w-full bg-transparent border-none text-white font-mono text-lg px-2 focus:outline-none"
        />
        <button
          onClick={generatePassword}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Regenerate"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={copyToClipboard}
          className="py-2 px-4 bg-accent hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="glass-panel p-6 rounded-xl space-y-5">
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Password Length</span>
            <span className="font-bold text-accent">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "upper", label: "Uppercase (A-Z)", state: includeUpper, setter: setIncludeUpper },
            { id: "lower", label: "Lowercase (a-z)", state: includeLower, setter: setIncludeLower },
            { id: "numbers", label: "Numbers (0-9)", state: includeNumbers, setter: setIncludeNumbers },
            { id: "symbols", label: "Symbols (!@#$)", state: includeSymbols, setter: setIncludeSymbols },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm text-gray-300">
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}