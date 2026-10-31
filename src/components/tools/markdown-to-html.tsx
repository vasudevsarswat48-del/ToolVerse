import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

function mdToHtml(md: string) {
  let h = md
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/^### (.*)$/gm,"<h3>$1</h3>")
    .replace(/^## (.*)$/gm,"<h2>$1</h2>")
    .replace(/^# (.*)$/gm,"<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`([^`]+)`/g,"<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>')
    .replace(/^\- (.*)$/gm,"<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g,(m)=>`<ul>${m}</ul>`)
    .replace(/\n\n/g,"</p><p>")
    .replace(/\n/g,"<br/>");
  return `<p>${h}</p>`;
}

export default function MarkdownToHtml() {
  const [md, setMd] = useState("# Hello\n\n**Bold** and *italic*\n\n- One\n- Two");
  const html = useMemo(()=>mdToHtml(md),[md]);
  return (
    <div className="space-y-4">
      <textarea value={md} onChange={e=>setMd(e.target.value)} rows={8} className="code-output" />
      <textarea readOnly value={html} rows={6} className="code-output" />
      <div style={{padding:16,border:"1px solid var(--border)",borderRadius:12,background:"var(--surface-2)"}} dangerouslySetInnerHTML={{__html: html}} />
      <ActionButton onClick={()=>navigator.clipboard.writeText(html)}>Copy HTML</ActionButton>
    </div>
  );
}
