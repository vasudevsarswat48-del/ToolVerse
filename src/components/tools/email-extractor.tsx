import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function EmailExtractor() {
  const [text, setText] = useState("");
  const emails = useMemo(() => {
    const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return [...new Set(m)];
  }, [text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="code-output" placeholder="Paste any text containing emails…" />
      <p className="text-sm text-muted m-0">{emails.length} unique email{emails.length===1?"":"s"} found</p>
      <textarea readOnly value={emails.join("\n")} rows={6} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(emails.join("\n"))} disabled={!emails.length}>Copy list</ActionButton>
    </div>
  );
}
