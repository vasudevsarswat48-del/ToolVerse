import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#070913]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with Cursive Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/favicon.svg"
            alt="Toolingo"
            className="w-11 h-11 rounded-2xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform"
          />
          <span className="text-3xl font-bold font-[family-name:var(--font-cursive)] bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Toolingo
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <Link href="#tools" className="hover:text-cyan-400 transition-colors">All Tools</Link>
        </nav>
      </div>
    </header>
  );
}
