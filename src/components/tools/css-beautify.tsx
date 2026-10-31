import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
function beautify(css: string) {
  let out="", ind=0;
  css.replace(/\s+/g," ").split(/([{}];)/).filter(Boolean).forEach(p=>{
    if(p==="}"){ind=Math.max(0,ind-1);out+="\n"+"  ".repeat(ind)+"}\n";}
    else if(p==="{"){out+=" {\n";ind++;}
    else if(p===";"){out+=";\n"+"  ".repeat(ind);}
    else out+="  ".repeat(ind)+p.trim();
  });
  return out.trim();
}
export default function CssBeautify() {
  const [text,setText]=useState("body{margin:0;color:#111}h1{font-size:2rem}");
  const [out,setOut]=useState("");
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" />
    <ActionButton onClick={()=>setOut(beautify(text))}>Beautify CSS</ActionButton>
    {out && <textarea readOnly value={out} rows={10} className="code-output" />}
  </div>);
}
