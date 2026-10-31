import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function CoinFlip() {
  const [side, setSide] = useState<"Heads"|"Tails"|null>(null);
  return (
    <div className="space-y-4" style={{textAlign:"center"}}>
      <div style={{fontSize:48,fontWeight:800,padding:32,borderRadius:16,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        {side || "?"}
      </div>
      <ActionButton onClick={()=>setSide(Math.random()<0.5?"Heads":"Tails")}>Flip coin</ActionButton>
    </div>
  );
}
