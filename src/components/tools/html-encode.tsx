import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

const enc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const dec = (s: string) => { const d=document.createElement("textarea"); d.innerHTML=s; return d.value; };

export default function HtmlEncode() {
  const [text, setText] = useState("<div class=\"hello\">Hi</div>");
  const [out, setOut] = useState("");
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="code-output" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={()=>setOut(enc(text))}>Encode</ActionButton>
        <ActionButton variant="secondary" onClick={()=>{ try{ setOut(dec(text)); } catch{ setOut(text);} }}>Decode</ActionButton>
      </div>
      {out && <textarea readOnly value={out} rows={6} className="code-output" />}
    </div>
  );
}
