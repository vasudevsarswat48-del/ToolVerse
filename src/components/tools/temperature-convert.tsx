import { useMemo, useState } from "react";
export default function TemperatureConvert() {
  const [c, setC] = useState("25");
  const n = parseFloat(c);
  const f = useMemo(()=>isNaN(n)?null: n*9/5+32,[n]);
  const k = useMemo(()=>isNaN(n)?null: n+273.15,[n]);
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Celsius</span>
        <input type="number" value={c} onChange={e=>setC(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontSize:24,fontWeight:700}}>{f?.toFixed(2)??"—"}</div><div className="text-xs text-muted">Fahrenheit</div></div>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontSize:24,fontWeight:700}}>{k?.toFixed(2)??"—"}</div><div className="text-xs text-muted">Kelvin</div></div>
      </div>
    </div>
  );
}
