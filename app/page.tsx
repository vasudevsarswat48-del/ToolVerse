import Link from "next/link";
import { ALL_TOOLS } from "@/lib/constants/tools";
import { ArrowRight, Zap, ShieldCheck, Cpu, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-400/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Hero Banner Section with Prominent Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            Next-Gen Developer & Document Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] leading-[1.15]">
            <span className="font-[family-name:var(--font-cursive)] text-6xl sm:text-8xl lg:text-9xl bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent block pb-2">
              TOOLINGO
            </span>
            <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Empowering Your Digital Workflow
            </span>
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Section Header */}
        <div id="tools" className="flex items-center justify-between mb-8 border-b border-slate-800/80 pb-4">
          <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            Explore Utility Suite ({ALL_TOOLS.length})
          </h2>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Select a tool to launch</span>
        </div>

        {/* Tools Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {ALL_TOOLS.map((tool, idx) => (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              className="group relative p-7 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-inner group-hover:scale-110 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all duration-300">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>

                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-white group-hover:text-cyan-400 transition-colors duration-200">
                  {tool.name}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors duration-200">
                <span>Access Tool</span>
                <span className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottommost Section: Detailed description & Feature boxes */}
        <div className="border-t border-slate-800/80 pt-16 pb-12 text-center max-w-4xl mx-auto space-y-10">
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed font-normal">
            An elite collection of lightning-fast developer utilities, data formatters, and precision document tools engineered for peak performance.
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

      </div>
    </div>
  );
}
