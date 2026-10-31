import { useMemo, useState } from "react";
export default function BreakEven() {
  const [fixed, setFixed] = useState("50000");
  const [price, setPrice] = useState("500");
  const [variable, setVariable] = useState("200");
  const units = useMemo(() => {
    const f=+fixed||0, p=+price||0, v=+variable||0;
    const contrib = p - v;
    return contrib > 0 ? f / contrib : null;
  }, [fixed, price, variable]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      {[["Fixed costs",fixed,setFixed],["Price per unit",price,setPrice],["Variable cost / unit",variable,setVariable]].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div style={{fontSize:32,fontWeight:800}}>{units==null?"—":Math.ceil(units)}</div>
        <div className="text-muted">Units to break even</div>
      </div>
    </div>
  );
}
