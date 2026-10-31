import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
function shift(s: string, n: number) {
  return s.replace(/[a-z]/gi, c => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0)-base+n+26)%26)+base);
  });
}
export default function CaesarCipher() {
  const [text, setText] = useState("Hello World");
  const [n, setN] = useState(3);
  const enc = useMemo(()=>shift(text,n),[text,n]);
  const dec = useMemo(()=>shift(text,-n),[text,n]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={4} className="code-output" />
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Shift: {n}</span>
        <input type="range" min={1} max={25} value={n} onChange={e=>setN(+e.target.value)} className="w-full mt-2" /></label>
      <div style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div className="text-xs text-muted">Encrypted</div><div style={{wordBreak:"break-all"}}>{enc}</div></div>
      <div style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div className="text-xs text-muted">Decrypted (from input)</div><div style={{wordBreak:"break-all"}}>{dec}</div></div>
      <ActionButton onClick={()=>navigator.clipboard.writeText(enc)}>Copy encrypted</ActionButton>
    </div>
  );
}
