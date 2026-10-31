import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function DiceRoller() {
  const [n, setN] = useState(2);
  const [vals, setVals] = useState<number[]>([]);
  const roll = () => setVals(Array.from({length:n},()=>1+Math.floor(Math.random()*6)));
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Dice: {n}</span>
        <input type="range" min={1} max={6} value={n} onChange={e=>setN(+e.target.value)} className="w-full mt-2" /></label>
      <ActionButton onClick={roll}>Roll</ActionButton>
      <div className="flex flex-wrap gap-3 justify-center">
        {vals.map((v,i)=>(
          <div key={i} style={{width:56,height:56,borderRadius:12,border:"2px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,background:"var(--surface-2)"}}>{v}</div>
        ))}
      </div>
      {vals.length>0 && <p className="text-center text-muted m-0">Total: {vals.reduce((a,b)=>a+b,0)}</p>}
    </div>
  );
}
