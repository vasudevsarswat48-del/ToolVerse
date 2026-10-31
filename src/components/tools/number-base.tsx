import { useMemo, useState } from "react";

export default function NumberBase() {
  const [dec, setDec] = useState("255");
  const n = parseInt(dec, 10);
  const ok = !isNaN(n) && n >= 0;
  const bin = ok ? n.toString(2) : "—";
  const oct = ok ? n.toString(8) : "—";
  const hex = ok ? n.toString(16).toUpperCase() : "—";
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Decimal</span>
        <input value={dec} onChange={e=>setDec(e.target.value)} style={s} className="mt-1" /></label>
      {[["Binary",bin],["Octal",oct],["Hexadecimal",hex]].map(([l,v])=>(
        <div key={l as string} style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
          <div className="text-xs text-muted">{l as string}</div>
          <div style={{fontFamily:"ui-monospace,monospace",fontWeight:600,marginTop:4,wordBreak:"break-all"}}>{v as string}</div>
        </div>
      ))}
    </div>
  );
}
