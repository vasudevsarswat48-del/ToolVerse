import { useMemo, useState } from "react";
export default function IdealWeight() {
  const [sex, setSex] = useState<"m"|"f">("m");
  const [cm, setCm] = useState("170");
  const w = useMemo(() => {
    const h = parseFloat(cm)||0;
    // Devine formula
    const inches = h/2.54;
    if (inches < 60) return null;
    const base = sex==="m" ? 50 : 45.5;
    return base + 2.3 * (inches - 60);
  }, [sex, cm]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" className={`btn ${sex==="m"?"":"secondary"}`} onClick={()=>setSex("m")}>Male</button>
        <button type="button" className={`btn ${sex==="f"?"":"secondary"}`} onClick={()=>setSex("f")}>Female</button>
      </div>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Height (cm)</span>
        <input type="number" value={cm} onChange={e=>setCm(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div style={{fontSize:32,fontWeight:800}}>{w?`${w.toFixed(1)} kg`:"—"}</div>
        <div className="text-muted text-sm">Devine formula estimate</div>
      </div>
    </div>
  );
}
