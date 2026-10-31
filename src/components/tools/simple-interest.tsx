import { useMemo, useState } from "react";
export default function SimpleInterest() {
  const [p,setP]=useState("10000"),[r,setR]=useState("8"),[t,setT]=useState("2");
  const res=useMemo(()=>{const P=+p||0,R=+r||0,T=+t||0;const i=P*R*T/100;return{i,a:P+i};},[p,r,t]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    {[["Principal",p,setP],["Rate %",r,setR],["Time (years)",t,setT]].map(([l,v,set])=>(
      <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
        <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
    ))}
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontWeight:800,fontSize:22}}>{res.i.toFixed(2)}</div><div className="text-xs text-muted">Interest</div></div>
      <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",textAlign:"center"}}><div style={{fontWeight:800,fontSize:22}}>{res.a.toFixed(2)}</div><div className="text-xs text-muted">Amount</div></div>
    </div>
  </div>);
}
