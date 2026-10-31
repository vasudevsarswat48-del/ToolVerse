import { useState } from "react";
export default function ScientificCalc() {
  const [expr,setExpr]=useState(""); const [out,setOut]=useState("");
  const keys=["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+","C","="];
  const press=(k:string)=>{
    if(k==="C"){setExpr("");setOut("");return;}
    if(k==="="){try{const r=Function(`"use strict";return(${expr})`)();setOut(String(r));}catch{setOut("Error");}return;}
    setExpr(e=>e+k);
  };
  return (<div className="space-y-3">
    <div style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)",minHeight:48,fontFamily:"monospace",wordBreak:"break-all"}}>{expr||"0"}</div>
    <div style={{padding:8,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",minHeight:32,fontWeight:700}}>{out}</div>
    <div className="grid gap-2" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
      {keys.map(k=>(<button key={k} type="button" className="btn secondary" style={{padding:"14px 0"}} onClick={()=>press(k)}>{k}</button>))}
    </div>
  </div>);
}
