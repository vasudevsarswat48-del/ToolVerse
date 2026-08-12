'use client';

import { useState } from 'react';
import { Copy, Check, Trash2, Database, Sparkles, Minimize2 } from 'lucide-react';

export default function SqlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Format SQL with keyword capitalization and newlines
  const formatSql = (sql: string) => {
    if (!sql.trim()) return '';

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
      'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
      'OUTER JOIN', 'CROSS JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 
      'SET', 'DELETE', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'UNION', 'ALL'
    ];

    let formatted = sql
      .replace(/\s+/g, ' ')
      .trim();

    // Uppercase key SQL terms dynamically
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword);
    });

    // Add newlines before major clauses
    const newlineKeywords = [
      'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 
      'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
      'OUTER JOIN', 'UNION', 'VALUES', 'SET'
    ];

    newlineKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Format AND / OR onto new indents
    formatted = formatted
      .replace(/\b(AND|OR)\b/g, '\n  $1')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return formatted;
  };

  // Minify SQL to single line
  const minifySql = (sql: string) => {
    if (!sql.trim()) return '';
    return sql.replace(/\s+/g, ' ').trim();
  };

  const handleFormat = (text: string) => {
    setInput(text);
    setOutput(formatSql(text));
  };

  const handleMinify = () => {
    setOutput(minifySql(input));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOutput(formatSql(input))}
            disabled={!input}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Beautify SQL
          </button>
          <button
            onClick={handleMinify}
            disabled={!input}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/80 disabled:opacity-40 transition"
          >
            <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            Minify SQL
          </button>
        </div>

        <button
          onClick={handleClear}
          disabled={!input && !output}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-slate-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Input / Output Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw SQL Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> Raw Query Input
            </label>
            <span className="text-[11px] text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleFormat(e.target.value)}
            placeholder="select u.id, u.name, o.total from users u join orders o on u.id = o.user_id where o.status = 'completed' order by o.total desc..."
            className="w-full h-72 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none transition leading-relaxed"
          />
        </div>

        {/* Formatted Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Formatted Result
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{output.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
              >
                {copied ? (
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
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted SQL output will appear here..."
            className="w-full h-72 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono text-xs resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
