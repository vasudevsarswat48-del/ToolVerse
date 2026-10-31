import { useMemo, useState } from "react";

export default function PercentageCalculator() {
  const [x, setX] = useState("25");
  const [y, setY] = useState("200");
  const [mode, setMode] = useState<"of" | "what" | "change">("of");

  const result = useMemo(() => {
    const a = parseFloat(x);
    const b = parseFloat(y);
    if (isNaN(a) || isNaN(b)) return null;
    if (mode === "of") return { label: `${a}% of ${b}`, value: (a / 100) * b };
    if (mode === "what") return { label: `${a} is what % of ${b}`, value: b === 0 ? 0 : (a / b) * 100 };
    return { label: `% change from ${a} to ${b}`, value: a === 0 ? 0 : ((b - a) / a) * 100 };
  }, [x, y, mode]);

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    width: "100%",
  } as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["of", "What is X% of Y?"],
            ["what", "X is what % of Y?"],
            ["change", "% increase / decrease"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn ${mode === id ? "" : "secondary"}`}
            style={{ fontSize: 13, padding: "8px 12px" }}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <label className="text-sm">
          <span className="text-muted">{mode === "of" ? "Percent (X)" : "Value X"}</span>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} style={inputStyle} className="mt-1" />
        </label>
        <label className="text-sm">
          <span className="text-muted">{mode === "change" ? "New value (Y)" : "Value Y"}</span>
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} style={inputStyle} className="mt-1" />
        </label>
      </div>
      {result && (
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            textAlign: "center",
          }}
        >
          <p className="text-sm text-muted m-0">{result.label}</p>
          <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0" }}>
            {mode === "of"
              ? result.value.toLocaleString(undefined, { maximumFractionDigits: 6 })
              : `${result.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
          </p>
        </div>
      )}
    </div>
  );
}
