import React from "react";

export const metadata = {
  title: "Terms of Service | Toolingo",
  description: "Read the terms and conditions for using Toolingo's developer and document tools.",
};

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: September 11, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using Toolingo, you agree to be bound by these Terms of Service. All 63 tools offered across PDF manipulation, web utilities, formatting, and mathematical calculations are provided subject to your compliance with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">2. Disclaimer of Warranties ("As-Is")</h2>
          <p>
            Toolingo and its suite of utilities are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied. While we strive for accuracy, Toolingo does not warrant that tool outputs, calculations, or file conversions are entirely error-free or uninterrupted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">3. User Responsibility</h2>
          <p>
            You are solely responsible for reviewing and verifying the accuracy of all files, documents, and code generated using Toolingo before using them for commercial, legal, financial, or personal purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p>
            In no event shall Toolingo or its operators be held liable for any damages or losses arising from the use or inability to use our tools and website.
          </p>
        </section>
      </div>
    </main>
  );
}
