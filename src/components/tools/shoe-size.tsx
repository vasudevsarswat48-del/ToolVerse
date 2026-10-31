import { useMemo, useState } from "react";
export default function ShoeSize() {
  const [us,setUs]=useState("9");
  const n=parseFloat(us);
  const eu=useMemo(()=>isNaN(n)?null:Math.round((n+1.5)*1.27+33),[n]);
  const uk=useMemo(()=>isNaN(n)?null:n-0.5,[n]);
  const cm=useMemo(()=>isNaN(n)?null:(n*0.847+18.5),[n]);
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">US men size</span>
      <input type="number" step="0.5" value={us} onChange={e=>setUs(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      {[["UK",uk],["EU",eu],["cm (approx)",cm]].map(([l,v])=>(
        <div key={l as string} style={{textAlign:"center",padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:20}}>{v==null?"—":(v as number).toFixed(1)}</div><div className="text-xs text-muted">{l as string}</div></div>
      ))}
    </div>
    <p className="text-xs text-muted m-0">Approximate conversion — brands vary.</p>
  </div>);
}
