import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every day at 9:00", expr: "0 9 * * *" },
  { label: "Every Monday 9:00", expr: "0 9 * * 1" },
  { label: "Weekdays 9:00", expr: "0 9 * * 1-5" },
  { label: "1st of month", expr: "0 0 1 * *" },
];

export default function CronGenerator() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [copied, setCopied] = useState(false);

  const expr = useMemo(
    () => `${minute || "*"} ${hour || "*"} ${dom || "*"} ${month || "*"} ${dow || "*"}`,
    [minute, hour, dom, month, dow]
  );

  const field = (label: string, value: string, set: (v: string) => void, hint: string) => (
    <label className="text-sm" style={{ display: "block" }}>
      <span className="text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full mt-1"
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          fontFamily: "ui-monospace, monospace",
        }}
      />
      <span className="text-xs text-muted">{hint}</span>
    </label>
  );

  const copy = async () => {
    await navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            type="button"
            className="btn secondary"
            style={{ fontSize: 12, padding: "6px 10px" }}
            onClick={() => {
              const [mi, h, d, mo, dw] = p.expr.split(" ");
              setMinute(mi);
              setHour(h);
              setDom(d);
              setMonth(mo);
              setDow(dw);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        {field("Minute", minute, setMinute, "0-59 or *")}
        {field("Hour", hour, setHour, "0-23 or *")}
        {field("Day of month", dom, setDom, "1-31 or *")}
        {field("Month", month, setMonth, "1-12 or *")}
        {field("Day of week", dow, setDow, "0-6 (Sun=0) or *")}
      </div>
      <div
        style={{
          textAlign: "center",
          padding: 20,
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          fontFamily: "ui-monospace, monospace",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {expr}
      </div>
      <ActionButton onClick={copy}>{copied ? "Copied!" : "Copy expression"}</ActionButton>
      <p className="text-xs text-muted m-0">
        Standard 5-field cron: minute hour day-of-month month day-of-week. Pairs with the Cron Parser tool for plain-English readout.
      </p>
    </div>
  );
}
