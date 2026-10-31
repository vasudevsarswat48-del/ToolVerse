import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function UtmBuilder() {
  const [url, setUrl] = useState("https://");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const base = url.trim() || "https://example.com";
      const u = new URL(base.startsWith("http") ? base : `https://${base}`);
      if (source) u.searchParams.set("utm_source", source);
      if (medium) u.searchParams.set("utm_medium", medium);
      if (campaign) u.searchParams.set("utm_campaign", campaign);
      if (term) u.searchParams.set("utm_term", term);
      if (content) u.searchParams.set("utm_content", content);
      return u.toString();
    } catch {
      return "";
    }
  }, [url, source, medium, campaign, term, content]);

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const field = (
    label: string,
    value: string,
    set: (v: string) => void,
    placeholder: string
  ) => (
    <label className="text-sm" style={{ display: "block" }}>
      <span className="text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
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
  );

  return (
    <div className="space-y-4">
      {field("Website URL", url, setUrl, "https://example.com/page")}
      {field("utm_source", source, setSource, "google, newsletter, twitter")}
      {field("utm_medium", medium, setMedium, "cpc, email, social")}
      {field("utm_campaign", campaign, setCampaign, "spring_sale")}
      {field("utm_term (optional)", term, setTerm, "running+shoes")}
      {field("utm_content (optional)", content, setContent, "hero_banner")}
      <div
        className="code-output"
        style={{ minHeight: 48, wordBreak: "break-all" }}
      >
        {result || "Enter a valid URL to preview"}
      </div>
      <ActionButton onClick={copy} disabled={!result}>
        {copied ? "Copied!" : "Copy link"}
      </ActionButton>
    </div>
  );
}
