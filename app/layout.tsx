import type { Metadata } from "next";
import { Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cursiveScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "ToolVerse Collection",
  description: "High-performance developer utilities and document tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cursiveScript.variable}`}>
      <head>
   <meta name="google-site-verification" content="qSYK0lXMzgnj8mqTSpttWAPSK8jzxe8_x7EWCZ25SVE" />
  </head>
      <body className="font-sans antialiased bg-[#070913] text-slate-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
