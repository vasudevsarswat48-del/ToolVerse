import { useMemo, useState } from "react";

function yearsMonthsDays(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    d += prev.getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("2000-01-01");
  const [onDate, setOnDate] = useState(today);

  const result = useMemo(() => {
    const a = new Date(dob + "T00:00:00");
    const b = new Date(onDate + "T00:00:00");
    if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return null;
    const { y, m, d } = yearsMonthsDays(a, b);
    const totalDays = Math.floor((b.getTime() - a.getTime()) / 86400000);
    return { y, m, d, totalDays };
  }, [dob, onDate]);

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
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Date of birth</span>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} className="mt-1" />
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Age on date</span>
        <input type="date" value={onDate} onChange={(e) => setOnDate(e.target.value)} style={inputStyle} className="mt-1" />
      </label>
      {result ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
          {[
            ["Years", result.y],
            ["Months", result.m],
            ["Days", result.d],
            ["Total days", result.totalDays],
          ].map(([label, val]) => (
            <div
              key={label as string}
              style={{
                textAlign: "center",
                padding: 16,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700 }}>{val as number}</div>
              <div className="text-xs text-muted">{label as string}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Enter a valid birth date on or before the target date.</p>
      )}
    </div>
  );
}
