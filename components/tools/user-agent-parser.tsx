"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, Cpu, Globe, Copy, Check, RefreshCw, Terminal } from "lucide-react";

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  engine: { name: string };
  device: string;
  is64Bit: boolean;
}

function parseUserAgent(ua: string): ParsedUA {
  if (!ua) {
    return {
      browser: { name: "Unknown", version: "" },
      os: { name: "Unknown", version: "" },
      engine: { name: "Unknown" },
      device: "Unknown",
      is64Bit: false,
    };
  }

  // OS Detection
  let osName = "Unknown OS";
  let osVersion = "";

  if (/windows nt 10\.0/i.test(ua)) {
    osName = "Windows";
    osVersion = "10 / 11";
  } else if (/windows nt 6\.3/i.test(ua)) {
    osName = "Windows";
    osVersion = "8.1";
  } else if (/windows nt 6\.1/i.test(ua)) {
    osName = "Windows";
    osVersion = "7";
  } else if (/mac os x/i.test(ua)) {
    osName = "macOS";
    const match = ua.match(/mac os x (\d+[._]\d+([._]\d+)?)/i);
    if (match) osVersion = match[1].replace(/_/g, ".");
  } else if (/android/i.test(ua)) {
    osName = "Android";
    const match = ua.match(/android\s([0-9\.]+)/i);
    if (match) osVersion = match[1];
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    osName = "iOS";
    const match = ua.match(/os (\d+[._]\d+)/i);
    if (match) osVersion = match[1].replace(/_/g, ".");
  } else if (/cros/i.test(ua)) {
    osName = "Chrome OS";
  } else if (/linux/i.test(ua)) {
    osName = "Linux";
  }

  // Browser Detection
  let browserName = "Unknown Browser";
  let browserVersion = "";

  if (/edg\//i.test(ua)) {
    browserName = "Microsoft Edge";
    browserVersion = ua.match(/edg\/([0-9\.]+)/i)?.[1] || "";
  } else if (/opr\/|opera/i.test(ua)) {
    browserName = "Opera";
    browserVersion = ua.match(/(?:opr|opera)\/([0-9\.]+)/i)?.[1] || "";
  } else if (/chrome|crios/i.test(ua) && !/edg\//i.test(ua)) {
    browserName = "Google Chrome";
    browserVersion = ua.match(/(?:chrome|crios)\/([0-9\.]+)/i)?.[1] || "";
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = "Mozilla Firefox";
    browserVersion = ua.match(/(?:firefox|fxios)\/([0-9\.]+)/i)?.[1] || "";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browserName = "Safari";
    browserVersion = ua.match(/version\/([0-9\.]+)/i)?.[1] || "";
  }

  // Engine Detection
  let engineName = "Unknown Engine";
  if (/applewebkit/i.test(ua)) engineName = "WebKit";
  if (/chrome/i.test(ua) && /applewebkit/i.test(ua)) engineName = "Blink";
  if (/gecko/i.test(ua) && !/webkit/i.test(ua)) engineName = "Gecko";
  if (/trident/i.test(ua)) engineName = "Trident";

  // Device Type
  let device = "Desktop";
  if (/tablet|ipad/i.test(ua)) device = "Tablet";
  else if (/mobile|iphone|android/i.test(ua)) device = "Mobile";

  // Architecture
  const is64Bit = /x86_64|x64|wow64|win64|x86-64|aarch64/i.test(ua);

  return {
    browser: { name: browserName, version: browserVersion },
    os: { name: osName, version: osVersion },
    engine: { name: engineName },
    device,
    is64Bit,
  };
}

export default function UserAgentParser() {
  const [uaInput, setUaInput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUaInput(navigator.userAgent);
    }
  }, []);

  const parsed = parseUserAgent(uaInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(uaInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      setUaInput(navigator.userAgent);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            User-Agent String
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Detect My Browser
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <textarea
          value={uaInput}
          onChange={(e) => setUaInput(e.target.value)}
          placeholder="Paste User-Agent string here..."
          rows={3}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Parsed Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
          <Globe className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Browser</div>
            <div className="text-lg font-bold text-white">{parsed.browser.name}</div>
            <div className="text-sm text-slate-400 font-mono">
              {parsed.browser.version ? `Version ${parsed.browser.version}` : "Version undetected"}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
          <Monitor className="w-6 h-6 text-purple-400 mt-1 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operating System</div>
            <div className="text-lg font-bold text-white">{parsed.os.name}</div>
            <div className="text-sm text-slate-400 font-mono">
              {parsed.os.version ? `Version ${parsed.os.version}` : "Version undetected"}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
          <Smartphone className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Device Type</div>
            <div className="text-lg font-bold text-white">{parsed.device}</div>
            <div className="text-sm text-slate-400 font-mono">Form Factor</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
          <Cpu className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Engine & Arch</div>
            <div className="text-lg font-bold text-white">{parsed.engine.name}</div>
            <div className="text-sm text-slate-400 font-mono">
              {parsed.is64Bit ? "64-bit Architecture" : "32-bit Architecture / Undetected"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
