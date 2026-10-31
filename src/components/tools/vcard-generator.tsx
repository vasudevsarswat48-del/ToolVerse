import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function VcardGenerator() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  const vcf = useMemo(() => {
    return [
      "BEGIN:VCARD","VERSION:3.0",
      `FN:${name}`,
      org ? `ORG:${org}` : "",
      phone ? `TEL:${phone}` : "",
      email ? `EMAIL:${email}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");
  }, [name, phone, email, org]);
  return (
    <div className="space-y-4">
      {[
        ["Full name", name, setName],
        ["Phone", phone, setPhone],
        ["Email", email, setEmail],
        ["Organization", org, setOrg],
      ].map(([l,v,set])=>(
        <label key={l as string} className="text-sm" style={{display:"block"}}>
          <span className="text-muted">{l as string}</span>
          <input value={v as string} onChange={e=>(set as any)(e.target.value)} style={s} className="mt-1" />
        </label>
      ))}
      <pre className="code-output" style={{whiteSpace:"pre-wrap"}}>{vcf}</pre>
      <ActionButton onClick={()=>{
        const a=document.createElement("a");
        a.href=URL.createObjectURL(new Blob([vcf],{type:"text/vcard"}));
        a.download="contact.vcf"; a.click();
      }}>Download .vcf</ActionButton>
    </div>
  );
}
