import { useMemo, useState } from "react";
export default function AddDays() {
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=useState(today),[days,setDays]=useState("30");
  const result=useMemo(()=>{const d=new Date(date+"T00:00:00");if(isNaN(d.getTime()))return null;d.setDate(d.getDate()+(parseInt(days,10)||0));return d.toISOString().slice(0,10);},[date,days]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Start date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Days to add (negative to subtract)</span><input type="number" value={days} onChange={e=>setDays(e.target.value)} style={s} className="mt-1" /></label>
    <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:28,fontWeight:800}}>{result||"—"}</div>
  </div>);
}
