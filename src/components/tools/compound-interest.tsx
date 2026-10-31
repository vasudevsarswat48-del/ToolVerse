import { useMemo, useState } from "react";

export default function CompoundInterest() {
  const [p, setP] = useState("100000");
  const [r, setR] = useState("8");
  const [t, setT] = useState("5");
  const [n, setN] = useState("4");
  const res = useMemo(() => {
    const P=parseFloat(p)||0, rate=(parseFloat(r)||0)/100, years=parseFloat(t)||0, freq=parseFloat(n)||1;
    const amount = P * Math.pow(1 + rate/freq, freq*years);
    return { amount, interest: amount - P };
  }, [p,r,t,n]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[
        ["Principal", p, setP],
        ["Annual rate %", r, setR],
        ["Years", t, setT],
        ["Compounds / year", n, setN],
      ].map(([label, val, set]) => (
        <label key={label as string} className="text-sm" style={{display:"block"}}>
          <span className="text-muted">{label as string}</span>
          <input type="number" value={val as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" />
        </label>
      ))}
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:700}}>{res.interest.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
          <div className="text-xs text-muted">Interest</div>
        </div>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:700}}>{res.amount.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
          <div className="text-xs text-muted">Final amount</div>
        </div>
      </div>
    </div>
  );
}
