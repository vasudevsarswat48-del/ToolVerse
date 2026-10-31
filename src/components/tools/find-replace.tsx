import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [regex, setRegex] = useState(false);
  const [out, setOut] = useState("");

  const run = () => {
    try {
      if (regex) setOut(text.replace(new RegExp(find, "g"), replace));
      else setOut(text.split(find).join(replace));
    } catch (e: any) { setOut("Error: " + (e.message||"invalid pattern")); }
  };

  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} placeholder="Your text…" className="code-output" />
      <input value={find} onChange={e=>setFind(e.target.value)} placeholder="Find" style={s} />
      <input value={replace} onChange={e=>setReplace(e.target.value)} placeholder="Replace with" style={s} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={regex} onChange={e=>setRegex(e.target.checked)} /> Use regex</label>
      <ActionButton onClick={run} disabled={!find}>Replace all</ActionButton>
      {out !== "" && <textarea readOnly value={out} rows={8} className="code-output" />}
    </div>
  );
}
