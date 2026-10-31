import { useEffect, useState } from "react";
export default function ScreenInfo() {
  const [info,setInfo]=useState<Record<string,string>>({});
  useEffect(()=>{
    setInfo({
      "Screen": `${screen.width} × ${screen.height}`,
      "Available": `${screen.availWidth} × ${screen.availHeight}`,
      "Window": `${window.innerWidth} × ${window.innerHeight}`,
      "Pixel ratio": String(window.devicePixelRatio),
      "Color depth": `${screen.colorDepth}-bit`,
      "Language": navigator.language,
      "Platform": navigator.platform||"n/a",
      "Online": navigator.onLine?"Yes":"No",
      "Cookies": navigator.cookieEnabled?"Enabled":"Disabled",
      "User agent": navigator.userAgent,
    });
  },[]);
  return (<div className="space-y-2">
    {Object.entries(info).map(([k,v])=>(
      <div key={k} style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div className="text-xs text-muted">{k}</div>
        <div style={{wordBreak:"break-all",fontSize:14,marginTop:2}}>{v}</div>
      </div>
    ))}
  </div>);
}
