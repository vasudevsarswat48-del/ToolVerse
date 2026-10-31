import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function JsBeautify() {
  const [text,setText]=useState("function hi(n){return n*2;}");
  const [out,setOut]=useState(""); const [err,setErr]=useState("");
  const run=()=>{try{setErr("");setOut(JSON.stringify(Function(`return(${text.includes("function")||text.includes("=>")?text:`(${text})`})`) ,null,2));}
    catch{ try { // fallback simple indent by braces
      let o="",i=0; for(const ch of text){ if(ch==="{"){o+="{\n"+"  ".repeat(++i);} else if(ch==="}"){o+="\n"+"  ".repeat(Math.max(0,--i))+"}";} else if(ch===";"){o+=";\n"+"  ".repeat(i);} else o+=ch;} setOut(o); setErr("");}
      catch(e:any){setErr("Could not format");}}};
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
    <ActionButton onClick={run}>Format JS-like code</ActionButton>
    {err && <p className="text-sm m-0" style={{color:"#dc2626"}}>{err}</p>}
    {out && <textarea readOnly value={out} rows={10} className="code-output" />}
  </div>);
}
