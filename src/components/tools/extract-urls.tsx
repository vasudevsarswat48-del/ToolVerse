import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function ExtractUrls() {
  const [text, setText] = useState("");
  const urls = useMemo(()=>[...new Set(text.match(/https?:\/\/[^\s<>"')\]]+/gi)||[])],[text]);
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste text with links…" />
    <p className="text-sm text-muted m-0">{urls.length} URL(s)</p>
    <textarea readOnly value={urls.join("\n")} rows={6} className="code-output" />
    <ActionButton onClick={()=>navigator.clipboard.writeText(urls.join("\n"))} disabled={!urls.length}>Copy URLs</ActionButton>
  </div>);
}
