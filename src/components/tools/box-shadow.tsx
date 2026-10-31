import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function BoxShadow() {
  const [x, setX] = useState(6);
  const [y, setY] = useState(12);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#1e32664d");
  const css = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  return (
    <div className="space-y-4">
      {([["X",x,setX,-40,40],["Y",y,setY,-40,40],["Blur",blur,setBlur,0,80],["Spread",spread,setSpread,-20,40]] as const).map(([l,v,set,min,max])=>(
        <label key={l} className="text-sm" style={{display:"block"}}>
          <span className="text-muted">{l}: {v}px</span>
          <input type="range" min={min} max={max} value={v} onChange={e=>set(Number(e.target.value))} className="w-full mt-2" />
        </label>
      ))}
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Color</span>
        <input value={color} onChange={e=>setColor(e.target.value)} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--border)"}} className="mt-1" /></label>
      <div style={{height:100,borderRadius:12,background:"var(--surface)",boxShadow:css,border:"1px solid var(--border)",margin:"12px 24px"}} />
      <pre className="code-output">box-shadow: {css};</pre>
      <ActionButton onClick={()=>navigator.clipboard.writeText(`box-shadow: ${css};`)}>Copy CSS</ActionButton>
    </div>
  );
}
