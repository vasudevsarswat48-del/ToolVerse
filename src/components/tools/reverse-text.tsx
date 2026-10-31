import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function ReverseText() {
  const [text, setText] = useState("");
  const out = useMemo(()=>[...text].reverse().join(""),[text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="code-output" placeholder="Type text to reverse…" />
      <textarea readOnly value={out} rows={6} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy</ActionButton>
    </div>
  );
}
