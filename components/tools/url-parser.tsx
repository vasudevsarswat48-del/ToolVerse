'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Globe, AlertCircle, ExternalLink, Hash, Key } from 'lucide-react';

interface ParsedUrl {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  username: string;
  password: string;
  params: { key: string; value: string }[];
}

export default function UrlParserTool() {
  const [urlInput, setUrlInput] = useState(
    'https://alex:secret123@api.example.com:8080/v1/users/profile?category=developer&status=active&sort=desc#settings'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { parsed, error } = useMemo(() => {
    if (!urlInput.trim()) {
      return { parsed: null, error: null };
    }

    try {
      // Support relative-like URLs or missing protocols by falling back
      let normalized = urlInput.trim();
      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(normalized)) {
        normalized = 'https://' + normalized;
      }

      const urlObj = new URL(normalized);
      const params: { key: string; value: string }[] = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      const parsedData: ParsedUrl = {
        href: urlObj.href,
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port || '(default)',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        username: urlObj.username,
        password: urlObj.password,
        params,
      };

      return { parsed: parsedData, error: null };
    } catch (err) {
      return {
        parsed: null,
        error: (err as Error).message || 'Invalid URL structure provided.',
      };
    }
  }, [urlInput]);

  const handleCopy = async (id: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setUrlInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>URL Structure & Query Parameter Inspector</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!urlInput}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* URL Input Box */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Target URL
          </label>
          <span className="text-[11px] text-slate-500">{urlInput.length} chars</span>
        </div>
        <div className="relative">
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL to parse (e.g., https://example.com/path?key=value#hash)..."
            className="w-full h-24 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
          {parsed && (
            <a
              href={parsed.href}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-950 border border-slate-800 rounded-lg transition"
              title="Open URL in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Parsing Error Display */}
      {error && (
        <div className="flex items-start gap-2 text-rose-400 p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">URL Parse Error</strong>
            {error}
          </div>
        </div>
      )}

      {/* Parsed Structure Output */}
      {parsed && (
        <div className="space-y-6">
          {/* Main Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Protocol', val: parsed.protocol, id: 'protocol' },
              { label: 'Hostname', val: parsed.hostname, id: 'hostname' },
              { label: 'Port', val: parsed.port, id: 'port' },
              { label: 'Origin', val: parsed.origin, id: 'origin' },
              { label: 'Pathname', val: parsed.pathname, id: 'pathname' },
              { label: 'Hash / Fragment', val: parsed.hash || '(none)', id: 'hash' },
              ...(parsed.username
                ? [
                    { label: 'Username', val: parsed.username, id: 'username' },
                    { label: 'Password', val: parsed.password || '*****', id: 'password' },
                  ]
                : []),
            ].map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{item.label}</span>
                  <button
                    onClick={() => handleCopy(item.id, item.val)}
                    className="text-slate-400 hover:text-cyan-400 transition"
                  >
                    {copiedKey === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-cyan-300 break-all">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Query Parameters Section */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> Query Parameters ({parsed.params.length})
              </span>
              {parsed.search && (
                <button
                  onClick={() => handleCopy('raw-search', parsed.search)}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                >
                  {copiedKey === 'raw-search' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Raw Search</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Raw Query
                    </>
                  )}
                </button>
              )}
            </div>

            {parsed.params.length === 0 ? (
              <p className="text-xs text-slate-600 font-mono italic p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                No query parameters present in this URL.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3 font-semibold w-1/3">Key</th>
                      <th className="py-2 px-3 font-semibold">Value</th>
                      <th className="py-2 px-3 font-semibold w-12 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-200">
                    {parsed.params.map((param, index) => {
                      const paramId = `param-${index}`;
                      return (
                        <tr key={index} className="hover:bg-slate-800/30 transition">
                          <td className="py-2.5 px-3 text-cyan-400 font-semibold break-all">
                            {param.key}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 break-all">{param.value}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleCopy(paramId, `${param.key}=${param.value}`)}
                              className="text-slate-400 hover:text-cyan-400 transition"
                              title="Copy Key-Value pair"
                            >
                              {copiedKey === paramId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 ml-auto" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
