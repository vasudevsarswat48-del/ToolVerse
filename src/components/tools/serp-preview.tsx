import { useState } from "react";
export default function SerpPreview() {
  const [title, setTitle] = useState("Free PDF Merge Tool – TulEra");
  const [url, setUrl] = useState("https://example.com/tool/merge-pdf");
  const [desc, setDesc] = useState("Merge PDF files online for free. Private, fast, no upload to servers.");
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Title ({title.length}/60)</span><input value={title} onChange={e=>setTitle(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">URL</span><input value={url} onChange={e=>setUrl(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Description ({desc.length}/160)</span><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} style={s} className="mt-1" /></label>
      <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background:"#fff",maxWidth:600}}>
        <div style={{color:"#1a0dab",fontSize:18,lineHeight:1.3}}>{title.slice(0,60) || "Title"}</div>
        <div style={{color:"#006621",fontSize:14,marginTop:2}}>{url || "https://example.com"}</div>
        <div style={{color:"#545454",fontSize:13,marginTop:4,lineHeight:1.4}}>{desc.slice(0,160)}</div>
      </div>
    </div>
  );
}
