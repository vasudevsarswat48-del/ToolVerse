import { useMemo, useState } from "react";
export default function ReadingTime() {
  const [text,setText]=useState(""),[wpm,setWpm]=useState(200);
  const r=useMemo(()=>{const words=text.trim()?text.trim().split(/\s+/).length:0;const mins=words/Math.max(1,wpm);return{words,mins};},[text,wpm]);
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste article…" />
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Reading speed: {wpm} WPM</span>
      <input type="range" min={100} max={400} value={wpm} onChange={e=>setWpm(+e.target.value)} className="w-full mt-2" /></label>
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{r.words}</div><div className="text-xs text-muted">Words</div></div>
      <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{r.mins<1?`${Math.ceil(r.mins*60)} sec`:`${r.mins.toFixed(1)} min`}</div><div className="text-xs text-muted">Read time</div></div>
    </div>
  </div>);
}
