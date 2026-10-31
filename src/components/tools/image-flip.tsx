import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageFlip() {
  const [src, setSrc] = useState(""); const [out, setOut] = useState("");
  const onFiles = (f: File[]) => { if (f[0]?.type.startsWith("image/")) setSrc(URL.createObjectURL(f[0])); };
  const flip = (dir: "h"|"v") => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width=img.width; c.height=img.height;
      const ctx = c.getContext("2d")!;
      if (dir==="h") { ctx.translate(c.width,0); ctx.scale(-1,1); }
      else { ctx.translate(0,c.height); ctx.scale(1,-1); }
      ctx.drawImage(img,0,0); setOut(c.toDataURL("image/png"));
    };
    img.src = src;
  };
  return (
    <div className="space-y-4">
      <DropZone accept="image/*" onFiles={onFiles} label="Drop image" hint="Flip horizontal or vertical" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={()=>flip("h")} disabled={!src}>Flip horizontal</ActionButton>
        <ActionButton variant="secondary" onClick={()=>flip("v")} disabled={!src}>Flip vertical</ActionButton>
      </div>
      {out && <div className="preview-box"><img src={out} alt="" style={{maxHeight:260,margin:"0 auto"}} /></div>}
      {out && <a href={out} download="flipped.png"><ActionButton>Download</ActionButton></a>}
    </div>
  );
}
