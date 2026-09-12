"use client";

import React, { useState } from "react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-slate-200">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-sm text-slate-400 mb-8">
        Have questions or feedback? Contact us directly at{" "}
        <a href="mailto:vasudevsarswat48@gmail.com" className="text-blue-400 underline">
         Our Mail 
        </a>.
      </p>

      {submitted ? (
        <div className="bg-emerald-950/50 border border-emerald-500 text-emerald-200 p-4 rounded-lg">
          Thank you for getting in touch! Your message has been sent to us.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Required for Netlify Form Matching */}
          <input type="hidden" name="form-name" value="contact" />

          <div>
            <label className="block text-xs font-medium mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full px-3 py-2 border rounded-md bg-slate-900 border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              required
              placeholder="How can we help?"
              className="w-full px-3 py-2 border rounded-md bg-slate-900 border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Write your message..."
              className="w-full px-3 py-2 border rounded-md bg-slate-900 border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </main>
  );
}
