import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const xml = useMemo(() => {
    const list = urls.split(/\r?\n/).map(u=>u.trim()).filter(Boolean);
    const body = list.map(u => `  <url>\n    <loc>${u.replace(/&/g,"&amp;")}</loc>\n  </url>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  }, [urls]);
  return (
    <div className="space-y-4">
      <textarea value={urls} onChange={e=>setUrls(e.target.value)} rows={6} className="code-output" placeholder="One URL per line" />
      <textarea readOnly value={xml} rows={12} className="code-output" />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={()=>navigator.clipboard.writeText(xml)}>Copy XML</ActionButton>
        <ActionButton variant="secondary" onClick={()=>{
          const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([xml],{type:"application/xml"})); a.download="sitemap.xml"; a.click();
        }}>Download</ActionButton>
      </div>
    </div>
  );
}
