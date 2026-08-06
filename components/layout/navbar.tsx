"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Layers, Grid, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-black/60 backdrop-blur-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-bold shadow-accent transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Tool<span className="text-accent">Verse</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/tools" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
            <Grid className="w-4 h-4 text-gray-400" />
            All Tools
          </Link>
          <Link href="/categories" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
            <Layers className="w-4 h-4 text-gray-400" />
            Categories
          </Link>
          <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
            Blog
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-400 glass-panel hover:text-white transition-all">
            <Search className="w-3.5 h-3.5" />
            <span>Search tools...</span>
            <kbd className="bg-surface-100 text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-surface-border">
              ⌘K
            </kbd>
          </button>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-black/95 backdrop-blur-2xl p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-200 hover:bg-surface-100 rounded-lg"
          >
            Home
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-200 hover:bg-surface-100 rounded-lg"
          >
            All Tools
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-200 hover:bg-surface-100 rounded-lg"
          >
            Categories
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block"
          >
            <Button variant="primary" size="sm" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};