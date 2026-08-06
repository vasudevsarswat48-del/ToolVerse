import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-surface-border py-8 px-4 bg-black/40 backdrop-blur-md text-gray-400 text-sm mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-semibold text-white">ToolVerse</span>
        </div>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} ToolVerse. Built with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};