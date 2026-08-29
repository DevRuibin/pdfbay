# PDFBay

**Free, private PDF tools — 100% in your browser.**

PDFBay is a privacy-first PDF toolkit with 100+ tools: merge, split, compress,
convert to/from images, add watermarks, edit, sign, OCR, and much more. Every
file is processed locally on your device — nothing is ever uploaded to a
server.

This project is a modernized fork of [BentoPDF](https://github.com/alam00000/bentopdf)
(a privacy-first PDF toolkit). It is licensed under the
[GNU Affero General Public License v3.0](LICENSE).

## ✨ Features

- 🧩 **Merge & split** PDFs, reorder, rotate, delete, extract pages
- 🗜️ **Compress** PDFs (multiple compression levels, up to ~90% smaller)
- 🖼️ **Convert** PDF ⇄ JPG / PNG / BMP / WEBP / TIFF / SVG and Office ⇄ PDF
- 💧 **Watermark**, header/footer, page numbers, Bates numbering, stamps
- ✍️ **Edit & sign** — text editing, form filling, digital signatures
- 🔒 **Security** — encrypt, decrypt, redact, sanitize, permissions
- 🔍 **OCR** (Tesseract.js), table extraction, PDF ⇄ Excel / Word / Markdown
- 🌍 **21 languages**, works offline (PWA), keyboard shortcuts
- 🚫 No signups, no uploads, no limits, no tracking

## 🚀 Quick start (local)

```bash
npm install
npm run dev        # development server
npm run build      # production build → dist/
```

Optional build-time environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_BRAND_NAME` | Brand name shown in the UI |
| `VITE_BRAND_LOGO` | Logo path (relative to `public/`) |
| `VITE_FOOTER_TEXT` | Footer copyright line |
| `SITE_URL` | Canonical URL used for sitemap / SEO |
| `SIMPLE_MODE` | `true` renders a minimal single-page UI |
| `DISABLE_GITHUB_STARS` | `true` hides the GitHub star counter |

## ☁️ Deploy to Cloudflare (free)

The build output in `dist/` is a fully static site — it deploys to Cloudflare
Pages or a Cloudflare Worker (static assets) with no server required.

```bash
npm install
SITE_URL=https://your-domain npm run build
npx wrangler pages deploy dist --project-name pdfbay
# or: npx wrangler deploy   (with assets = { directory = "dist" } in wrangler.toml)
```

Advanced features (OCR, PDF editing engine, Ghostscript) load WASM modules
from a CDN by default; for air-gapped hosting point the `VITE_WASM_*` variables
at your own CDN. See `STATIC-HOSTING.md` and `cloudflare/` for details.

## 🧰 Tech stack

Vite 8 · TypeScript · Tailwind CSS 4 · pdf-lib · PDF.js · pdfium (WASM) ·
Tesseract.js · qpdf (WASM)

## 📄 License

[AGPL-3.0](LICENSE) — this project is a fork of BentoPDF
(https://github.com/alam00000/bentopdf), also AGPL-3.0, with its copyright
notice preserved in the license and source headers. Redistributions must keep
this license and attribution.
