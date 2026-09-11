import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us | Toolingo",
  description: "Learn about Toolingo - a suite of 63 fast, privacy-first web utilities.",
};

export default function AboutUs() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-6">About Toolingo</h1>
      
      <div className="space-y-6 text-sm leading-relaxed">
        <p className="text-base text-slate-700 dark:text-slate-300">
          <strong>Toolingo</strong> is a comprehensive, privacy-first suite of 63 lightning-fast web tools designed for developers, designers, students, and professionals.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2">Why Toolingo?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Client-Side Security:</strong> Your files and data never leave your web browser. File conversions, PDF editing, and calculations happen on your local device.</li>
          <li><strong>Zero Installation required:</strong> Access powerful tools instantly without installing plugins or software.</li>
          <li><strong>Optimized Performance:</strong> Lightweight design engineered for maximum loading speed and low resource consumption.</li>
        </ul>

        <p className="pt-4">
          Have feedback or want to suggest a new tool? Feel free to reach out to our team on our{" "}
          <Link href="/contact-us" className="text-blue-600 hover:underline">
            Contact Page
          </Link>.
        </p>
      </div>
    </main>
  );
}
