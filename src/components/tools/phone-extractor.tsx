import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function PhoneExtractor() {
  const [text,setText]=useState("");
  const phones=useMemo(()=>[...new Set(text.match(/(\+?\d[\d\s\-().]{8,}\d)/g)||[]).map(p=>p.trim())],[text]);
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste text with phone numbers…" />
    <p className="text-sm text-muted m-0">{phones.length} number(s)</p>
    <textarea readOnly value={phones.join("\n")} rows={6} className="code-output" />
    <ActionButton onClick={()=>navigator.clipboard.writeText(phones.join("\n"))} disabled={!phones.length}>Copy</ActionButton>
  </div>);
}
