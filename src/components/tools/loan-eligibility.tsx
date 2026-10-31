import { useMemo, useState } from "react";
export default function LoanEligibility() {
  const [income, setIncome] = useState("50000");
  const [emi, setEmi] = useState("10000");
  const [rate, setRate] = useState("40");
  const r = useMemo(() => {
    const inc=parseFloat(income)||0, existing=parseFloat(emi)||0, maxPct=(parseFloat(rate)||40)/100;
    const maxEmi = Math.max(0, inc*maxPct - existing);
    return { maxEmi };
  }, [income, emi, rate]);
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Monthly income</span><input type="number" value={income} onChange={e=>setIncome(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Existing EMIs</span><input type="number" value={emi} onChange={e=>setEmi(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Max EMI % of income</span><input type="number" value={rate} onChange={e=>setRate(e.target.value)} style={s} className="mt-1" /></label>
      <div style={{textAlign:"center",padding:24,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
        <div style={{fontSize:28,fontWeight:800}}>{r.maxEmi.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
        <div className="text-muted">Suggested max new EMI / month</div>
      </div>
      <p className="text-xs text-muted m-0">Rule-of-thumb only — banks use their own criteria.</p>
    </div>
  );
}
