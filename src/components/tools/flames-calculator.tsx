import { useMemo, useState } from "react";
const MAP=["Friends","Love","Affection","Marriage","Enemies","Siblings"];
export default function FlamesCalculator() {
  const [a,setA]=useState(""),[b,setB]=useState("");
  const result=useMemo(()=>{
    let x=a.toLowerCase().replace(/\s/g,""), y=b.toLowerCase().replace(/\s/g,"");
    if(!x||!y) return null;
    for(const ch of x){ if(y.includes(ch)){ x=x.replace(ch,""); y=y.replace(ch,""); } }
    const n=(x+y).length; if(!n) return MAP[0];
    const arr=[...MAP]; let i=0;
    while(arr.length>1){ i=(i+n-1)%arr.length; arr.splice(i,1); }
    return arr[0];
  },[a,b]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (<div className="space-y-4">
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Your name</span><input value={a} onChange={e=>setA(e.target.value)} style={s} className="mt-1" /></label>
    <label className="text-sm" style={{display:"block"}}><span className="text-muted">Partner name</span><input value={b} onChange={e=>setB(e.target.value)} style={s} className="mt-1" /></label>
    {result && <div style={{textAlign:"center",padding:28,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:28,fontWeight:800}}>{result}</div>}
    <p className="text-xs text-muted m-0">Just for fun — not a real prediction.</p>
  </div>);
}
