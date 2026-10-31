import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function PasswordPin() {
  const [len, setLen] = useState(6);
  const [pin, setPin] = useState("");
  const gen = () => {
    const b = new Uint32Array(len); crypto.getRandomValues(b);
    setPin([...b].map(x => (x%10).toString()).join(""));
  };
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Digits: {len}</span>
        <input type="range" min={4} max={12} value={len} onChange={e=>setLen(+e.target.value)} className="w-full mt-2" /></label>
      <div style={{textAlign:"center",fontSize:32,fontWeight:800,letterSpacing:6,padding:20,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>{pin||"————"}</div>
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={gen}>Generate PIN</ActionButton>
        <ActionButton variant="secondary" onClick={()=>pin&&navigator.clipboard.writeText(pin)} disabled={!pin}>Copy</ActionButton>
      </div>
    </div>
  );
}
