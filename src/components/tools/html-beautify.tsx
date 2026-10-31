import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
function beautifyHtml(html: string) {
  let f="",i=0; html.replace(/>\s*</g,"><").split(/(?=<)/).forEach(line=>{
    if(line.match(/^<\/\w/)) i=Math.max(0,i-1);
    f+="  ".repeat(i)+line+"\n";
    if(line.match(/^<\w[^>]*[^\/]>$/) && !line.startsWith("<input") && !line.startsWith("<img") && !line.startsWith("<br") && !line.startsWith("<hr") && !line.startsWith("<meta") && !line.startsWith("<link")) i++;
  }); return f.trim();
}
export default function HtmlBeautify() {
  const [text,setText]=useState("<div><p>Hello</p><span>World</span></div>");
  const [out,setOut]=useState("");
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
    <ActionButton onClick={()=>setOut(beautifyHtml(text))}>Beautify HTML</ActionButton>
    {out && <textarea readOnly value={out} rows={10} className="code-output" />}
  </div>);
}
