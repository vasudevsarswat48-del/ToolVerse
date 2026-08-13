"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_TOOLS } from "@/lib/constants/tools";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  Search,
  MessageSquare,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Feedback Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return ALL_TOOLS;
    const q = searchQuery.toLowerCase();
    return ALL_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !feedback.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "2f04d9ca-6ee6-414d-8dd9-1161cb853ad4", // 👈 PASTE YOUR KEY HERE
          name: name,
          email: email,
          message: feedback,
          subject: `New ToolVerse Feedback from ${name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setFeedback("");
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Failed to submit feedback. Please check your network.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Hero Banner Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            Next-Gen Developer & Document Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] leading-[1.1]">
            <span className="font-[family-name:var(--font-cursive)] text-6xl sm:text-8xl lg:text-9xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent block mb-2">
              TOOLINGO
            </span>
            <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Empowering Your Digital Workflow
            </span>
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Section Header with Search Box */}
        <div id="tools" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Explore Utility Suite ({filteredTools.length})
            </h2>

            {/* Search Input Box */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-500 rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Select a tool to launch
          </span>
        </div>

        {/* Tools Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredTools.map((tool, idx) => (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              className="group relative p-7 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-tr-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>

                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-white group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Access Tool</span>
                <span className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}

          {filteredTools.length === 0 && (
            <p className="text-sm text-slate-500 col-span-full py-12 text-center">
              No tools matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Feature Highlights Section */}
        <div className="border-t border-slate-800/80 pt-16 text-center max-w-4xl mx-auto space-y-10">
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed font-normal">
            An elite collection of lightning-fast developer utilities, data formatters, and precision document tools engineered for peak productivity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-3 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200">Instant Client Execution</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200">100% Secure & Private</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200">Zero Server Latency</span>
            </div>
          </div>
        </div>

        {/* Interactive Feedback Section */}
        <div className="mt-20 pt-10 border-t border-slate-800/80 max-w-2xl mx-auto">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-outfit)]">
                Have Feedback or Tool Suggestions?
              </h3>
              <p className="text-xs text-slate-400">
                Send us a direct message and we'll reply to your email.
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-4 rounded-xl text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Your message has been sent to our email.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-500 text-xs rounded-xl p-3 outline-none transition-colors"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-500 text-xs rounded-xl p-3 outline-none transition-colors"
                    required
                  />
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your feedback, report an issue, or request a new feature..."
                  rows={4}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-500 text-xs rounded-xl p-3 outline-none transition-colors resize-none"
                  required
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSending ? "Sending Message..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
