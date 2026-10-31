import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
export default function SvgToPng() {
  const [out, setOut] = useState(""); const [w, setW] = useState(512);
  const onFiles = async (files: File[]) => {
    const f = files[0]; if (!f) return;
    const text = await f.text();
    const blob = new Blob([text], {type:"image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = w / (img.width||w);
      const c = document.createElement("canvas");
      c.width = w; c.height = Math.max(1, Math.round((img.height||w)*scale));
      c.getContext("2d")!.drawImage(img,0,0,c.width,c.height);
      setOut(c.toDataURL("image/png")); URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  return (<div className="space-y-4">
    <DropZone accept="image/svg+xml,.svg" onFiles={onFiles} label="Drop SVG" hint="Rasterize to PNG" />
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Width: {w}px</span>
      <input type="range" min={64} max={2048} step={64} value={w} onChange={e=>setW(+e.target.value)} className="w-full mt-2" /></label>
    {out && <><div className="preview-box"><img src={out} alt="" style={{maxHeight:260,margin:"0 auto"}} /></div>
      <a href={out} download="svg.png"><ActionButton>Download PNG</ActionButton></a></>}
  </div>);
}
