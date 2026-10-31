import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageToWebp() {
  const [out, setOut] = useState("");
  const [q, setQ] = useState(0.8);
  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f?.type.startsWith("image/")) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      c.getContext("2d")!.drawImage(img,0,0);
      setOut(c.toDataURL("image/webp", q));
    };
    img.src = URL.createObjectURL(f);
  };
  return (
    <div className="space-y-4">
      <DropZone accept="image/*" onFiles={onFiles} label="Drop image" hint="Convert to WebP" />
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Quality {Math.round(q*100)}%</span>
        <input type="range" min={0.4} max={1} step={0.05} value={q} onChange={e=>setQ(+e.target.value)} className="w-full mt-2" /></label>
      {out && (<><div className="preview-box"><img src={out} alt="" style={{maxHeight:240,margin:"0 auto"}} /></div>
        <a href={out} download="image.webp"><ActionButton>Download WebP</ActionButton></a></>)}
    </div>
  );
}
