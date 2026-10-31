export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  relatedTools: { name: string; slug: string }[];
  content: string[]; // paragraphs / markdown-ish lines
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-merge-pdf-files-online-free",
    title: "How to Merge PDF Files Online for Free (No Upload Required)",
    description:
      "Learn how to combine multiple PDF files into one document in your browser. Free, private, and without installing software.",
    date: "2026-10-31",
    tags: ["PDF", "How-to"],
    relatedTools: [
      { name: "Merge PDF", slug: "merge-pdf" },
      { name: "Split PDF", slug: "split-pdf" },
      { name: "Compress PDF", slug: "compress-pdf" },
    ],
    content: [
      "Merging PDFs is one of the most searched document tasks on Google. Students combine assignment pages, freelancers join invoices, and offices assemble reports.",
      "With TulEra’s Merge PDF tool, files are processed in your browser using JavaScript. That means the PDFs do not need to be uploaded to a remote server for a basic merge.",
      "## Steps",
      "1. Open the Merge PDF tool on TulEra.",
      "2. Drop two or more PDF files (or browse to select them).",
      "3. Reorder files if needed using the up/down controls.",
      "4. Click Merge and download the combined PDF.",
      "## Tips for smaller files",
      "If the result is large, run Compress PDF afterward. For page ranges only, use Split PDF first, then merge the parts you need.",
      "## Why privacy matters",
      "Many free online converters upload your documents. If a file contains IDs, contracts, or medical data, prefer a client-side tool whenever possible.",
    ],
  },
  {
    slug: "best-free-sip-calculator-india",
    title: "Best Free SIP Calculator for India – Estimate Mutual Fund Returns",
    description:
      "Use a free SIP calculator to project mutual fund corpus from monthly investments, expected return, and time horizon.",
    date: "2026-10-31",
    tags: ["Finance", "India"],
    relatedTools: [
      { name: "SIP Calculator", slug: "sip-calculator" },
      { name: "FD Calculator", slug: "fd-calculator" },
      { name: "Compound Interest", slug: "compound-interest" },
      { name: "PPF Calculator", slug: "ppf-calculator" },
    ],
    content: [
      "A Systematic Investment Plan (SIP) invests a fixed amount every month in mutual funds. Indians search heavily for SIP calculators to plan long-term goals like retirement or education.",
      "TulEra’s SIP calculator runs offline in your browser. Enter monthly amount, expected annual return, and years to see invested amount, gains, and estimated corpus.",
      "## Example",
      "₹5,000 per month for 15 years at an assumed 12% annual return can grow substantially due to compounding. Exact mutual fund returns are not guaranteed—use the calculator for planning scenarios only.",
      "## Related India finance tools",
      "Compare with FD Calculator for fixed deposits, PPF Calculator for public provident fund projections, and EMI Calculator for loans.",
    ],
  },
  {
    slug: "compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Too Much Quality",
    description:
      "Reduce PDF file size in your browser. Practical tips for email limits and uploads while keeping documents readable.",
    date: "2026-10-31",
    tags: ["PDF", "How-to"],
    relatedTools: [
      { name: "Compress PDF", slug: "compress-pdf" },
      { name: "PDF to JPG", slug: "pdf-to-jpg" },
      { name: "Image to PDF", slug: "image-to-pdf" },
    ],
    content: [
      "Email providers and job portals often cap uploads at 2–10 MB. Compressing a PDF solves bounced emails and failed applications.",
      "Open Compress PDF on TulEra, select your file, and download the optimized version. Structural compression works best on text-heavy PDFs.",
      "## If the file is still large",
      "Image-heavy scans need deeper image downsampling. Export pages to JPG at medium quality, then rebuild with Image to PDF if needed.",
      "## Keep a master copy",
      "Always keep the original high-quality PDF. Compress only the shareable copy.",
    ],
  },
  {
    slug: "free-seo-tools-meta-robots-sitemap",
    title: "Free SEO Tools: Meta Tags, robots.txt, Sitemap & SERP Preview",
    description:
      "A practical checklist of free on-page SEO tools—title length, robots.txt, XML sitemaps, schema, and Google result previews.",
    date: "2026-10-31",
    tags: ["SEO", "Web"],
    relatedTools: [
      { name: "Meta Length Checker", slug: "meta-length" },
      { name: "SERP Preview", slug: "serp-preview" },
      { name: "robots.txt Generator", slug: "robots-txt-generator" },
      { name: "Sitemap Generator", slug: "sitemap-generator" },
      { name: "Schema Generator", slug: "schema-generator" },
      { name: "Keyword Density", slug: "keyword-density" },
    ],
    content: [
      "You do not need an expensive suite for basic on-page SEO. Title length, meta descriptions, robots.txt, and sitemaps cover a large share of technical hygiene for small sites.",
      "## Title & description",
      "Keep titles roughly 30–60 characters and meta descriptions around 120–160 characters. Use Meta Length Checker and SERP Preview to see how a result may look.",
      "## robots.txt & sitemap",
      "Generate a robots.txt that allows crawling but blocks private paths. List important URLs in an XML sitemap and submit it in Google Search Console.",
      "## Schema",
      "JSON-LD schema helps search engines understand apps, articles, and FAQs. Use Schema Generator, then validate with Google’s rich results test.",
    ],
  },
  {
    slug: "image-to-pdf-convert-jpg-png",
    title: "Convert JPG & PNG to PDF Free – Multiple Images One File",
    description:
      "Combine photos and scans into a single PDF. Ideal for forms, ID copies, and assignments—processed in your browser.",
    date: "2026-10-31",
    tags: ["PDF", "Image"],
    relatedTools: [
      { name: "Image to PDF", slug: "image-to-pdf" },
      { name: "PDF to JPG", slug: "pdf-to-jpg" },
      { name: "PNG to JPG", slug: "png-to-jpg" },
      { name: "Image Compressor", slug: "image-compressor" },
    ],
    content: [
      "Converting images to PDF is a top search query worldwide. Use Image to PDF on TulEra: add JPG, PNG, or WebP files, reorder pages, choose A4 or fit-to-image, and download.",
      "Compress images first if you need a smaller PDF for email. To go the other way, use PDF to JPG to export pages as images.",
    ],
  },
  {
    slug: "gst-calculator-india-add-remove",
    title: "GST Calculator India – Add or Remove 5%, 12%, 18%, 28%",
    description:
      "Quick GST inclusive and exclusive price calculations for Indian businesses and freelancers.",
    date: "2026-10-31",
    tags: ["Finance", "India"],
    relatedTools: [
      { name: "GST Calculator", slug: "gst-calculator" },
      { name: "Invoice Generator", slug: "invoice-generator" },
      { name: "Percentage Calculator", slug: "percentage-calculator" },
    ],
    content: [
      "Goods and Services Tax rates in India commonly include 5%, 12%, 18%, and 28% slabs. Freelancers and small sellers often need to convert between base amount and GST-inclusive price.",
      "Use the GST Calculator to add tax on top of a net amount or extract GST from a gross total. Pair it with Invoice Generator when creating client bills.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
