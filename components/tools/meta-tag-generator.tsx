'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Search, Share2, Globe, Sparkles, Eye } from 'lucide-react';

export default function MetaGeneratorTool() {
  const [title, setTitle] = useState('ToolVerse — Free Developer & Design Online Tools');
  const [description, setDescription] = useState(
    'A suite of clean, lightweight, privacy-focused web tools for developers, designers, and content creators.'
  );
  const [keywords, setKeywords] = useState('developer tools, web utilities, converter, formatter');
  const [author, setAuthor] = useState('ToolVerse Team');
  const [canonicalUrl, setCanonicalUrl] = useState('https://example.com');
  const [ogImage, setOgImage] = useState('https://example.com/og-image.png');
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image'>('summary_large_image');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'social'>('google');

  const generatedHtml = useMemo(() => {
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const cleanUrl = canonicalUrl.trim();
    const cleanImage = ogImage.trim();

    const tags: string[] = [
      '<!-- Primary Meta Tags -->',
      `<title>${cleanTitle}</title>`,
      `<meta name="title" content="${cleanTitle}" />`,
      `<meta name="description" content="${cleanDesc}" />`,
    ];

    if (keywords.trim()) {
      tags.push(`<meta name="keywords" content="${keywords.trim()}" />`);
    }
    if (author.trim()) {
      tags.push(`<meta name="author" content="${author.trim()}" />`);
    }
    tags.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    tags.push('<meta charset="UTF-8" />');

    if (cleanUrl) {
      tags.push('');
      tags.push('<!-- Canonical URL -->');
      tags.push(`<link rel="canonical" href="${cleanUrl}" />`);
    }

    tags.push('');
    tags.push('<!-- Open Graph / Facebook -->');
    tags.push('<meta property="og:type" content="website" />');
    if (cleanUrl) tags.push(`<meta property="og:url" content="${cleanUrl}" />`);
    tags.push(`<meta property="og:title" content="${cleanTitle}" />`);
    tags.push(`<meta property="og:description" content="${cleanDesc}" />`);
    if (cleanImage) tags.push(`<meta property="og:image" content="${cleanImage}" />`);

    tags.push('');
    tags.push('<!-- Twitter -->');
    tags.push(`<meta property="twitter:card" content="${twitterCard}" />`);
    if (cleanUrl) tags.push(`<meta property="twitter:url" content="${cleanUrl}" />`);
    tags.push(`<meta property="twitter:title" content="${cleanTitle}" />`);
    tags.push(`<meta property="twitter:description" content="${cleanDesc}" />`);
    if (cleanImage) tags.push(`<meta property="twitter:image" content="${cleanImage}" />`);

    return tags.join('\n');
  }, [title, description, keywords, author, canonicalUrl, ogImage, twitterCard]);

  const handleCopy = async () => {
    if (!generatedHtml) return;
    await navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setCanonicalUrl('');
    setOgImage('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>SEO & Open Graph Meta Tag Generator</span>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Main Grid: Form Controls vs Preview & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Page Information
          </span>

          {/* Page Title Input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Page Title</label>
              <span className={title.length > 60 ? 'text-amber-400' : 'text-slate-500'}>
                {title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ToolVerse — Free Online Utilities"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-sans text-xs focus:outline-none transition"
            />
          </div>

          {/* Meta Description Input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Meta Description</label>
              <span className={description.length > 160 ? 'text-amber-400' : 'text-slate-500'}>
                {description.length} / 160 chars
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the webpage..."
              className="w-full p-3 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-sans text-xs focus:outline-none transition resize-none leading-relaxed"
            />
          </div>

          {/* Keywords & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Keywords (comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="tools, web, dev"
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-sans text-xs focus:outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Author / Site Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author or Company"
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-sans text-xs focus:outline-none transition"
              />
            </div>
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block pt-2">
            Social & URLs
          </span>

          {/* Canonical URL & OG Image */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Canonical Page URL</label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-xs focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Open Graph Image URL</label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://example.com/og-image.png"
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-xs focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <span className="text-slate-400">Twitter Card Type:</span>
              {[
                { label: 'Large Image', val: 'summary_large_image' },
                { label: 'Summary', val: 'summary' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setTwitterCard(item.val as 'summary' | 'summary_large_image')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border ${
                    twitterCard === item.val
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews & Code Output */}
        <div className="space-y-6">
          {/* Real-time Visual Preview Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> Real-time Snippet Preview
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('google')}
                  className={`px-2.5 py-0.5 rounded font-medium transition ${
                    activeTab === 'google'
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Google Search
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`px-2.5 py-0.5 rounded font-medium transition ${
                    activeTab === 'social'
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Social Card
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl min-h-[160px] flex items-center justify-center">
              {activeTab === 'google' ? (
                /* Google Search Preview */
                <div className="w-full space-y-1 font-sans">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Search className="w-3 h-3 text-slate-500" />
                    <span className="truncate max-w-full text-slate-300">
                      {canonicalUrl || 'https://example.com'}
                    </span>
                  </div>
                  <h3 className="text-base text-cyan-400 hover:underline cursor-pointer font-medium truncate">
                    {title || 'Page Title Placeholder'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {description || 'Meta description text snippet will appear here in search engine query results.'}
                  </p>
                </div>
              ) : (
                /* Social Card Preview */
                <div className="w-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                  {ogImage ? (
                    <div className="h-32 bg-slate-900 overflow-hidden relative border-b border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-24 bg-slate-900/60 border-b border-slate-800 flex items-center justify-center text-slate-600 text-xs italic">
                      No OG Image Provided
                    </div>
                  )}
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block truncate">
                      {canonicalUrl ? new URL(canonicalUrl).hostname : 'example.com'}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {title || 'Social Card Title'}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                      {description || 'Social media description snippet preview.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> HTML Head Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!generatedHtml}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            <textarea
              value={generatedHtml}
              readOnly
              rows={12}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
