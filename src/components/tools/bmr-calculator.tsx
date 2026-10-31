import { useMemo, useState } from "react";
export default function BmrCalculator() {
  const [sex, setSex] = useState<"m"|"f">("m");
  const [age, setAge] = useState("30");
  const [h, setH] = useState("170");
  const [w, setW] = useState("70");
  const bmr = useMemo(() => {
    const a=+age||0, cm=+h||0, kg=+w||0;
    return sex==="m" ? 10*kg + 6.25*cm - 5*a + 5 : 10*kg + 6.25*cm - 5*a - 161;
  }, [sex,age,h,w]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" className={`btn ${sex==="m"?"":"secondary"}`} onClick={()=>setSex("m")}>Male</button>
        <button type="button" className={`btn ${sex==="f"?"":"secondary"}`} onClick={()=>setSex("f")}>Female</button>
      </div>
      {[ ["Age",age,setAge], ["Height (cm)",h,setH], ["Weight (kg)",w,setW] ].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}><span className="text-muted">{l as string}</span>
          <input type="number" value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" /></label>
      ))}
      <div style={{textAlign:"center",padding:20,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div style={{fontSize:32,fontWeight:800}}>{Math.round(bmr)}</div>
        <div className="text-muted">kcal / day (Mifflin–St Jeor)</div>
      </div>
    </div>
  );
}
