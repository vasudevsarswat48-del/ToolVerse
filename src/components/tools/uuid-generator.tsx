import { useCallback, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

function makeUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState(() => Array.from({ length: 5 }, makeUuid));
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setList(Array.from({ length: count }, makeUuid));
  }, [count]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-5">
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">How many: {count}</span>
        <input
          type="range"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full mt-2"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={regen}>Generate</ActionButton>
        <ActionButton variant="secondary" onClick={() => copy(list.join("\n"))}>
          {copied ? "Copied!" : "Copy all"}
        </ActionButton>
      </div>
      <ul className="list-none m-0 p-0 space-y-2">
        {list.map((id) => (
          <li
            key={id}
            className="flex items-center gap-2"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 12px",
              background: "var(--surface-2)",
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              wordBreak: "break-all",
            }}
          >
            <span style={{ flex: 1 }}>{id}</span>
            <button
              type="button"
              className="btn secondary"
              style={{ padding: "6px 10px", fontSize: 12 }}
              onClick={() => copy(id)}
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
