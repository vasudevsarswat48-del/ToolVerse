import React from "react";

export const metadata = {
  title: "Privacy Policy | Toolingo",
  description: "Learn how Toolingo respects your privacy with browser-based processing.",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: September 11, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">1. Client-Side Processing</h2>
          <p>
            At Toolingo, accessible from toolingo.com, we prioritize user privacy. Most of our 63 web tools execute directly in your web browser using client-side WebAssembly and JavaScript. We do not store, upload, or process your files or text inputs on external servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">2. Cookies and Analytics</h2>
          <p>
            Toolingo uses standard third-party services like Google Analytics and Google AdSense to analyze site traffic and present advertisements. These services may place and read cookies on your browser or use web beacons to gather non-personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">3. Third-Party Advertising</h2>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
          </p>
          <p className="mt-2">
            Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Ads Settings</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">4. Contact Information</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>Our Mail</strong>
          </p>
        </section>
      </div>
    </main>
  );
}
