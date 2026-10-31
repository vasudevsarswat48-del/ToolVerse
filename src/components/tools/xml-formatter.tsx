import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

function formatXml(xml: string) {
  const p = new DOMParser().parseFromString(xml, "application/xml");
  if (p.querySelector("parsererror")) throw new Error("Invalid XML");
  const ser = new XMLSerializer().serializeToString(p);
  let formatted = "", indent = 0;
  ser.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n").forEach(line => {
    if (line.match(/^<\/\w/)) indent = Math.max(indent-1,0);
    formatted += "  ".repeat(indent) + line + "\n";
    if (line.match(/^<\w[^>]*[^\/]>.*$/)) indent++;
  });
  return formatted.trim();
}

export default function XmlFormatter() {
  const [text, setText] = useState("<root><item id=\"1\">Hello</item></root>");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = () => {
    try { setErr(""); setOut(formatXml(text)); }
    catch(e:any){ setErr(e.message); setOut(""); }
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
      <ActionButton onClick={run}>Format XML</ActionButton>
      {err && <p className="text-sm m-0" style={{color:"#dc2626"}}>{err}</p>}
      {out && <textarea readOnly value={out} rows={10} className="code-output" />}
    </div>
  );
}
