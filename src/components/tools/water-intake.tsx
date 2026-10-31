import { useMemo, useState } from "react";
export default function WaterIntake() {
  const [kg,setKg]=useState("70"),[active,setActive]=useState(false);
  const liters=useMemo(()=>{const w=+kg||0;return (w*0.033)*(active?1.2:1);},[kg,active]);
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Body weight (kg)</span>
      <input type="number" value={kg} onChange={e=>setKg(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> Active lifestyle / exercise</label>
    <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
      <div style={{fontSize:36,fontWeight:800}}>{liters.toFixed(1)} L</div>
      <div className="text-muted">Suggested daily water</div>
    </div>
    <p className="text-xs text-muted m-0">General estimate only — not medical advice.</p>
  </div>);
}
