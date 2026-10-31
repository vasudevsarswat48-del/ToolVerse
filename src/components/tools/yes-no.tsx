import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function YesNo() {
  const [a, setA] = useState<string|null>(null);
  return (
    <div className="space-y-4" style={{textAlign:"center"}}>
      <div style={{fontSize:40,fontWeight:800,padding:40,borderRadius:16,border:"1px solid var(--border)",background:"var(--surface-2)"}}>{a||"Ask, then tap"}</div>
      <ActionButton onClick={()=>setA(Math.random()<0.5?"Yes":"No")}>Decide</ActionButton>
    </div>
  );
}
