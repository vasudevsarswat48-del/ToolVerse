import { useMemo, useState } from "react";
function isPrime(n: number) {
  if (n < 2 || !Number.isInteger(n)) return false;
  if (n < 4) return true;
  if (n%2===0||n%3===0) return false;
  for (let i=5;i*i<=n;i+=6) if (n%i===0||n%(i+2)===0) return false;
  return true;
}
export default function PrimeChecker() {
  const [n, setN] = useState("17");
  const num = parseInt(n,10);
  const ok = useMemo(()=>isPrime(num),[num]);
  return (
    <div className="space-y-4">
      <input type="number" value={n} onChange={e=>setN(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:22,fontWeight:700}}>
        {isNaN(num) ? "Enter a number" : ok ? `${num} is prime` : `${num} is not prime`}
      </div>
    </div>
  );
}
