import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function PlaceholderImage() {
  const [w, setW] = useState(640);
  const [h, setH] = useState(360);
  const [bg, setBg] = useState("#3b6cf6");
  const [fg, setFg] = useState("#ffffff");
  const url = useMemo(() => {
    const c = document.createElement("canvas"); c.width=w; c.height=h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = fg; ctx.font = `bold ${Math.max(16,Math.min(w,h)/10)}px system-ui`;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(`${w}×${h}`, w/2, h/2);
    return c.toDataURL("image/png");
  }, [w,h,bg,fg]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <label className="text-sm"><span className="text-muted">Width</span><input type="number" value={w} onChange={e=>setW(+e.target.value||1)} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--border)"}} /></label>
        <label className="text-sm"><span className="text-muted">Height</span><input type="number" value={h} onChange={e=>setH(+e.target.value||1)} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--border)"}} /></label>
      </div>
      <div className="grid gap-3" style={{gridTemplateColumns:"1fr 1fr"}}>
        <label className="text-sm"><span className="text-muted">Background</span><input type="color" value={bg} onChange={e=>setBg(e.target.value)} style={{width:"100%",height:40}} /></label>
        <label className="text-sm"><span className="text-muted">Text</span><input type="color" value={fg} onChange={e=>setFg(e.target.value)} style={{width:"100%",height:40}} /></label>
      </div>
      <div className="preview-box"><img src={url} alt="" style={{maxWidth:"100%",margin:"0 auto"}} /></div>
      <a href={url} download={`placeholder-${w}x${h}.png`}><ActionButton>Download PNG</ActionButton></a>
    </div>
  );
}
