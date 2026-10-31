import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const styles: Record<string,(c:string)=>string> = {
  bold: c => String.fromCodePoint(c.charCodeAt(0)>=97?c.charCodeAt(0)-97+0x1d41a:c.charCodeAt(0)>=65?c.charCodeAt(0)-65+0x1d400:c.charCodeAt(0)),
  italic: c => /[a-z]/.test(c)?String.fromCodePoint(c.charCodeAt(0)-97+0x1d44e):/[A-Z]/.test(c)?String.fromCodePoint(c.charCodeAt(0)-65+0x1d434):c,
};
function map(s: string, fn: (c:string)=>string) { return [...s].map(c => /[a-zA-Z]/.test(c)?fn(c):c).join(""); }
export default function FancyText() {
  const [text, setText] = useState("TulEra Tools");
  const bold = useMemo(()=>map(text, styles.bold),[text]);
  const italic = useMemo(()=>map(text, styles.italic),[text]);
  return (
    <div className="space-y-4">
      <input value={text} onChange={e=>setText(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
      {[["Bold",bold],["Italic",italic]].map(([l,v])=>(
        <div key={l as string} style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div className="text-xs text-muted">{l as string}</div>
          <div style={{fontSize:18,marginTop:4,wordBreak:"break-all"}}>{v as string}</div>
          <button type="button" className="btn secondary" style={{marginTop:8,padding:"6px 10px",fontSize:12}} onClick={()=>navigator.clipboard.writeText(v as string)}>Copy</button>
        </div>
      ))}
    </div>
  );
}
