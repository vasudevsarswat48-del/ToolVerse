import { useMemo, useState } from "react";
export default function SipCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const r = useMemo(() => {
    const p = parseFloat(monthly)||0, i = (parseFloat(rate)||0)/100/12, n = (parseFloat(years)||0)*12;
    if (i===0) return { invested: p*n, corpus: p*n, gains: 0 };
    const corpus = p * ((Math.pow(1+i,n)-1)/i) * (1+i);
    return { invested: p*n, corpus, gains: corpus - p*n };
  }, [monthly, rate, years]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[ ["Monthly investment",monthly,setMonthly], ["Expected return % p.a.",rate,setRate], ["Years",years,setYears] ].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["Invested",r.invested],["Gains",r.gains],["Corpus",r.corpus]].map(([l,v])=>(
          <div key={l as string} style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div style={{fontSize:16,fontWeight:700}}>{(v as number).toLocaleString(undefined,{maximumFractionDigits:0})}</div>
            <div className="text-xs text-muted">{l as string}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
