import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"");
export default function SlugifyBulk() {
  const [text, setText] = useState("How to Merge PDF Files Free\nBest SIP Calculator India");
  const out = useMemo(() => text.split(/\r?\n/).map(slugify).join("\n"), [text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" placeholder="One title per line" />
      <textarea readOnly value={out} rows={8} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy slugs</ActionButton>
    </div>
  );
}
