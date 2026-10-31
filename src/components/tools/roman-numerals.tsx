import { useMemo, useState } from "react";

function toRoman(num: number) {
  if (num < 1 || num > 3999) return "";
  const map: [number,string][] = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let n = num, out = "";
  for (const [v,s] of map) { while (n >= v) { out += s; n -= v; } }
  return out;
}

export default function RomanNumerals() {
  const [n, setN] = useState("2026");
  const roman = useMemo(() => toRoman(parseInt(n,10)||0), [n]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Number (1–3999)</span>
        <input type="number" min={1} max={3999} value={n} onChange={e=>setN(e.target.value)} style={s} className="mt-1" /></label>
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:32,fontWeight:800,letterSpacing:2}}>
        {roman || "—"}
      </div>
    </div>
  );
}
