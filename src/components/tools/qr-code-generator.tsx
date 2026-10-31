
import React, { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Download } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!text.trim()) {
        setDataUrl("");
        return;
      }
      try {
        const QR = (await import("qrcode")).default;
        const url = await QR.toDataURL(text, {
          width: size,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError("Could not generate QR code.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, size]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-5">
      <label className="block text-sm">
        <span className="text-muted">Text or URL</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-theme bg-surface text-main px-4 py-3"
          placeholder="https://example.com"
        />
      </label>

      <label className="block text-sm max-w-xs">
        <span className="text-muted">Size: {size}px</span>
        <input
          type="range"
          min={128}
          max={512}
          step={32}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </label>

      {error && <p className="text-sm text-red-600 m-0">{error}</p>}

      {dataUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt="QR code preview"
            width={size}
            height={size}
            className="rounded-xl border border-theme bg-white p-2 max-w-full"
          />
          <ActionButton onClick={download}>
            <Download size={16} /> Download PNG
          </ActionButton>
        </div>
      )}
    </div>
  );
}
