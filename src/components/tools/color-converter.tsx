import { useMemo, useState } from "react";

function hexToRgb(hex: string) {
  const h = hex.replace("#","");
  if (h.length !== 6) return null;
  const n = parseInt(h,16); if (isNaN(n)) return null;
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b6cf6");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">HEX</span>
        <input value={hex} onChange={e=>setHex(e.target.value)} style={s} className="mt-1" /></label>
      <input type="color" value={hex.length===7?hex:"#000000"} onChange={e=>setHex(e.target.value)} style={{width:"100%",height:48,border:"none",cursor:"pointer"}} />
      {rgb && (
        <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
          <div style={{padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div className="text-xs text-muted">RGB</div>
            <div style={{fontWeight:700}}>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          </div>
          <div style={{padding:14,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
            <div className="text-xs text-muted">Preview</div>
            <div style={{height:28,borderRadius:8,background:hex,marginTop:6,border:"1px solid var(--border)"}} />
          </div>
        </div>
      )}
    </div>
  );
}
