import { useMemo, useState } from "react";
function lum(hex: string) {
  const h=hex.replace("#",""); if(h.length!==6) return 0;
  const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4));
  return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
}
function ratio(a:string,b:string){const L1=lum(a),L2=lum(b);const [x,y]=L1>L2?[L1,L2]:[L2,L1];return(x+0.05)/(y+0.05);}
export default function ColorContrast() {
  const [fg,setFg]=useState("#111111"),[bg,setBg]=useState("#ffffff");
  const r=useMemo(()=>ratio(fg,bg),[fg,bg]);
  const passAA=r>=4.5, passAAA=r>=7;
  return (<div className="space-y-4">
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
      <label className="text-sm"><span className="text-muted">Text</span><input type="color" value={fg} onChange={e=>setFg(e.target.value)} style={{width:"100%",height:44}} /></label>
      <label className="text-sm"><span className="text-muted">Background</span><input type="color" value={bg} onChange={e=>setBg(e.target.value)} style={{width:"100%",height:44}} /></label>
    </div>
    <div style={{padding:24,borderRadius:12,background:bg,color:fg,border:"1px solid var(--border)",textAlign:"center",fontSize:20,fontWeight:700}}>Sample text preview</div>
    <div style={{textAlign:"center",padding:16,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
      <div style={{fontSize:28,fontWeight:800}}>{r.toFixed(2)} : 1</div>
      <div className="text-sm" style={{marginTop:8}}>AA normal: {passAA?"Pass":"Fail"} · AAA: {passAAA?"Pass":"Fail"}</div>
    </div>
  </div>);
}
