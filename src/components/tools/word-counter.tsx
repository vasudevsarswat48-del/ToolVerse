
import React, { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0)
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter(Boolean).length
      : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, lines, readingMin };
  }, [text]);

  const cards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Characters (no spaces)", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Reading time", value: `~${stats.readingMin} min` },
  ];

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Paste or type your text here…"
        className="w-full rounded-xl border border-theme bg-surface text-main px-4 py-3 text-base leading-relaxed"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-theme bg-surface-2 px-3 py-3 text-center"
          >
            <p className="m-0 text-2xl font-bold text-main">{c.value}</p>
            <p className="m-0 text-xs text-muted mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
