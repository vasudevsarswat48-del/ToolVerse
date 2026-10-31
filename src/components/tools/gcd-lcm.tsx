import { useMemo, useState } from "react";
const gcd = (a:number,b:number):number => b?gcd(b,a%b):Math.abs(a);
export default function GcdLcm() {
  const [a, setA] = useState("24");
  const [b, setB] = useState("36");
  const r = useMemo(() => {
    const x=parseInt(a,10)||0, y=parseInt(b,10)||0;
    const g = gcd(x,y); return { g, l: g?Math.abs(x*y)/g:0 };
  }, [a,b]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <label className="text-sm"><span className="text-muted">Number A</span><input type="number" value={a} onChange={e=>setA(e.target.value)} style={s} className="mt-1" /></label>
        <label className="text-sm"><span className="text-muted">Number B</span><input type="number" value={b} onChange={e=>setB(e.target.value)} style={s} className="mt-1" /></label>
      </div>
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{r.g}</div><div className="text-xs text-muted">GCD</div></div>
        <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}><div style={{fontSize:28,fontWeight:800}}>{r.l}</div><div className="text-xs text-muted">LCM</div></div>
      </div>
    </div>
  );
}
