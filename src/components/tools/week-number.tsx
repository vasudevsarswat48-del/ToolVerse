import { useMemo, useState } from "react";
function weekNum(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day = t.getUTCDay()||7; t.setUTCDate(t.getUTCDate()+4-day);
  const y = new Date(Date.UTC(t.getUTCFullYear(),0,1));
  return Math.ceil((((t.getTime()-y.getTime())/86400000)+1)/7);
}
export default function WeekNumber() {
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const w=useMemo(()=>{const d=new Date(date+"T00:00:00");return isNaN(d.getTime())?null:weekNum(d);},[date]);
  return (<div className="space-y-4">
    <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
    <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
      <div style={{fontSize:40,fontWeight:800}}>{w??"—"}</div><div className="text-muted">ISO week number</div>
    </div>
  </div>);
}
