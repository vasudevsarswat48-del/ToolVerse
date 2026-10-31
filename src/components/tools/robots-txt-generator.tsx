import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function RobotsTxtGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [disallowAdmin, setDisallowAdmin] = useState(true);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [extra, setExtra] = useState("");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    const lines = ["User-agent: *"];
    if (allowAll && !disallowAdmin) lines.push("Allow: /");
    if (disallowAdmin) {
      lines.push("Disallow: /admin/");
      lines.push("Disallow: /api/");
    }
    if (allowAll && disallowAdmin) lines.push("Allow: /");
    if (!allowAll && !disallowAdmin) lines.push("Disallow: /");
    if (extra.trim()) {
      extra
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((l) => lines.push(l));
    }
    if (sitemap.trim()) {
      lines.push("");
      lines.push(`Sitemap: ${sitemap.trim()}`);
    }
    return lines.join("\n");
  }, [allowAll, disallowAdmin, sitemap, extra]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "robots.txt";
    a.click();
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} />
        Allow search engines to crawl the site
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={disallowAdmin} onChange={(e) => setDisallowAdmin(e.target.checked)} />
        Block /admin/ and /api/
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Sitemap URL</span>
        <input
          value={sitemap}
          onChange={(e) => setSitemap(e.target.value)}
          className="w-full mt-1"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </label>
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Extra rules (optional, one per line)</span>
        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          rows={3}
          placeholder="Disallow: /private/"
          className="code-output mt-1"
        />
      </label>
      <pre className="code-output" style={{ whiteSpace: "pre-wrap" }}>
        {text}
      </pre>
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={copy}>{copied ? "Copied!" : "Copy"}</ActionButton>
        <ActionButton variant="secondary" onClick={download}>
          Download robots.txt
        </ActionButton>
      </div>
    </div>
  );
}
