import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function RemoveLineBreaks() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"space"|"none"|"para">("space");
  const out = mode==="space" ? text.replace(/\s*\n\s*/g," ").trim()
    : mode==="none" ? text.replace(/\n/g,"")
    : text.replace(/\n{3,}/g,"\n\n").trim();
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste text with line breaks…" />
      <div className="flex flex-wrap gap-2">
        {([["space","Join with spaces"],["none","Remove all breaks"],["para","Keep paragraphs"]] as const).map(([id,l])=>(
          <button key={id} type="button" className={`btn ${mode===id?"":"secondary"}`} style={{fontSize:13,padding:"8px 12px"}} onClick={()=>setMode(id)}>{l}</button>
        ))}
      </div>
      <textarea readOnly value={out} rows={8} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy result</ActionButton>
    </div>
  );
}
