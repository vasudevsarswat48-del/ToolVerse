import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
export default function SchemaGenerator() {
  const [type, setType] = useState<"Article"|"FAQPage"|"WebApplication">("WebApplication");
  const [name, setName] = useState("TulEra Free Tools");
  const [desc, setDesc] = useState("Free online PDF and SEO tools.");
  const [url, setUrl] = useState("https://example.com/");
  const json = useMemo(() => {
    const base: any = { "@context": "https://schema.org", "@type": type, name, description: desc, url };
    if (type === "WebApplication") {
      base.applicationCategory = "UtilitiesApplication";
      base.offers = { "@type": "Offer", price: "0", priceCurrency: "USD" };
    }
    return JSON.stringify(base, null, 2);
  }, [type, name, desc, url]);
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Type</span>
        <select value={type} onChange={e=>setType(e.target.value as any)} style={s} className="mt-1">
          <option>WebApplication</option><option>Article</option><option>FAQPage</option>
        </select>
      </label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Name</span><input value={name} onChange={e=>setName(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Description</span><input value={desc} onChange={e=>setDesc(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">URL</span><input value={url} onChange={e=>setUrl(e.target.value)} style={s} className="mt-1" /></label>
      <pre className="code-output" style={{whiteSpace:"pre-wrap"}}>{json}</pre>
      <ActionButton onClick={()=>navigator.clipboard.writeText(`<script type="application/ld+json">\n${json}\n</script>`)}>Copy JSON-LD</ActionButton>
    </div>
  );
}
