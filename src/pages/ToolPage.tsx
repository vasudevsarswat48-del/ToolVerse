import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolIcon } from "@/components/ToolIcon";
import ToolLoader from "@/components/ToolLoader";
import { AdSlot } from "@/components/AdSlot";

export default function ToolPage() {
  const { slug = "" } = useParams();
  const tool = getToolBySlug(slug);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} – Free Online Tool | TulEra`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", tool.description);
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="container page-pad" style={{ textAlign: "center" }}>
        <p>Tool not found.</p>
        <Link to="/">Back to all tools</Link>
      </div>
    );
  }

  return (
    <div className="container page-pad tool-page">
      <nav className="breadcrumb">
        <Link to="/">All tools</Link>
        <span>/</span>
        <span>{tool.category}</span>
      </nav>
      <header className="tool-header">
        <ToolIcon name={tool.icon} color={tool.color} size={26} />
        <div className="tool-header-text">
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
      </header>
      <AdSlot />
      <div className="tool-panel">
        <ToolLoader slug={slug} />
      </div>
      <AdSlot />
      <div className="trust-row">
        <div>✓ Runs in your browser — files never uploaded</div>
        <div>✓ Free, no sign-up</div>
        <div>✓ No watermarks</div>
      </div>
    </div>
  );
}
