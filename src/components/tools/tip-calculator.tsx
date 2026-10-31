import { useMemo, useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState("1000");
  const [tip, setTip] = useState(10);
  const [people, setPeople] = useState(1);
  const r = useMemo(() => {
    const b = parseFloat(bill)||0;
    const t = b * (tip/100);
    const total = b + t;
    const n = Math.max(1, people);
    return { t, total, each: total/n };
  }, [bill, tip, people]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Bill amount</span><input type="number" value={bill} onChange={e=>setBill(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Tip: {tip}%</span><input type="range" min={0} max={30} value={tip} onChange={e=>setTip(Number(e.target.value))} className="w-full mt-2" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">People</span><input type="number" min={1} value={people} onChange={e=>setPeople(Number(e.target.value)||1)} style={s} className="mt-1" /></label>
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["Tip",r.t],["Total",r.total],["Each",r.each]].map(([l,v])=>(
          <div key={l as string} style={{textAlign:"center",padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div style={{fontSize:22,fontWeight:700}}>{(v as number).toFixed(2)}</div>
            <div className="text-xs text-muted">{l as string}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
