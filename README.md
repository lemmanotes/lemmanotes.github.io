# Lemma

Notes on mathematics, physics, and electrical engineering. Built with Astro, deployed to GitHub Pages.

Live: <https://lemmanotes.github.io>

## Stack

- [Astro 6](https://astro.build/) — static site generator
- `remark-math` + `rehype-katex` — LaTeX-style math in Markdown
- Inter + JetBrains Mono (via Google Fonts) — typography
- GitHub Actions + GitHub Pages — deployment

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

Requires Node 22.12 or newer (see `engines` in [package.json](package.json)).

## Adding an article

Create a `.md` or `.mdx` file in [src/content/blog/](src/content/blog/):

```md
---
title: 'Spannungsteiler'
description: 'Warum Spannungsteiler eigentlich Strom-Teiler sind.'
pubDate: '2026-05-30'
draft: false
---

Body text. Inline math with `$\sin^2(x) + \cos^2(x) = 1$`,
block math with `$$ \int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2} $$`.
```

### Frontmatter

The schema lives in [src/content.config.ts](src/content.config.ts):

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Article title |
| `description` | yes | Meta tag + blog index excerpt |
| `pubDate` | yes | `YYYY-MM-DD`; rendered as `DD. Monat YYYY` |
| `updatedDate` | no | Same format |
| `heroImage` | no | Imported from `src/assets/` (processed by Astro) |
| `draft` | no | `true` keeps the post out of the production build but visible in `npm run dev` |

### Drafts

Set `draft: true` to keep an article private:

- `npm run dev` → draft is visible (so you can preview it)
- `npm run build` / GitHub Pages → draft is filtered out of the blog index, RSS feed, and not generated as a page

The filter is implemented in [src/pages/blog/index.astro](src/pages/blog/index.astro), [src/pages/blog/[...slug].astro](src/pages/blog/[...slug].astro), and [src/pages/rss.xml.js](src/pages/rss.xml.js).

## Deployment

Every push to `master` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which runs [`withastro/action@v3`](https://github.com/withastro/action) on Node 22 and publishes `dist/` to GitHub Pages.

To deploy: just push.

```sh
git commit -am "New article: foo"
git push
```

GitHub Pages setting (one-time, already configured): Settings → Pages → Source = "GitHub Actions".

## Project structure

```
.
├── .github/workflows/   CI: deploy.yml
├── public/              Static assets served as-is
│   ├── favicon.ico/.svg Lambda glyph
│   └── og.png           1200x630 social card
├── scripts/             Build-time asset generators
│   ├── build-favicon.mjs   SVG → multi-size ICO
│   └── build-og.mjs        SVG → 1200x630 PNG
├── src/
│   ├── assets/          Images imported by articles
│   ├── components/      BaseHead, Header, Footer, FormattedDate, HeaderLink
│   ├── content/blog/    Markdown/MDX articles
│   ├── layouts/         BlogPost.astro
│   ├── pages/           Routes: /, /about, /blog/, /blog/[slug], /404
│   └── styles/global.css   Single source of truth for all styling
├── astro.config.mjs     Astro config (integrations, fonts, math plugins)
└── package.json
```

All styling lives in [src/styles/global.css](src/styles/global.css). Design tokens (colors, type scale, spacing on an 8 px baseline) are CSS variables on `:root`.

## Regenerating favicon and OG image

The favicon and OG image are PNGs generated from inline SVGs by build scripts. Re-run after changing the source:

```sh
node scripts/build-favicon.mjs   # → public/favicon.ico
node scripts/build-og.mjs        # → public/og.png
```

## Design

The visual system follows the Swiss / International Typographic Style: a single sans-serif (Inter), strict left alignment, baseline grid of 8 px, restrained palette (black `#111`, white `#FFF`, one red accent `#E30613` reserved for links), no shadows, no gradients, no rounded corners.

## License

**Code** (everything outside `src/content/`): [MIT](LICENSE). Copy, modify, learn from it. If you use this setup as a starting point for your own site, no need to credit — though a link back is nice.

**Articles** in `src/content/blog/`: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0). Share them, translate them, build on them, even commercially — just credit Lemma and link back. Republishing is encouraged.
