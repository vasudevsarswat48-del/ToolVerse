import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function HtaccessGenerator() {
  const [from, setFrom] = useState("/old-page");
  const [to, setTo] = useState("/new-page");
  const [https, setHttps] = useState(true);
  const [www, setWww] = useState(false);
  const out = useMemo(() => {
    const lines = ["RewriteEngine On"];
    if (https) lines.push("RewriteCond %{HTTPS} off","RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]");
    if (www) lines.push("RewriteCond %{HTTP_HOST} !^www\\. [NC]","RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]");
    if (from && to) lines.push(`Redirect 301 ${from} ${to}`);
    return lines.join("\n");
  }, [from,to,https,www]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={https} onChange={e=>setHttps(e.target.checked)} /> Force HTTPS</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={www} onChange={e=>setWww(e.target.checked)} /> Force www</label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Redirect from</span><input value={from} onChange={e=>setFrom(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Redirect to</span><input value={to} onChange={e=>setTo(e.target.value)} style={s} className="mt-1" /></label>
      <pre className="code-output" style={{whiteSpace:"pre-wrap"}}>{out}</pre>
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy</ActionButton>
    </div>
  );
}
