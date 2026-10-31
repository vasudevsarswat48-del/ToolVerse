import { useMemo, useState } from "react";
export default function DayOfWeek() {
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const name=useMemo(()=>{const d=new Date(date+"T00:00:00");return isNaN(d.getTime())?null:d.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});},[date]);
  return (<div className="space-y-4">
    <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
    <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:22,fontWeight:700}}>{name||"—"}</div>
  </div>);
}
