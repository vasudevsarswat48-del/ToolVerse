import { useMemo, useState } from "react";
export default function VatCalculator() {
  const [amount,setAmount]=useState("100"),[rate,setRate]=useState("20"),[mode,setMode]=useState<"add"|"remove">("add");
  const r=useMemo(()=>{const a=+amount||0,v=+rate||0;if(mode==="add"){const vat=a*v/100;return{net:a,vat,gross:a+vat};}const net=a/(1+v/100);return{net,vat:a-net,gross:a};},[amount,rate,mode]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <div className="flex gap-2">
      <button type="button" className={`btn ${mode==="add"?"":"secondary"}`} onClick={()=>setMode("add")}>Add VAT</button>
      <button type="button" className={`btn ${mode==="remove"?"":"secondary"}`} onClick={()=>setMode("remove")}>Remove VAT</button>
    </div>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Amount</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">VAT %</span><input type="number" value={rate} onChange={e=>setRate(e.target.value)} style={s} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      {[["Net",r.net],["VAT",r.vat],["Gross",r.gross]].map(([l,v])=>(
        <div key={l as string} style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800}}>{(v as number).toFixed(2)}</div><div className="text-xs text-muted">{l as string}</div></div>
      ))}
    </div>
  </div>);
}
