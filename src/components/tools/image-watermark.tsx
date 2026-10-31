import { useEffect, useRef, useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageWatermark() {
  const [src, setSrc] = useState("");
  const [text, setText] = useState("© TulEra");
  const [opacity, setOpacity] = useState(0.35);
  const [size, setSize] = useState(32);
  const [pos, setPos] = useState<"center" | "br" | "bl" | "tr" | "tl">("br");
  const [out, setOut] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onFiles = (files: File[]) => {
    const f = files[0];
    if (!f?.type.startsWith("image/")) return;
    setSrc(URL.createObjectURL(f));
    setOut("");
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img || !src) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.font = `bold ${size}px system-ui, sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.5})`;
    ctx.lineWidth = 2;
    const metrics = ctx.measureText(text);
    const pad = 16;
    let x = canvas.width / 2 - metrics.width / 2;
    let y = canvas.height / 2;
    if (pos === "br") {
      x = canvas.width - metrics.width - pad;
      y = canvas.height - pad;
    } else if (pos === "bl") {
      x = pad;
      y = canvas.height - pad;
    } else if (pos === "tr") {
      x = canvas.width - metrics.width - pad;
      y = size + pad;
    } else if (pos === "tl") {
      x = pad;
      y = size + pad;
    }
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    setOut(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    if (src && imgRef.current?.complete) {
      /* wait for onLoad */
    }
  }, [src]);

  const download = () => {
    if (!out) return;
    const a = document.createElement("a");
    a.href = out;
    a.download = "watermarked.png";
    a.click();
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="image/*"
        onFiles={onFiles}
        label="Drop an image or click to browse"
        hint="Add a text watermark, then download PNG"
      />
      {src && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          ref={imgRef}
          src={src}
          alt="Source"
          onLoad={apply}
          style={{ display: "none" }}
        />
      )}
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Watermark text</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mt-1"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Size: {size}px</span>
        <input type="range" min={12} max={120} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full mt-2" />
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Opacity: {Math.round(opacity * 100)}%</span>
        <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full mt-2" />
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Position</span>
        <select
          value={pos}
          onChange={(e) => setPos(e.target.value as any)}
          className="w-full mt-1"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
        >
          <option value="br">Bottom right</option>
          <option value="bl">Bottom left</option>
          <option value="tr">Top right</option>
          <option value="tl">Top left</option>
          <option value="center">Center</option>
        </select>
      </label>
      <ActionButton onClick={apply} disabled={!src}>
        Apply watermark
      </ActionButton>
      {out && (
        <>
          <div className="preview-box">
            <img src={out} alt="Watermarked preview" style={{ maxHeight: 280, margin: "0 auto" }} />
          </div>
          <ActionButton onClick={download}>Download PNG</ActionButton>
        </>
      )}
    </div>
  );
}
