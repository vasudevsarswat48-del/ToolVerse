"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Zap,
  Clock,
  BookOpen,
} from "lucide-react";

interface Issue {
  id: string;
  type: "spelling" | "grammar" | "style";
  message: string;
  original: string;
  suggestion: string;
}

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Analyze text for metrics and grammar/style issues
  const analyzeText = (input: string) => {
    if (!input.trim()) {
      return {
        words: 0,
        chars: 0,
        sentences: 0,
        readTime: 0,
        issues: [] as Issue[],
      };
    }

    const wordsArray = input.trim().split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const chars = input.length;
    const sentences = (input.match(/[^.!?]+[.!?]+/g) || []).length || (words > 0 ? 1 : 0);
    const readTime = Math.ceil(words / 200); // Avg 200 wpm

    const issues: Issue[] = [];
    let issueIdCounter = 1;

    // Rule 1: Repeated words (e.g., "the the")
    const repeatedWordsRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
    let match;
    while ((match = repeatedWordsRegex.exec(input)) !== null) {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        type: "spelling",
        message: `Repeated word "${match[1]}"`,
        original: match[0],
        suggestion: match[1],
      });
    }

    // Rule 2: Double spaces
    if (/\s{2,}/.test(input)) {
      issues.push({
        id: `issue-${issueIdCounter++}`,
        type: "style",
        message: "Multiple consecutive spaces detected",
        original: "  ",
        suggestion: " ",
      });
    }

    // Rule 3: Uncapitalized sentence starts
    const lowercaseSentenceStart = /(?:^|[.!?]\s+)([a-z])/g;
    while ((match = lowercaseSentenceStart.exec(input)) !== null) {
      const letter = match[1];
      issues.push({
        id: `issue-${issueIdCounter++}`,
        type: "grammar",
        message: `Sentence should begin with a capital letter`,
        original: letter,
        suggestion: letter.toUpperCase(),
      });
    }

    // Rule 4: Overused filler words
    const fillerWords = ["very", "really", "basically", "actually", "literally"];
    fillerWords.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      if (regex.test(input)) {
        issues.push({
          id: `issue-${issueIdCounter++}`,
          type: "style",
          message: `Consider removing or replacing weak filler word "${filler}"`,
          original: filler,
          suggestion: "",
        });
      }
    });

    return { words, chars, sentences, readTime, issues };
  };

  const stats = analyzeText(text);

  const applyFix = (issue: Issue) => {
    if (issue.original === "  ") {
      setText(text.replace(/\s{2,}/g, " "));
    } else if (issue.suggestion === "") {
      const regex = new RegExp(`\\b${issue.original}\\b\\s?`, "i");
      setText(text.replace(regex, ""));
    } else {
      setText(text.replace(issue.original, issue.suggestion));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Grammar & Writing Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setText("")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" /> Clear Text
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {copied ? <Check className="w-3 h-3 text-green-300" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy Fixed Text"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Text Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to check for grammar, spelling, and readability issues..."
              rows={12}
              className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Words</div>
                <div className="text-sm font-bold text-white">{stats.words}</div>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Characters</div>
                <div className="text-sm font-bold text-white">{stats.chars}</div>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Sentences</div>
                <div className="text-sm font-bold text-white">{stats.sentences}</div>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Read Time</div>
                <div className="text-sm font-bold text-white">~{stats.readTime} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Suggestions & Issues Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Suggestions ({stats.issues.length})
            </h3>
            {stats.issues.length === 0 && text.length > 0 && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Good
              </span>
            )}
          </div>

          {!text && (
            <div className="text-center py-8 text-xs text-slate-500">
              Enter text in the editor to inspect recommendations.
            </div>
          )}

          {text && stats.issues.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white">No major issues found!</p>
              <p className="text-slate-500">Your text looks clean and readable.</p>
            </div>
          )}

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {stats.issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-300 font-medium">{issue.message}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded uppercase font-bold shrink-0 ${
                      issue.type === "spelling"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : issue.type === "grammar"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {issue.type}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="font-mono text-slate-400">
                    <span className="line-through text-red-400/80 mr-1.5">{issue.original}</span>
                    <span className="text-emerald-400">{issue.suggestion || "(remove)"}</span>
                  </div>
                  <button
                    onClick={() => applyFix(issue)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-colors text-[11px] font-semibold"
                  >
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
