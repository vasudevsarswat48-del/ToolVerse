import type { Metadata } from "next";
import { Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/layout/footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cursiveScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "Toolingo - Tools Collection",
  description: "High-performance developer utilities and document tools.",
  openGraph: {
    siteName: "Toolingo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cursiveScript.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RJKRWDKRFV"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RJKRWDKRFV');
            `,
          }}
        />
        <meta name="google-site-verification" content="qSYK01XMzgnj8mqTSpttWAPSK8jzxe8_x7EWCZ25SVE" />
        <meta property="og:site_name" content="Toolingo" />
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
      </head>
      <body className="font-sans antialiased bg-[#070913] text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
