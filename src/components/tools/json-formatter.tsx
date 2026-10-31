
import React, { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Copy, Check } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const raw = input.trim();
    if (!raw) return { ok: true as const, text: "", error: "" };
    try {
      const parsed = JSON.parse(raw);
      return {
        ok: true as const,
        text: JSON.stringify(parsed, null, indent),
        error: "",
      };
    } catch (e: any) {
      return { ok: false as const, text: "", error: e?.message || "Invalid JSON" };
    }
  }, [input, indent]);

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {}
  };

  const beautify = () => {
    if (result.ok && result.text) setInput(result.text);
  };

  const copy = async () => {
    const text = result.ok ? result.text || input : input;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={beautify} disabled={!result.ok || !input.trim()}>
          Beautify
        </ActionButton>
        <ActionButton variant="secondary" onClick={minify} disabled={!input.trim()}>
          Minify
        </ActionButton>
        <ActionButton variant="secondary" onClick={copy} disabled={!input.trim()}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </ActionButton>
        <label className="flex items-center gap-2 text-sm text-muted ml-auto">
          Indent
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-lg border border-theme bg-surface text-main px-2 py-1.5"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here…  e.g. {"hello":"world"}'
        rows={14}
        spellCheck={false}
        className="w-full rounded-xl border border-theme bg-surface text-main px-4 py-3 font-mono text-sm leading-relaxed"
      />

      {input.trim() && (
        <p
          className={`text-sm m-0 px-3 py-2 rounded-lg border ${
            result.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.ok ? "Valid JSON" : result.error}
        </p>
      )}
    </div>
  );
}
