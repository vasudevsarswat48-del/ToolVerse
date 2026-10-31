import { useMemo, useState } from "react";
export default function FdCalculator() {
  const [p, setP] = useState("100000");
  const [r, setR] = useState("7");
  const [t, setT] = useState("3");
  const res = useMemo(() => {
    const P=parseFloat(p)||0, rate=parseFloat(r)||0, years=parseFloat(t)||0;
    const maturity = P * Math.pow(1+rate/100, years);
    return { maturity, interest: maturity - P };
  }, [p,r,t]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[ ["Principal",p,setP], ["Rate % p.a.",r,setR], ["Years",t,setT] ].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontWeight:700,fontSize:20}}>{res.interest.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
          <div className="text-xs text-muted">Interest</div>
        </div>
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}>
          <div style={{fontWeight:700,fontSize:20}}>{res.maturity.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
          <div className="text-xs text-muted">Maturity</div>
        </div>
      </div>
    </div>
  );
}
