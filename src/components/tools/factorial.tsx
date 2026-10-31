import { useMemo, useState } from "react";
export default function Factorial() {
  const [n, setN] = useState("10");
  const res = useMemo(() => {
    const x = parseInt(n,10);
    if (isNaN(x)||x<0||x>170) return null;
    let r = 1; for (let i=2;i<=x;i++) r*=i; return r;
  }, [n]);
  return (
    <div className="space-y-4">
      <input type="number" min={0} max={170} value={n} onChange={e=>setN(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
      <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontFamily:"monospace",wordBreak:"break-all",fontSize:16}}>
        {res===null ? "Enter 0–170" : res.toLocaleString()}
      </div>
    </div>
  );
}
