import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);

  const onFiles = (files: File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    if (!base64) return;
    await navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="image/*"
        onFiles={onFiles}
        label="Drop an image or click to browse"
        hint="JPG, PNG, WebP, GIF — converts to a data URL"
      />

      {preview && (
        <div className="preview-box">
          <img src={preview} alt={name || "Preview"} />
          <p className="text-xs text-muted m-0">{name}</p>
        </div>
      )}

      {base64 && (
        <>
          <div className="flex flex-wrap gap-2 items-center">
            <ActionButton onClick={copy}>{copied ? "Copied!" : "Copy Base64"}</ActionButton>
            <span className="text-xs text-muted">
              {Math.round(base64.length / 1024)} KB string
            </span>
          </div>
          <textarea
            readOnly
            value={base64}
            rows={8}
            className="code-output"
            onFocus={(e) => e.target.select()}
          />
        </>
      )}
    </div>
  );
}
