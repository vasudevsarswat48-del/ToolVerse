import { useMemo, useState } from "react";
export default function SpeedConvert() {
  const [kmh, setKmh] = useState("60");
  const n = parseFloat(kmh);
  const mph = useMemo(()=>isNaN(n)?null:n*0.621371,[n]);
  const ms = useMemo(()=>isNaN(n)?null:n/3.6,[n]);
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">km/h</span>
        <input type="number" value={kmh} onChange={e=>setKmh(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontSize:24,fontWeight:700}}>{mph?.toFixed(2)??"—"}</div><div className="text-xs text-muted">mph</div></div>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontSize:24,fontWeight:700}}>{ms?.toFixed(2)??"—"}</div><div className="text-xs text-muted">m/s</div></div>
      </div>
    </div>
  );
}
