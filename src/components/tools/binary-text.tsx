import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function BinaryText() {
  const [text, setText] = useState("Hi");
  const [out, setOut] = useState("");
  const toBin = () => setOut([...text].map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" "));
  const toText = () => {
    try { setOut(text.trim().split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join("")); }
    catch { setOut("Invalid binary"); }
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} className="code-output" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={toBin}>Text → Binary</ActionButton>
        <ActionButton variant="secondary" onClick={toText}>Binary → Text</ActionButton>
      </div>
      {out && <textarea readOnly value={out} rows={5} className="code-output" />}
    </div>
  );
}
