import { useMemo, useState } from "react";
export default function PpfCalculator() {
  const [yearly, setYearly] = useState("150000");
  const [years, setYears] = useState("15");
  const [rate, setRate] = useState("7.1");
  const r = useMemo(() => {
    const p = +yearly||0, n = +years||0, i = (+rate||0)/100;
    // Year-end deposits approximation
    let bal = 0;
    for (let y=0;y<n;y++) { bal = (bal + p) * (1+i); }
    return { maturity: bal, invested: p*n, interest: bal - p*n };
  }, [yearly, years, rate]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[["Yearly deposit",yearly,setYearly],["Years (max 15)",years,setYears],["Rate %",rate,setRate]].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["Invested",r.invested],["Interest",r.interest],["Maturity",r.maturity]].map(([l,v])=>(
          <div key={l as string} style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div style={{fontWeight:800,fontSize:15}}>{(v as number).toLocaleString(undefined,{maximumFractionDigits:0})}</div>
            <div className="text-xs text-muted">{l as string}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted m-0">Approximate PPF projection — official rates change quarterly.</p>
    </div>
  );
}
