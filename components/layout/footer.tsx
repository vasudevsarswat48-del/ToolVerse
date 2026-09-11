import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="border-t border-surface-border py-8 px-4 bg-black/40 backdrop-blur-md text-gray-400 text-sm mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section: Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Image src="/favicon.svg" alt="Toolingo" width={16} height={16} className="w-8 h-8" />
            <span className="font-semibold text-white">Toolingo</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Toolingo. All rights reserved.
          </p>
        </div>

        {/* Right Section: Legal & Info Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-gray-400">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/about-us" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/contact-us" className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};
