import { useMemo, useState } from "react";
export default function MarkupCalculator() {
  const [cost,setCost]=useState("100"),[markup,setMarkup]=useState("25");
  const r=useMemo(()=>{const c=+cost||0,m=+markup||0;const profit=c*m/100;return{profit,price:c+profit};},[cost,markup]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Cost</span><input type="number" value={cost} onChange={e=>setCost(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Markup %</span><input type="number" value={markup} onChange={e=>setMarkup(e.target.value)} style={s} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.profit.toFixed(2)}</div><div className="text-xs text-muted">Profit</div></div>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.price.toFixed(2)}</div><div className="text-xs text-muted">Selling price</div></div>
    </div>
  </div>);
}
