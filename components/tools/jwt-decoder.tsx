'use client';

import { useState } from 'react';
import { Copy, Check, Trash2, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function JwtDecoderTool() {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [tokenStatus, setTokenStatus] = useState<{ expired: boolean; expDate: string } | null>(null);
  
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const base64UrlDecode = (str: string) => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    const binaryString = atob(output);
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const handleDecode = (token: string) => {
    setJwt(token);
    setError('');
    setTokenStatus(null);

    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setSignature('');
      return;
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A valid JWT contains 3 dot-separated parts.');
      setHeader('');
      setPayload('');
      setSignature('');
      return;
    }

    try {
      const decodedHeader = base64UrlDecode(parts[0]);
      const parsedHeader = JSON.parse(decodedHeader);
      setHeader(JSON.stringify(parsedHeader, null, 2));
    } catch {
      setError('Failed to parse JWT Header.');
      return;
    }

    try {
      const decodedPayload = base64UrlDecode(parts[1]);
      const parsedPayload = JSON.parse(decodedPayload);
      setPayload(JSON.stringify(parsedPayload, null, 2));

      // Expiration check
      if (parsedPayload && typeof parsedPayload.exp === 'number') {
        const expTime = parsedPayload.exp * 1000;
        const isExpired = Date.now() >= expTime;
        setTokenStatus({
          expired: isExpired,
          expDate: new Date(expTime).toLocaleString(),
        });
      }
    } catch {
      setError('Failed to parse JWT Payload.');
      return;
    }

    setSignature(parts[2]);
  };

  const handleCopy = async (text: string, type: 'header' | 'payload') => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    if (type === 'header') {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleClear = () => {
    setJwt('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError('');
    setTokenStatus(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          {tokenStatus ? (
            tokenStatus.expired ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-3.5 h-3.5" /> Token Expired ({tokenStatus.expDate})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Token Active (Expires: {tokenStatus.expDate})
              </span>
            )
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Client-side local parsing (Safe & Private)
            </span>
          )}
        </div>

        <button
          onClick={handleClear}
          disabled={!jwt}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-slate-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encoded JWT Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Encoded JWT
            </label>
            <span className="text-[11px] text-slate-500">{jwt.length} chars</span>
          </div>
          <textarea
            value={jwt}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="Paste your JWT token here (eyJhbGciOi...)"
            className="w-full h-[450px] bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed break-all"
          />
        </div>

        {/* Decoded Header & Payload Output */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Header (Algorithm & Type)
              </label>
              <button
                onClick={() => handleCopy(header, 'header')}
                disabled={!header}
                className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-40 transition"
              >
                {copiedHeader ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={header}
              readOnly
              placeholder="Header JSON will appear here..."
              className="w-full h-36 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-rose-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none"
            />
          </div>

          {/* Payload */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Payload (Data Claims)
              </label>
              <button
                onClick={() => handleCopy(payload, 'payload')}
                disabled={!payload}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={payload}
              readOnly
              placeholder="Payload JSON will appear here..."
              className="w-full h-56 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none"
            />
          </div>
        </div>
      </div>

      {/* Signature info or error banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {signature && !error && (
        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg text-slate-400 text-xs font-mono truncate">
          <span className="text-slate-500 font-sans font-semibold mr-2 uppercase">Signature:</span>
          {signature}
        </div>
      )}
    </div>
  );
}
