'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Terminal, ArrowRight, AlertCircle } from 'lucide-react';

export default function CurlToFetchTool() {
  const [curl, setCurl] = useState(
    `curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d '{"name": "John Doe", "email": "john@example.com"}'`
  );
  const [copied, setCopied] = useState(false);

  // Parse cURL command to JavaScript fetch snippet
  const { fetchCode, error } = useMemo(() => {
    if (!curl.trim()) return { fetchCode: '', error: '' };

    try {
      // Clean up multiline bash backslashes
      const cleanCurl = curl.replace(/\\\n/g, ' ').replace(/\s+/g, ' ').trim();

      if (!cleanCurl.toLowerCase().startsWith('curl')) {
        return { fetchCode: '', error: 'Command must begin with "curl"' };
      }

      let url = '';
      let method = 'GET';
      const headers: Record<string, string> = {};
      let body: string | null = null;

      // Extract Method (-X METHOD or --request METHOD)
      const methodMatch = cleanCurl.match(/(?:-X|--request)\s+([A-Za-z]+)/);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      }

      // Extract Headers (-H "Key: Value" or --header 'Key: Value')
      const headerRegex = /(?:-H|--header)\s+["']([^"']+)["']/g;
      let headerMatch;
      while ((headerMatch = headerRegex.exec(cleanCurl)) !== null) {
        const [key, ...val] = headerMatch[1].split(':');
        if (key && val) {
          headers[key.trim()] = val.join(':').trim();
        }
      }

      // Extract Body (-d '...' or --data '...' or --data-raw '...')
      const bodyMatch = cleanCurl.match(/(?:-d|--data|--data-raw|--data-binary)\s+["']([^"']+)["']/);
      if (bodyMatch) {
        body = bodyMatch[1];
        if (!methodMatch) method = 'POST';
      }

      // Extract URL
      const urlMatch = cleanCurl.match(/(https?:\/\/[^\s"']+)/);
      if (urlMatch) {
        url = urlMatch[1];
      } else {
        // Fallback for relative or non-http URLs
        const argMatch = cleanCurl.match(/curl\s+(?:-[^\s]+\s+)*["']?([^\s"']+)["']/);
        if (argMatch) url = argMatch[1];
      }

      if (!url) {
        return { fetchCode: '', error: 'Could not detect a valid URL in the cURL command.' };
      }

      // Construct Fetch Code Output
      let code = `fetch("${url}"`;
      const hasOptions = method !== 'GET' || Object.keys(headers).length > 0 || body;

      if (hasOptions) {
        code += `, {\n`;
        if (method !== 'GET') {
          code += `  method: "${method}",\n`;
        }

        if (Object.keys(headers).length > 0) {
          code += `  headers: {\n`;
          Object.entries(headers).forEach(([k, v]) => {
            code += `    "${k}": "${v}",\n`;
          });
          code += `  },\n`;
        }

        if (body) {
          try {
            // Pretty format JSON payload if valid
            const parsedBody = JSON.parse(body);
            code += `  body: JSON.stringify(${JSON.stringify(parsedBody, null, 4).replace(/\n/g, '\n  ')}),\n`;
          } catch {
            code += `  body: ${JSON.stringify(body)},\n`;
          }
        }
        code += `}`;
      }

      code += `)\n  .then((response) => response.json())\n  .then((data) => console.log(data))\n  .catch((error) => console.error("Error:", error));`;

      return { fetchCode: code, error: '' };
    } catch {
      return { fetchCode: '', error: 'Failed to parse cURL command syntax.' };
    }
  }, [curl]);

  const handleCopy = async () => {
    if (!fetchCode) return;
    await navigator.clipboard.writeText(fetchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCurl('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>cURL to JavaScript Fetch Converter</span>
        </div>

        <button
          onClick={handleClear}
          disabled={!curl}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Syntax Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* cURL Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> cURL Command
            </label>
            <span className="text-[11px] text-slate-500">{curl.length} chars</span>
          </div>
          <textarea
            value={curl}
            onChange={(e) => setCurl(e.target.value)}
            placeholder="Paste cURL command here (curl https://...)"
            className="w-full h-80 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Fetch Code Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" /> JavaScript fetch() Output
            </label>
            <button
              onClick={handleCopy}
              disabled={!fetchCode}
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
            value={fetchCode}
            readOnly
            placeholder="Generated fetch code will appear here..."
            className="w-full h-80 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
