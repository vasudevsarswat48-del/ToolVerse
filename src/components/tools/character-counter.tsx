import { useMemo, useState } from "react";
export default function CharacterCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => ({
    chars: text.length,
    noSpace: text.replace(/\s/g,"").length,
    words: text.trim()?text.trim().split(/\s+/).length:0,
    lines: text?text.split(/\n/).length:0,
  }), [text]);
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={12} className="code-output" placeholder="Type or paste text…" />
    <div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))"}}>
      {[["Characters",s.chars],["Without spaces",s.noSpace],["Words",s.words],["Lines",s.lines]].map(([l,v])=>(
        <div key={l as string} style={{textAlign:"center",padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div style={{fontSize:24,fontWeight:800}}>{v as number}</div><div className="text-xs text-muted">{l as string}</div>
        </div>
      ))}
    </div>
  </div>);
}
