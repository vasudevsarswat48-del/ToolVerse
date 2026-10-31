import { useMemo, useState } from "react";
/** Illustrative new-regime style slabs (India) for education — not official advice */
function taxNew(income: number) {
  const slabs = [[300000,0],[700000,0.05],[1000000,0.10],[1200000,0.15],[1500000,0.20],[Infinity,0.30]];
  let prev = 0, tax = 0;
  for (const [up, rate] of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, up as number) - prev;
    tax += taxable * (rate as number);
    prev = up as number;
  }
  return Math.max(0, tax);
}
export default function IncomeTaxSlab() {
  const [income, setIncome] = useState("1200000");
  const r = useMemo(() => {
    const i = +income||0;
    const tax = taxNew(i);
    return { tax, cess: tax*0.04, total: tax*1.04, net: i - tax*1.04 };
  }, [income]);
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Annual taxable income (₹)</span>
        <input type="number" value={income} onChange={e=>setIncome(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))"}}>
        {[["Tax",r.tax],["Cess 4%",r.cess],["Total tax",r.total],["In-hand",r.net]].map(([l,v])=>(
          <div key={l as string} style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div style={{fontWeight:800,fontSize:15}}>₹{(v as number).toLocaleString(undefined,{maximumFractionDigits:0})}</div>
            <div className="text-xs text-muted">{l as string}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted m-0">Simplified illustrative slabs only — not tax advice. Confirm with current IT rules or a CA.</p>
    </div>
  );
}
