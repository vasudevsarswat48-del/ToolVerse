import { useMemo, useState } from "react";
export default function KeywordDensity() {
  const [text, setText] = useState("");
  const [kw, setKw] = useState("");
  const r = useMemo(() => {
    const words = text.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length || !kw.trim()) return null;
    const k = kw.toLowerCase().trim();
    const count = words.filter(w => w.replace(/[^\p{L}\p{N}]/gu,"")===k.replace(/[^\p{L}\p{N}]/gu,"")).length;
    return { count, total: words.length, pct: (count/words.length)*100 };
  }, [text,kw]);
  return (
    <div className="space-y-4">
      <input value={kw} onChange={e=>setKw(e.target.value)} placeholder="Keyword" style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste article text…" />
      {r && (
        <div className="grid gap-3" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
          <div style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.count}</div><div className="text-xs text-muted">Matches</div></div>
          <div style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.total}</div><div className="text-xs text-muted">Words</div></div>
          <div style={{textAlign:"center",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontWeight:800,fontSize:22}}>{r.pct.toFixed(2)}%</div><div className="text-xs text-muted">Density</div></div>
        </div>
      )}
    </div>
  );
}
