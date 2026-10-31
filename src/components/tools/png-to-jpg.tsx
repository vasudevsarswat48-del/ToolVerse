import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
export default function PngToJpg() {
  const [out, setOut] = useState(""); const [q, setQ] = useState(0.92);
  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width=img.width; c.height=img.height;
      const ctx = c.getContext("2d")!; ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(img,0,0);
      setOut(c.toDataURL("image/jpeg", q));
    };
    img.src = URL.createObjectURL(f);
  };
  return (<div className="space-y-4">
    <DropZone accept="image/png,image/webp,image/*" onFiles={onFiles} label="Drop PNG / image" hint="Convert to JPG" />
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Quality {Math.round(q*100)}%</span>
      <input type="range" min={0.5} max={1} step={0.02} value={q} onChange={e=>setQ(+e.target.value)} className="w-full mt-2" /></label>
    {out && <><div className="preview-box"><img src={out} alt="" style={{maxHeight:260,margin:"0 auto"}} /></div>
      <a href={out} download="converted.jpg"><ActionButton>Download JPG</ActionButton></a></>}
  </div>);
}
