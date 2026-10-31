import { useMemo, useState } from "react";
export default function MetaLength() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const tOk = title.length >= 30 && title.length <= 60;
  const dOk = desc.length >= 120 && desc.length <= 160;
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Title ({title.length}/60)</span>
        <input value={title} onChange={e=>setTitle(e.target.value)} style={s} className="mt-1" /></label>
      <div className="text-sm" style={{color:tOk?"#059669":"#b45309"}}>{tOk?"Good title length":"Aim for ~30–60 characters"}</div>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Meta description ({desc.length}/160)</span>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} style={s} className="mt-1" /></label>
      <div className="text-sm" style={{color:dOk?"#059669":"#b45309"}}>{dOk?"Good description length":"Aim for ~120–160 characters"}</div>
    </div>
  );
}
