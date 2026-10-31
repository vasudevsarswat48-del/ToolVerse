import { useMemo, useState } from "react";
export default function SalaryHourly() {
  const [salary,setSalary]=useState("600000"),[hours,setHours]=useState("40"),[weeks,setWeeks]=useState("52");
  const r=useMemo(()=>{const s=+salary||0,h=+hours||40,w=+weeks||52;const hourly=s/(h*w);return{hourly,monthly:s/12,weekly:s/w};},[salary,hours,weeks]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Annual salary</span><input type="number" value={salary} onChange={e=>setSalary(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Hours / week</span><input type="number" value={hours} onChange={e=>setHours(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Weeks / year</span><input type="number" value={weeks} onChange={e=>setWeeks(e.target.value)} style={s} className="mt-1" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      {[["Hourly",r.hourly],["Weekly",r.weekly],["Monthly",r.monthly]].map(([l,v])=>(
        <div key={l as string} style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:16}}>{(v as number).toLocaleString(undefined,{maximumFractionDigits:2})}</div><div className="text-xs text-muted">{l as string}</div></div>
      ))}
    </div>
  </div>);
}
