import { useMemo, useState } from "react";

export default function DaysBetween() {
  const today = new Date().toISOString().slice(0,10);
  const [a, setA] = useState(today);
  const [b, setB] = useState(today);
  const days = useMemo(() => {
    const d1 = new Date(a+"T00:00:00"), d2 = new Date(b+"T00:00:00");
    if (isNaN(d1.getTime())||isNaN(d2.getTime())) return null;
    return Math.round(Math.abs(d2.getTime()-d1.getTime())/86400000);
  }, [a,b]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Start date</span><input type="date" value={a} onChange={e=>setA(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">End date</span><input type="date" value={b} onChange={e=>setB(e.target.value)} style={s} className="mt-1" /></label>
      {days !== null && (
        <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div style={{fontSize:40,fontWeight:800}}>{days}</div>
          <div className="text-muted">day{days===1?"":"s"} between</div>
        </div>
      )}
    </div>
  );
}
