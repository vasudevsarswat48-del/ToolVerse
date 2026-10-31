import { useMemo, useState } from "react";

export default function WordFrequency() {
  const [text, setText] = useState("");
  const rows = useMemo(() => {
    const map = new Map<string, number>();
    text.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu," ").split(/\s+/).filter(Boolean).forEach(w => map.set(w,(map.get(w)||0)+1));
    return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,100);
  }, [text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" placeholder="Paste text…" />
      <div style={{maxHeight:320,overflow:"auto",border:"1px solid var(--border)",borderRadius:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead><tr style={{background:"var(--surface-2)"}}><th style={{textAlign:"left",padding:10}}>Word</th><th style={{textAlign:"right",padding:10}}>Count</th></tr></thead>
          <tbody>
            {rows.map(([w,c])=>(
              <tr key={w} style={{borderTop:"1px solid var(--border)"}}><td style={{padding:8}}>{w}</td><td style={{padding:8,textAlign:"right"}}>{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
