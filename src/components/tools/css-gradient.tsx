import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function CssGradient() {
  const [c1, setC1] = useState("#3b6cf6");
  const [c2, setC2] = useState("#e11d48");
  const [angle, setAngle] = useState(135);
  const css = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  return (
    <div className="space-y-4">
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <label className="text-sm"><span className="text-muted">Color 1</span><input type="color" value={c1} onChange={e=>setC1(e.target.value)} style={{width:"100%",height:40}} /></label>
        <label className="text-sm"><span className="text-muted">Color 2</span><input type="color" value={c2} onChange={e=>setC2(e.target.value)} style={{width:"100%",height:40}} /></label>
      </div>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Angle: {angle}°</span>
        <input type="range" min={0} max={360} value={angle} onChange={e=>setAngle(Number(e.target.value))} className="w-full mt-2" /></label>
      <div style={{height:120,borderRadius:12,background:css,border:"1px solid var(--border)"}} />
      <pre className="code-output" style={{whiteSpace:"pre-wrap"}}>background: {css};</pre>
      <ActionButton onClick={()=>navigator.clipboard.writeText(`background: ${css};`)}>Copy CSS</ActionButton>
    </div>
  );
}
