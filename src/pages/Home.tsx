import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_TOOLS, type Tool } from "@/lib/constants/tools";
import { ToolIcon } from "@/components/ToolIcon";

const CATS = ["PDF", "Image", "Developer", "Text", "Web", "Calculators"];

export default function Home() {
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = ALL_TOOLS.filter(
      (t) =>
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.slug.includes(query) ||
        t.category.toLowerCase().includes(query)
    );
    const map = new Map<string, Tool[]>();
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
    }
    const ordered: { cat: string; tools: Tool[] }[] = [];
    for (const c of [...CATS, "Other"]) {
      if (map.has(c)) ordered.push({ cat: c, tools: map.get(c)! });
    }
    for (const [c, tools] of map) {
      if (![...CATS, "Other"].includes(c)) ordered.push({ cat: c, tools });
    }
    return ordered;
  }, [q]);

  return (
    <>
      <section className="hero-bg" style={{ padding: "48px 0 36px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Free online tools that stay private
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto 24px", fontSize: "1.05rem" }}>
            {ALL_TOOLS.length}+ utilities for PDF, images, text and developers. Runs in your browser —
            no upload, no account.
          </p>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools (merge pdf, json, qr…)"
            style={{
              width: "min(480px, 100%)",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              boxShadow: "var(--shadow)",
            }}
          />
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQ(c)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
            {q && (
              <button type="button" onClick={() => setQ("")} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--primary)", cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "40px 0" }}>
        {grouped.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--muted)" }}>No tools match “{q}”.</p>
        ) : (
          grouped.map(({ cat, tools }) => (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.1rem", margin: "0 0 16px" }}>
                {cat}{" "}
                <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 14 }}>
                  ({tools.length})
                </span>
              </h2>
              <div className="grid-tools">
                {tools.map((tool) => (
                  <Link key={tool.slug} to={`/tool/${tool.slug}`} className="tool-card">
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <ToolIcon name={tool.icon} color={tool.color} />
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{tool.name}</h3>
                        <p className="line-clamp-2 text-sm text-muted" style={{ margin: 0 }}>
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
