import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
function toTs(name: string, val: unknown, depth=0): string {
  const ind = "  ".repeat(depth);
  if (val===null) return "null";
  if (Array.isArray(val)) return val.length? toTs(name, val[0], depth)+"[]" : "unknown[]";
  if (typeof val === "object") {
    const lines = Object.entries(val as object).map(([k,v]) => `${ind}  ${k}: ${toTs(k,v,depth+1)};`);
    return `{\n${lines.join("\n")}\n${ind}}`;
  }
  return typeof val;
}
export default function JsonToTs() {
  const [text, setText] = useState('{"id":1,"name":"Ada","tags":["dev"]}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = () => {
    try { setErr(""); const data=JSON.parse(text); setOut(`interface Root ${toTs("Root", data)}`); }
    catch(e:any){ setErr(e.message); setOut(""); }
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
      <ActionButton onClick={run}>Convert to TypeScript</ActionButton>
      {err && <p className="text-sm m-0" style={{color:"#dc2626"}}>{err}</p>}
      {out && <textarea readOnly value={out} rows={10} className="code-output" />}
    </div>
  );
}
