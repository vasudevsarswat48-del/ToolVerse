import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function CountdownTimer() {
  const [mins, setMins] = useState(5);
  const [left, setLeft] = useState(0);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run || left<=0) { if (left<=0) setRun(false); return; }
    const id = setTimeout(()=>setLeft(l=>l-1),1000); return ()=>clearTimeout(id);
  }, [run, left]);
  const start = () => { setLeft(mins*60); setRun(true); };
  const mm = String(Math.floor(left/60)).padStart(2,"0");
  const ss = String(left%60).padStart(2,"0");
  return (<div className="space-y-4" style={{textAlign:"center"}}>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Minutes: {mins}</span>
      <input type="range" min={1} max={60} value={mins} onChange={e=>setMins(+e.target.value)} className="w-full mt-2" disabled={run} /></label>
    <div style={{fontSize:56,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{run||left?`${mm}:${ss}`:`${String(mins).padStart(2,"0")}:00`}</div>
    <div className="flex flex-wrap gap-2 justify-center">
      <ActionButton onClick={start} disabled={run}>Start</ActionButton>
      <ActionButton variant="secondary" onClick={()=>setRun(false)}>Pause</ActionButton>
      <ActionButton variant="secondary" onClick={()=>{setRun(false);setLeft(0);}}>Reset</ActionButton>
    </div>
  </div>);
}
