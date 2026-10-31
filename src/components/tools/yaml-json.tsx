import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

/** Minimal YAML-ish ↔ JSON for flat key: value and simple lists */
function yamlToJson(yaml: string) {
  const obj: Record<string, unknown> = {};
  yaml.split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^:#]+):\s*(.*)$/);
    if (m) {
      let v: unknown = m[2].trim();
      if (v === "true") v = true; else if (v === "false") v = false;
      else if (v !== "" && !isNaN(Number(v))) v = Number(v);
      else if (typeof v === "string" && v.startsWith('"') && v.endsWith('"')) v = v.slice(1,-1);
      obj[m[1].trim()] = v;
    }
  });
  return JSON.stringify(obj, null, 2);
}
function jsonToYaml(json: string) {
  const obj = JSON.parse(json);
  return Object.entries(obj).map(([k,v]) => `${k}: ${typeof v==="string"?v:JSON.stringify(v)}`).join("\n");
}

export default function YamlJson() {
  const [text, setText] = useState("name: TulEra\nversion: 1\nactive: true");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (dir: "y2j"|"j2y") => {
    setErr("");
    try { setOut(dir==="y2j" ? yamlToJson(text) : jsonToYaml(text)); }
    catch(e:any){ setErr(e.message||"Failed"); setOut(""); }
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={()=>run("y2j")}>YAML → JSON</ActionButton>
        <ActionButton variant="secondary" onClick={()=>run("j2y")}>JSON → YAML</ActionButton>
      </div>
      {err && <p className="text-sm m-0" style={{color:"#dc2626"}}>{err}</p>}
      {out && <textarea readOnly value={out} rows={8} className="code-output" />}
    </div>
  );
}
