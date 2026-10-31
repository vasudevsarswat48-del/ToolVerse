import { useMemo, useState } from "react";
export default function CgpaConverter() {
  const [cgpa, setCgpa] = useState("8.5");
  const [scale, setScale] = useState("10");
  const pct = useMemo(() => {
    const c=parseFloat(cgpa)||0, s=parseFloat(scale)||10;
    // Common India approx: percentage ≈ CGPA * 9.5 on 10-point
    return s===10 ? c*9.5 : (c/s)*100;
  }, [cgpa, scale]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">CGPA</span><input type="number" step="0.01" value={cgpa} onChange={e=>setCgpa(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Scale</span>
        <select value={scale} onChange={e=>setScale(e.target.value)} style={s} className="mt-1"><option value="10">10-point</option><option value="4">4-point</option></select>
      </label>
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div style={{fontSize:36,fontWeight:800}}>{pct.toFixed(2)}%</div>
        <div className="text-muted text-sm">Approximate percentage</div>
      </div>
      <p className="text-xs text-muted m-0">Formula varies by university. 10-point uses CGPA × 9.5 (common in India).</p>
    </div>
  );
}
