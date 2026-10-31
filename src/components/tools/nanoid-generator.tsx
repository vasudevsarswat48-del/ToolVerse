import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
function nanoid(size=21) {
  const b = new Uint8Array(size); crypto.getRandomValues(b);
  return [...b].map(x => alphabet[x % alphabet.length]).join("");
}
export default function NanoidGenerator() {
  const [size, setSize] = useState(21);
  const [list, setList] = useState(()=>Array.from({length:5},()=>nanoid(21)));
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Length: {size}</span>
        <input type="range" min={8} max={36} value={size} onChange={e=>setSize(+e.target.value)} className="w-full mt-2" /></label>
      <ActionButton onClick={()=>setList(Array.from({length:5},()=>nanoid(size)))}>Generate</ActionButton>
      <ul className="list-none m-0 p-0 space-y-2">
        {list.map(id=>(
          <li key={id} style={{padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)",fontFamily:"monospace",fontSize:13,wordBreak:"break-all"}}>{id}</li>
        ))}
      </ul>
    </div>
  );
}
