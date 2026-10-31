import { useMemo, useState } from "react";

const ZONES = [
  "UTC","America/New_York","America/Los_Angeles","Europe/London","Europe/Paris",
  "Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo","Australia/Sydney",
];

export default function TimezoneConverter() {
  const [from, setFrom] = useState("Asia/Kolkata");
  const [to, setTo] = useState("America/New_York");
  const [local, setLocal] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  });

  const result = useMemo(() => {
    try {
      const [hh, mm] = local.split(":").map(Number);
      const now = new Date();
      // Interpret time as "today" in from zone roughly via formatter
      const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm));
      const fmt = (tz: string) =>
        new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", weekday: "short", day: "numeric", month: "short", hour12: false }).format(date);
      return { from: fmt(from), to: fmt(to) };
    } catch { return null; }
  }, [from, to, local]);

  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Time (24h)</span><input type="time" value={local} onChange={e=>setLocal(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">From zone</span>
        <select value={from} onChange={e=>setFrom(e.target.value)} style={s} className="mt-1">{ZONES.map(z=><option key={z}>{z}</option>)}</select>
      </label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">To zone</span>
        <select value={to} onChange={e=>setTo(e.target.value)} style={s} className="mt-1">{ZONES.map(z=><option key={z}>{z}</option>)}</select>
      </label>
      {result && (
        <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
          <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div className="text-xs text-muted">{from}</div>
            <div style={{fontWeight:700,marginTop:4}}>{result.from}</div>
          </div>
          <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div className="text-xs text-muted">{to}</div>
            <div style={{fontWeight:700,marginTop:4}}>{result.to}</div>
          </div>
        </div>
      )}
    </div>
  );
}
