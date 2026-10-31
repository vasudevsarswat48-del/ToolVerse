import { useMemo, useState } from "react";
export default function NpsCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [years, setYears] = useState("25");
  const [rate, setRate] = useState("10");
  const r = useMemo(() => {
    const p = +monthly||0, n = (+years||0)*12, i = (+rate||0)/100/12;
    const corpus = i ? p*((Math.pow(1+i,n)-1)/i)*(1+i) : p*n;
    return { corpus, invested: p*n };
  }, [monthly, years, rate]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[["Monthly contribution",monthly,setMonthly],["Years to retire",years,setYears],["Expected return %",rate,setRate]].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div style={{fontWeight:800,fontSize:20}}>{r.invested.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
          <div className="text-xs text-muted">Invested</div>
        </div>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div style={{fontWeight:800,fontSize:20}}>{r.corpus.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
          <div className="text-xs text-muted">Est. corpus</div>
        </div>
      </div>
    </div>
  );
}
