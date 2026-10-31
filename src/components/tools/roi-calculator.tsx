import { useMemo, useState } from "react";
export default function RoiCalculator() {
  const [invest,setInvest]=useState("10000"),[gain,setGain]=useState("12500");
  const r=useMemo(()=>{const i=+invest||0,g=+gain||0;const profit=g-i;return{profit,roi:i? (profit/i)*100:0};},[invest,gain]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Amount invested</span><input type="number" value={invest} onChange={e=>setInvest(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Current / returned value</span><input type="number" value={gain} onChange={e=>setGain(e.target.value)} style={s} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.profit.toFixed(2)}</div><div className="text-xs text-muted">Profit / loss</div></div>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.roi.toFixed(2)}%</div><div className="text-xs text-muted">ROI</div></div>
    </div>
  </div>);
}
