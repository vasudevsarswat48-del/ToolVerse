import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const rot13 = (s: string) => s.replace(/[a-z]/gi, c => {
  const base = c <= "Z" ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0)-base+13)%26)+base);
});
export default function Rot13() {
  const [text, setText] = useState("Hello");
  const out = useMemo(()=>rot13(text),[text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} className="code-output" />
      <textarea readOnly value={out} rows={5} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy</ActionButton>
    </div>
  );
}
