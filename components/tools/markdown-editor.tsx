'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Eye, Code2, Bold, Italic, Heading, List, Link as LinkIcon, Code } from 'lucide-react';

export default function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState(
    `# Welcome to Markdown Editor\n\nWrite **bold** text, *italics*, or \`inline code\` with live preview.\n\n### Quick Features:\n- Instant live preview\n- HTML export\n- Lightweight client-side rendering\n\n[Visit ToolVerse](https://toolverse.dev)`
  );
  const [activeView, setActiveView] = useState<'preview' | 'html'>('preview');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Simple client-side Markdown to HTML converter
  const htmlOutput = useMemo(() => {
    if (!markdown.trim()) return '';

    let parsed = markdown
      // Escape HTML special chars
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-100 my-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyan-400 my-3 pb-1 border-b border-slate-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-cyan-300 my-4 pb-2 border-b border-slate-800">$1</h1>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
      // Inline Code
      .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">$1</a>')
      // Unordered Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
      // Paragraphs & Line Breaks
      .replace(/\n\n/g, '<br/><br/>');

    return parsed;
  }, [markdown]);

  const insertSnippet = (prefix: string, suffix: string = '') => {
    setMarkdown((prev) => `${prev}\n${prefix}text${suffix}`);
  };

  const handleCopy = async (type: 'md' | 'html') => {
    const textToCopy = type === 'md' ? markdown : htmlOutput;
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);

    if (type === 'md') {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleClear = () => {
    setMarkdown('');
  };

  return (
    <div className="space-y-6">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => insertSnippet('**', '**')}
            title="Bold"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('*', '*')}
            title="Italic"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('## ')}
            title="Heading"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('- ')}
            title="List"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('`', '`')}
            title="Code"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('[', '](https://)')}
            title="Link"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleClear}
          disabled={!markdown}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Markdown Input Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Markdown Editor
            </label>
            <button
              onClick={() => handleCopy('md')}
              disabled={!markdown}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy MD
                </>
              )}
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="w-full h-96 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Output Area (Preview / Raw HTML) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeView === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setActiveView('html')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeView === 'html'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> HTML Code
              </button>
            </div>

            <button
              onClick={() => handleCopy('html')}
              disabled={!htmlOutput}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
            >
              {copiedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy HTML
                </>
              )}
            </button>
          </div>

          {activeView === 'preview' ? (
            <div
              dangerouslySetInnerHTML={{ __html: htmlOutput || '<p class="text-slate-600 italic">Preview will appear here...</p>' }}
              className="w-full h-96 bg-slate-900/80 border border-slate-800 rounded-xl p-4 overflow-y-auto text-slate-200 text-xs leading-relaxed space-y-2"
            />
          ) : (
            <textarea
              value={htmlOutput}
              readOnly
              placeholder="Rendered HTML output will appear here..."
              className="w-full h-96 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
}
