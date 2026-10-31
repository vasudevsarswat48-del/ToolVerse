import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const KEY = "tulera-notepad";
export default function SimpleNotepad() {
  const [text, setText] = useState("");
  useEffect(() => { try { setText(localStorage.getItem(KEY)||""); } catch {} }, []);
  const save = () => { try { localStorage.setItem(KEY, text); } catch {} };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={14} className="code-output" placeholder="Notes stay in this browser only…" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={save}>Save locally</ActionButton>
        <ActionButton variant="secondary" onClick={()=>{ setText(""); try{localStorage.removeItem(KEY)}catch{} }}>Clear</ActionButton>
      </div>
    </div>
  );
}
