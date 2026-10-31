import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

async function sha(algo: string, text: string) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

export default function PasswordHash() {
  const [text, setText] = useState("");
  const [out, setOut] = useState<{sha256:string;sha1:string} | null>(null);
  const run = async () => {
    setOut({
      sha256: await sha("SHA-256", text),
      sha1: await sha("SHA-1", text),
    });
  };
  return (
    <div className="space-y-4">
      <input type="password" value={text} onChange={e=>setText(e.target.value)} placeholder="Text to hash" style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
      <ActionButton onClick={run} disabled={!text}>Hash</ActionButton>
      {out && (
        <div className="space-y-2">
          {Object.entries(out).map(([k,v])=>(
            <div key={k} style={{padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
              <div className="text-xs text-muted">{k.toUpperCase()}</div>
              <div style={{fontFamily:"monospace",fontSize:12,wordBreak:"break-all"}}>{v}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted m-0">SHA hashes only (browser-safe). Not a substitute for bcrypt/argon2 password storage.</p>
    </div>
  );
}
