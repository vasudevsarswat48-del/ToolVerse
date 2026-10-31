import { useMemo, useState } from "react";

export default function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add"|"extract">("add");
  const r = useMemo(() => {
    const a = parseFloat(amount)||0, g = parseFloat(rate)||0;
    if (mode==="add") {
      const gst = a * (g/100);
      return { base: a, gst, total: a+gst };
    }
    const base = a / (1 + g/100);
    return { base, gst: a - base, total: a };
  }, [amount, rate, mode]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`btn ${mode==="add"?"":"secondary"}`} onClick={()=>setMode("add")}>Add GST</button>
        <button type="button" className={`btn ${mode==="extract"?"":"secondary"}`} onClick={()=>setMode("extract")}>Extract GST</button>
      </div>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Amount</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">GST rate %</span>
        <select value={rate} onChange={e=>setRate(e.target.value)} style={s} className="mt-1">
          {["0","5","12","18","28"].map(v=><option key={v} value={v}>{v}%</option>)}
        </select>
      </label>
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["Base",r.base],["GST",r.gst],["Total",r.total]].map(([l,v])=>(
          <div key={l as string} style={{textAlign:"center",padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div style={{fontSize:20,fontWeight:700}}>{(v as number).toFixed(2)}</div>
            <div className="text-xs text-muted">{l as string}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
