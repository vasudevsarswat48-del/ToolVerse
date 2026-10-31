import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageRotateTool() {
  const [src, setSrc] = useState("");
  const [angle, setAngle] = useState(90);
  const [out, setOut] = useState("");

  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f?.type.startsWith("image/")) return;
    setSrc(URL.createObjectURL(f)); setOut("");
  };

  const run = () => {
    const img = new Image();
    img.onload = () => {
      const rad = (angle * Math.PI) / 180;
      const w = img.width, h = img.height;
      const cw = Math.abs(Math.cos(rad)*w) + Math.abs(Math.sin(rad)*h);
      const ch = Math.abs(Math.sin(rad)*w) + Math.abs(Math.cos(rad)*h);
      const c = document.createElement("canvas");
      c.width = cw; c.height = ch;
      const ctx = c.getContext("2d")!;
      ctx.translate(cw/2, ch/2);
      ctx.rotate(rad);
      ctx.drawImage(img, -w/2, -h/2);
      setOut(c.toDataURL("image/png"));
    };
    img.src = src;
  };

  return (
    <div className="space-y-5">
      <DropZone accept="image/*" onFiles={onFiles} label="Drop image" hint="Rotate 90 / 180 / 270°" />
      <div className="flex flex-wrap gap-2">
        {[90,180,270].map(a => (
          <button key={a} type="button" className={`btn ${angle===a?"":"secondary"}`} onClick={()=>setAngle(a)}>{a}°</button>
        ))}
      </div>
      <ActionButton onClick={run} disabled={!src}>Rotate</ActionButton>
      {out && (
        <>
          <div className="preview-box"><img src={out} alt="" style={{maxHeight:280,margin:"0 auto"}} /></div>
          <a href={out} download="rotated.png"><ActionButton variant="secondary">Download</ActionButton></a>
        </>
      )}
    </div>
  );
}
