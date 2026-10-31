import { Link } from "react-router-dom";
import { useEffect } from "react";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function Blog() {
  useEffect(() => {
    document.title = "Blog – PDF, SEO & Finance Guides | TulEra";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Practical guides on merging PDFs, SIP calculators, GST, and free SEO tools. Learn and use TulEra tools in your browser."
      );
  }, []);

  return (
    <div className="container page-pad" style={{ maxWidth: 800 }}>
      <h1 style={{ marginTop: 0, letterSpacing: "-0.02em" }}>Blog</h1>
      <p className="text-muted">
        How-to guides and explainers that help you get more from free PDF, finance, and SEO tools.
      </p>
      <div className="space-y-4" style={{ marginTop: 28 }}>
        {BLOG_POSTS.map((p) => (
          <article
            key={p.slug}
            style={{
              padding: 20,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div className="text-xs text-muted">
              {p.date} · {p.tags.join(" · ")}
            </div>
            <h2 style={{ margin: "8px 0", fontSize: "1.2rem" }}>
              <Link to={`/blog/${p.slug}`} style={{ color: "var(--text)", textDecoration: "none" }}>
                {p.title}
              </Link>
            </h2>
            <p className="text-muted text-sm" style={{ margin: "0 0 12px" }}>
              {p.description}
            </p>
            <Link to={`/blog/${p.slug}`} style={{ fontWeight: 600, fontSize: 14 }}>
              Read guide →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
