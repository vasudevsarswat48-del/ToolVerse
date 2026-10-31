
import React, { useCallback, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Copy, Check, RefreshCw } from "lucide-react";

function generate(
  length: number,
  opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }
) {
  let chars = "";
  if (opts.lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (opts.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.numbers) chars += "0123456789";
  if (opts.symbols) chars += "!@#$%^&*()-_=+[]{};:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState(() =>
    generate(16, { upper: true, lower: true, numbers: true, symbols: true })
  );
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setPwd(generate(length, { upper, lower, numbers, symbols }));
  }, [length, upper, lower, numbers, symbols]);

  const copy = async () => {
    await navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-theme bg-surface-2 px-4 py-4 font-mono text-lg sm:text-xl break-all text-main text-center tracking-wide">
        {pwd}
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={regen}>
          <RefreshCw size={16} /> Generate
        </ActionButton>
        <ActionButton variant="secondary" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </ActionButton>
      </div>

      <label className="block text-sm">
        <span className="text-muted">Length: {length}</span>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLength(v);
            setPwd(generate(v, { upper, lower, numbers, symbols }));
          }}
          className="mt-2 w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ["Uppercase (A–Z)", upper, setUpper],
          ["Lowercase (a–z)", lower, setLower],
          ["Numbers (0–9)", numbers, setNumbers],
          ["Symbols (!@#…)", symbols, setSymbols],
        ].map(([label, val, set]) => (
          <label key={label as string} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={val as boolean}
              onChange={(e) => {
                (set as (v: boolean) => void)(e.target.checked);
              }}
            />
            <span className="text-main">{label as string}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
