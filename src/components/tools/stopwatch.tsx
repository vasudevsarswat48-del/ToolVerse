import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function Stopwatch() {
  const [ms, setMs] = useState(0); const [run, setRun] = useState(false);
  const ref = useRef<number|null>(null);
  useEffect(() => {
    if (!run) return;
    const t0 = performance.now() - ms;
    const id = window.setInterval(()=>setMs(performance.now()-t0), 50);
    ref.current = id; return () => clearInterval(id);
  }, [run]);
  const fmt = (n:number) => {
    const m = Math.floor(n/60000), s = Math.floor((n%60000)/1000), c = Math.floor((n%1000)/10);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(c).padStart(2,"0")}`;
  };
  return (<div className="space-y-4" style={{textAlign:"center"}}>
    <div style={{fontSize:48,fontWeight:800,fontVariantNumeric:"tabular-nums",padding:24}}>{fmt(ms)}</div>
    <div className="flex flex-wrap gap-2 justify-center">
      <ActionButton onClick={()=>setRun(r=>!r)}>{run?"Pause":"Start"}</ActionButton>
      <ActionButton variant="secondary" onClick={()=>{setRun(false);setMs(0);}}>Reset</ActionButton>
    </div>
  </div>);
}
