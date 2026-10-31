import { useMemo, useState } from "react";
export default function SleepCycle() {
  const [wake,setWake]=useState("07:00");
  const times=useMemo(()=>{
    const [h,m]=wake.split(":").map(Number); const wakeMin=h*60+m;
    // 5 cycles of 90 min + 15 fall asleep
    return [6,5,4,3].map(cycles=>{
      let t=wakeMin-15-cycles*90; while(t<0)t+=24*60;
      return `${String(Math.floor(t/60)%24).padStart(2,"0")}:${String(t%60).padStart(2,"0")} (${cycles} cycles)`;
    });
  },[wake]);
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Wake-up time</span>
      <input type="time" value={wake} onChange={e=>setWake(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} className="mt-1" /></label>
    <p className="text-sm text-muted m-0">Suggested bedtimes (90-minute cycles):</p>
    <ul className="list-none m-0 p-0 space-y-2">
      {times.map(t=><li key={t} style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)",fontWeight:600}}>{t}</li>)}
    </ul>
  </div>);
}
