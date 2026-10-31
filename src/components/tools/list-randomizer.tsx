import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function ListRandomizer() {
  const [text,setText]=useState("Alice\nBob\nCarol\nDave");
  const [out,setOut]=useState("");
  const shuffle=()=>{const a=text.split(/\r?\n/).filter(Boolean);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}setOut(a.join("\n"));};
  const pick=()=>{const a=text.split(/\r?\n/).filter(Boolean);if(a.length)setOut(a[Math.floor(Math.random()*a.length)]);};
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="code-output" placeholder="One item per line" />
    <div className="flex flex-wrap gap-2">
      <ActionButton onClick={shuffle}>Shuffle list</ActionButton>
      <ActionButton variant="secondary" onClick={pick}>Pick one random</ActionButton>
    </div>
    {out && <textarea readOnly value={out} rows={8} className="code-output" />}
  </div>);
}
