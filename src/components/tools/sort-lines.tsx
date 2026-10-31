import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function SortLines() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const sort = (dir: 1 | -1, unique: boolean) => {
    let lines = text.split(/\r?\n/);
    lines = lines.sort((a,b)=>a.localeCompare(b)*dir);
    if (unique) lines = [...new Set(lines)];
    setOut(lines.join("\n"));
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} placeholder="One item per line…" className="code-output" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={()=>sort(1,false)}>A → Z</ActionButton>
        <ActionButton variant="secondary" onClick={()=>sort(-1,false)}>Z → A</ActionButton>
        <ActionButton variant="secondary" onClick={()=>sort(1,true)}>Sort + unique</ActionButton>
      </div>
      {out && <textarea readOnly value={out} rows={10} className="code-output" />}
    </div>
  );
}
