import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function Base64ToImage() {
  const [text, setText] = useState("");
  const src = text.trim().startsWith("data:") ? text.trim() : text.trim() ? `data:image/png;base64,${text.trim()}` : "";
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} placeholder="Paste Base64 or data URL…" className="code-output" />
      {src && (
        <>
          <div className="preview-box"><img src={src} alt="Decoded" style={{maxHeight:280,margin:"0 auto"}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none"}} /></div>
          <a href={src} download="image.png"><ActionButton>Download image</ActionButton></a>
        </>
      )}
    </div>
  );
}
