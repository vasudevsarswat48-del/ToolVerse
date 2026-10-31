import { useMemo, useState } from "react";
const TO_ML: Record<string,number> = {ml:1,tsp:4.929,tbsp:14.787,cup:240,floz:29.574};
export default function CookingConvert() {
  const [amount,setAmount]=useState("1"),[from,setFrom]=useState("cup"),[to,setTo]=useState("ml");
  const out=useMemo(()=>{const a=+amount||0;return a*TO_ML[from]/TO_ML[to];},[amount,from,to]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Amount</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={s} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <label className="text-sm"><span className="text-muted">From</span><select value={from} onChange={e=>setFrom(e.target.value)} style={s} className="mt-1">{Object.keys(TO_ML).map(u=><option key={u}>{u}</option>)}</select></label>
      <label className="text-sm"><span className="text-muted">To</span><select value={to} onChange={e=>setTo(e.target.value)} style={s} className="mt-1">{Object.keys(TO_ML).map(u=><option key={u}>{u}</option>)}</select></label>
    </div>
    <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:28,fontWeight:800}}>{out.toFixed(2)} {to}</div>
  </div>);
}
