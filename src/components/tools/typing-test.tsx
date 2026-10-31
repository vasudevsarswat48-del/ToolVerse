import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const SAMPLE = "The quick brown fox jumps over the lazy dog near the river bank while clouds drift across the bright blue sky.";
export default function TypingTest() {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [t0, setT0] = useState(0);
  const [done, setDone] = useState<{wpm:number;acc:number}|null>(null);
  useEffect(() => {
    if (!started || input.length < SAMPLE.length) return;
    const sec = (Date.now()-t0)/1000;
    const words = SAMPLE.split(" ").length;
    const wpm = Math.round((words/sec)*60);
    let ok = 0; for (let i=0;i<SAMPLE.length;i++) if (input[i]===SAMPLE[i]) ok++;
    setDone({ wpm, acc: Math.round((ok/SAMPLE.length)*100) });
    setStarted(false);
  }, [input, started, t0]);
  return (
    <div className="space-y-4">
      <p style={{padding:12,borderRadius:10,background:"var(--surface-2)",border:"1px solid var(--border)",lineHeight:1.6}}>{SAMPLE}</p>
      <textarea value={input} disabled={!!done} onChange={e=>{ if(!started){ setStarted(true); setT0(Date.now()); } setInput(e.target.value); }} rows={4} className="code-output" placeholder="Start typing here…" />
      {done && <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{done.wpm}</div><div className="text-xs text-muted">WPM</div></div>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{done.acc}%</div><div className="text-xs text-muted">Accuracy</div></div>
      </div>}
      <ActionButton onClick={()=>{ setInput(""); setDone(null); setStarted(false); }}>Reset</ActionButton>
    </div>
  );
}
