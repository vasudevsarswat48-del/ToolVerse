
import React, { useCallback, useRef, useState } from "react";

type Props = {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

export function DropZone({
  accept,
  multiple = false,
  onFiles,
  label = "Drop files here or click to browse",
  hint,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handle = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const arr = Array.from(list);
      onFiles(multiple ? arr : [arr[0]]);
    },
    [multiple, onFiles]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) handle(e.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
        over
          ? "border-[var(--primary)] bg-[var(--surface-2)]"
          : "border-theme bg-surface hover:border-[var(--primary)] hover:bg-surface-2"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      <p className="text-main font-medium m-0">{label}</p>
      {hint && <p className="text-muted text-sm mt-1 mb-0">{hint}</p>}
    </div>
  );
}
