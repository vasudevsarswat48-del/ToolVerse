import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
export default function JpgToPng() {
  const [out, setOut] = useState("");
  const onFiles = (files: File[]) => {
    const f = files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width=img.width; c.height=img.height;
      c.getContext("2d")!.drawImage(img,0,0); setOut(c.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(f);
  };
  return (<div className="space-y-4">
    <DropZone accept="image/jpeg,image/jpg,image/*" onFiles={onFiles} label="Drop JPG" hint="Convert to PNG" />
    {out && <><div className="preview-box"><img src={out} alt="" style={{maxHeight:260,margin:"0 auto"}} /></div>
      <a href={out} download="converted.png"><ActionButton>Download PNG</ActionButton></a></>}
  </div>);
}
