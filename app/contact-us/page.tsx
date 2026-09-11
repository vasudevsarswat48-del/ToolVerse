"use client";

import React, { useState } from "react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect to your email API endpoint here (e.g. Resend, Nodemailer, or Formspree)
    setSubmitted(true);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
        Have questions, feature requests, or bug reports? Send us a message or contact us directly at{" "}
        <a href="mailto:support@toolingo.com" className="text-blue-600 underline">
          support@toolingo.com
        </a>.
      </p>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500 text-emerald-800 dark:text-emerald-200 p-4 rounded-lg">
          Thank you for getting in touch! We will respond as soon as possible.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Your Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="How can we help?"
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message..."
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Send Message
          </button>
        </form>
      )}
    </main>
  );
}
