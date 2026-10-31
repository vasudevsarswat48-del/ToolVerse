import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getPost } from "@/lib/blog-posts";
import { AdSlot } from "@/components/AdSlot";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | TulEra`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.description);
  }, [post]);

  if (!post) {
    return (
      <div className="container page-pad">
        <p>Post not found.</p>
        <Link to="/blog">Back to blog</Link>
      </div>
    );
  }

  return (
    <article className="container page-pad" style={{ maxWidth: 720 }}>
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/blog">Blog</Link>
        <span>/</span>
        <span>{post.tags[0]}</span>
      </nav>
      <p className="text-xs text-muted m-0">
        {post.date} · {post.tags.join(" · ")}
      </p>
      <h1 style={{ letterSpacing: "-0.02em", lineHeight: 1.25, marginTop: 8 }}>{post.title}</h1>
      <p className="text-muted" style={{ fontSize: "1.05rem" }}>
        {post.description}
      </p>

      <AdSlot label="Ad" />

      <div style={{ lineHeight: 1.75, marginTop: 8 }}>
        {post.content.map((line, i) => {
          if (line.startsWith("## "))
            return (
              <h2 key={i} style={{ marginTop: 28, marginBottom: 10, fontSize: "1.25rem" }}>
                {line.slice(3)}
              </h2>
            );
          if (/^\d+\./.test(line))
            return (
              <p key={i} style={{ margin: "6px 0" }}>
                {line}
              </p>
            );
          return (
            <p key={i} style={{ margin: "0 0 14px" }}>
              {line}
            </p>
          );
        })}
      </div>

      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: "1.15rem" }}>Related tools</h2>
        <ul style={{ paddingLeft: 18 }}>
          {post.relatedTools.map((t) => (
            <li key={t.slug} style={{ margin: "8px 0" }}>
              <Link to={`/tool/${t.slug}`}>{t.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot label="Ad" />

      <p style={{ marginTop: 32 }}>
        <Link to="/blog">← All guides</Link>
      </p>
    </article>
  );
}
