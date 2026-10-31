import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
const M: Record<string,string> = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..","0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----."," ":"/"};
const R = Object.fromEntries(Object.entries(M).map(([k,v])=>[v,k]));
export default function MorseCode() {
  const [text, setText] = useState("HELLO");
  const [mode, setMode] = useState<"en"|"de">("en");
  const out = useMemo(() => {
    if (mode==="en") return text.toUpperCase().split("").map(c=>M[c]||"").filter(Boolean).join(" ");
    return text.trim().split(/\s+/).map(c=>R[c]||"?").join("");
  }, [text, mode]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" className={`btn ${mode==="en"?"":"secondary"}`} onClick={()=>setMode("en")}>Text → Morse</button>
        <button type="button" className={`btn ${mode==="de"?"":"secondary"}`} onClick={()=>setMode("de")}>Morse → Text</button>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} className="code-output" />
      <textarea readOnly value={out} rows={4} className="code-output" />
      <ActionButton onClick={()=>navigator.clipboard.writeText(out)}>Copy</ActionButton>
    </div>
  );
}
