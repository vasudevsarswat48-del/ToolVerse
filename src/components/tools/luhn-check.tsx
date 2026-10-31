import { useMemo, useState } from "react";
function luhn(num: string) {
  const s = num.replace(/\D/g,"");
  if (s.length < 12) return null;
  let sum = 0, alt = false;
  for (let i=s.length-1;i>=0;i--) {
    let n = parseInt(s[i],10);
    if (alt) { n *= 2; if (n>9) n-=9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}
export default function LuhnCheck() {
  const [n, setN] = useState("");
  const ok = useMemo(()=>luhn(n),[n]);
  return (
    <div className="space-y-4">
      <input value={n} onChange={e=>setN(e.target.value)} placeholder="Card number" style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",letterSpacing:1}} />
      {ok !== null && (
        <div style={{padding:16,borderRadius:12,border:"1px solid var(--border)",background: ok?"#ecfdf5":"#fef2f2",color: ok?"#047857":"#b91c1c",fontWeight:700,textAlign:"center"}}>
          {ok ? "Valid number (Luhn check passed)" : "Invalid number"}
        </div>
      )}
      <p className="text-xs text-muted m-0">Runs offline with the Luhn algorithm. Nothing is sent to a server.</p>
    </div>
  );
}
