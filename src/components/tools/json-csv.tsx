import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

function jsonToCsv(text: string): string {
  const data = JSON.parse(text);
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return "";
  const keys = Array.from(
    rows.reduce((s: Set<string>, row: any) => {
      Object.keys(row || {}).forEach((k) => s.add(k));
      return s;
    }, new Set<string>())
  );
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => esc(r?.[k])).join(",")),
  ].join("\n");
}

function csvToJson(text: string): string {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return "[]";
  const parseLine = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (q && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = !q;
      } else if (c === "," && !q) {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cols = parseLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? "";
    });
    return obj;
  });
  return JSON.stringify(rows, null, 2);
}

export default function JsonCsv() {
  const [mode, setMode] = useState<"j2c" | "c2j">("j2c");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const run = () => {
    setError("");
    try {
      setOutput(mode === "j2c" ? jsonToCsv(input) : csvToJson(input));
    } catch (e: any) {
      setError(e?.message || "Conversion failed");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn ${mode === "j2c" ? "" : "secondary"}`}
          onClick={() => setMode("j2c")}
        >
          JSON → CSV
        </button>
        <button
          type="button"
          className={`btn ${mode === "c2j" ? "" : "secondary"}`}
          onClick={() => setMode("c2j")}
        >
          CSV → JSON
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder={
          mode === "j2c"
            ? '[{"name":"Ada","age":36}]'
            : "name,age\nAda,36"
        }
        className="code-output"
        style={{ fontSize: 13 }}
      />
      <ActionButton onClick={run} disabled={!input.trim()}>
        Convert
      </ActionButton>
      {error && (
        <p className="text-sm m-0" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
      {output && (
        <textarea readOnly value={output} rows={10} className="code-output" />
      )}
    </div>
  );
}
