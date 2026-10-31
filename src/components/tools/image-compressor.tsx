
import React, { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { formatBytes } from "@/lib/pdf-utils";
import { Download } from "lucide-react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [maxW, setMaxW] = useState(1920);
  const [outUrl, setOutUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [busy, setBusy] = useState(false);

  const onFiles = (files: File[]) => {
    const f = files[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOutUrl("");
  };

  const run = async () => {
    if (!file || !preview) return;
    setBusy(true);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = preview;
      });
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      const type = file.type.includes("png") ? "image/png" : "image/jpeg";
      const blob: Blob = await new Promise((r) =>
        canvas.toBlob((b) => r(b!), type, quality)
      );
      setOutSize(blob.size);
      setOutUrl(URL.createObjectURL(blob));
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!outUrl || !file) return;
    const a = document.createElement("a");
    a.href = outUrl;
    a.download = file.name.replace(/\.\w+$/, "") + "-compressed.jpg";
    a.click();
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="image/jpeg,image/png,image/webp"
        onFiles={onFiles}
        label="Drop an image or click to browse"
        hint="Adjust quality and max width, then compress"
      />
      {file && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted mb-1">Original · {formatBytes(file.size)}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Original" className="rounded-xl border border-theme max-h-56 object-contain w-full bg-surface-2" />
            </div>
            {outUrl && (
              <div>
                <p className="text-xs text-muted mb-1">
                  Compressed · {formatBytes(outSize)}
                  {file.size > 0 &&
                    ` (${Math.round((1 - outSize / file.size) * 100)}% smaller)`}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outUrl} alt="Compressed" className="rounded-xl border border-theme max-h-56 object-contain w-full bg-surface-2" />
              </div>
            )}
          </div>
          <label className="block text-sm">
            <span className="text-muted">Quality: {Math.round(quality * 100)}%</span>
            <input type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full" />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Max width: {maxW}px</span>
            <input type="range" min={400} max={4000} step={100} value={maxW} onChange={(e) => setMaxW(Number(e.target.value))} className="mt-2 w-full" />
          </label>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={run} loading={busy}>Compress</ActionButton>
            {outUrl && (
              <ActionButton variant="secondary" onClick={download}>
                <Download size={16} /> Download
              </ActionButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}
