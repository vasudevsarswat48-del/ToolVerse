# TulEra (toolingo)

Free browser-based tools for PDF, finance, SEO, images, and developers.  
Built with **Vite + React + TypeScript**. Static output for **Netlify** or **Vercel**.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
# output in dist/
```

## Deploy

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects already in `netlify.toml` and `public/_redirects`

### Vercel
- Framework: Vite
- `vercel.json` rewrites all routes to `index.html`

## After deploy (SEO / AdSense)

1. Google Search Console → add property → submit `https://YOUR_DOMAIN/sitemap.xml`
2. Confirm `https://YOUR_DOMAIN/ads.txt` is reachable
3. AdSense → replace `AdSlot` placeholders with real ad units
4. Update canonical URL in `index.html` if the live domain is not `toolingo.netlify.app`

## Stack

- React Router (client routes `/tool/:slug`, `/blog/:slug`)
- pdf-lib + pdfjs-dist for PDF tools
- No backend required for core tools
