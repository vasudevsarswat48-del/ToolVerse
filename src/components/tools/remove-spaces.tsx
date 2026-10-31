import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function RemoveSpaces() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"all"|"extra"|"trim">("extra");
  const out = mode==="all"?text.replace(/\s/g,""):mode==="trim"?text.trim():text.replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n");
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
    <div className="flex flex-wrap gap-2">
      {([["extra","Extra spaces"],["all","All whitespace"],["trim","Trim ends"]] as const).map(([id,l])=>(
        <button key={id} type="button" className={`btn ${mode===id?"":"secondary"}`} style={{fontSize:13,padding:"8px 12px"}} onClick={()=>setMode(id)}>{l}</button>
      ))}
    </div>
    <textarea readOnly value={out} rows={6} className="code-output" />
    <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy</ActionButton>
  </div>);
}
