import { useMemo, useState } from "react";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("999");
  const [off, setOff] = useState("20");
  const r = useMemo(() => {
    const p = parseFloat(price)||0, d = parseFloat(off)||0;
    const save = p * (d/100);
    return { save, final: p - save };
  }, [price, off]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Original price</span><input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Discount %</span><input type="number" value={off} onChange={e=>setOff(e.target.value)} style={s} className="mt-1" /></label>
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:700}}>{r.save.toFixed(2)}</div>
          <div className="text-xs text-muted">You save</div>
        </div>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:700}}>{r.final.toFixed(2)}</div>
          <div className="text-xs text-muted">Final price</div>
        </div>
      </div>
    </div>
  );
}
