import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageGrayscale() {
  const [out, setOut] = useState("");
  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f?.type.startsWith("image/")) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width=img.width; c.height=img.height;
      const ctx = c.getContext("2d")!; ctx.drawImage(img,0,0);
      const id = ctx.getImageData(0,0,c.width,c.height); const d=id.data;
      for (let i=0;i<d.length;i+=4){ const g=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; d[i]=d[i+1]=d[i+2]=g; }
      ctx.putImageData(id,0,0); setOut(c.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(f);
  };
  return (
    <div className="space-y-4">
      <DropZone accept="image/*" onFiles={onFiles} label="Drop image" hint="Convert to black & white" />
      {out && (<><div className="preview-box"><img src={out} alt="" style={{maxHeight:280,margin:"0 auto"}} /></div>
        <a href={out} download="grayscale.png"><ActionButton>Download</ActionButton></a></>)}
    </div>
  );
}
