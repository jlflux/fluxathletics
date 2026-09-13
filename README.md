# Flux Athletics — website

Marketing site for Flux Athletics: the **Athletics Command Center**, the
**Broadcaster's Toolkit**, and sports marketing / media / event management
**consulting**.

Plain static HTML, CSS and JavaScript. **No build step, no framework, no
runtime dependencies.** Upload the folder to any host and it works.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, the three offerings, product previews, process |
| `command-center.html` | Athletics Command Center — problem, modules, rollout, FAQ |
| `broadcasters-toolkit.html` | Broadcaster's Toolkit — the kit, compatibility, delivery |
| `consulting.html` | Consulting — practice areas, engagement models, process |
| `about.html` | About — positioning and principles |
| `contact.html` | Contact — form and details |
| `404.html` | Not found |

Supporting files: `robots.txt`, `sitemap.xml`, `assets/`.

## Structure

```
assets/
  css/styles.css     design tokens + all styling (single file, sectioned)
  css/fonts.css      self-hosted @font-face rules (generated)
  fonts/*.woff2      Archivo + Inter subsets (self-hosted, no Google calls)
  js/main.js         nav, scroll reveal, marquee, accordions, form
  img/favicon.svg    site icon
  img/og.png         1200x630 social share card (generated)
tools/               optional local tooling — not needed to run the site
```

## Editing

**Colours, type and spacing** live in one place: the `:root` block at the top of
`assets/css/styles.css`.

```css
--flux:  #FF5A1F;   /* primary accent — Command Center, buttons, CTA band */
--volt:  #3DE1FF;   /* secondary — Broadcaster's Toolkit */
--field: #B8FF3C;   /* tertiary — Consulting */
--ink:   #0B0B0C;   /* page background */
--paper: #F5F3EF;   /* light sections */
```

Change one of those and it updates everywhere.

**Copy** is edited directly in the `.html` files. The header and footer are
repeated on each page, so if you change a nav link, change it on all seven — or
use the optional generator (below), which keeps them in sync for you.

Sections marked `<!-- EDIT ME -->` in the HTML are deliberately generic and
should be replaced with your real details.

## Contact form

As shipped, the form opens the visitor's email client with their answers
pre-filled. It needs no backend and works immediately.

To collect submissions properly, put a form endpoint in the `action` attribute
in `contact.html`:

```html
<form class="form" data-contact-form action="https://formspree.io/f/YOUR_ID" method="post" ...>
```

`assets/js/main.js` detects the endpoint and POSTs to it in the background,
showing a success message in place. Formspree, Basin, Netlify Forms and your own
handler all work — anything that accepts a `multipart/form-data` POST and returns
2xx.

## Before going live

- [ ] Replace `hello@fluxathletics.com` with your real address (set once in
      `tools/shell.js` and run `npm run build`, or find-and-replace the HTML).
- [ ] Set your real domain in `robots.txt`, `sitemap.xml`, and the `canonical`
      and `og:url` tags in each page's `<head>`.
- [ ] Confirm the Broadcaster's Toolkit compatibility list in
      `broadcasters-toolkit.html` matches what you actually support today — it is
      marked with a `<!-- NOTE -->` comment.
- [ ] Fill in the `<!-- EDIT ME -->` sections on `about.html` and `contact.html`.
- [ ] Wire up the contact form endpoint (above).

## Deploying

Any static host. No build command, publish directory is the repo root.

- **Netlify / Vercel / Cloudflare Pages** — connect the repo, leave the build
  command empty, set the output directory to `/`.
- **GitHub Pages** — Settings → Pages → deploy from branch, root folder.
- **Any web server** — copy the files into the web root.

## Local preview

```bash
npm install      # only needed for the optional tooling below
npm run serve    # → http://localhost:8080
```

Or open `index.html` directly in a browser — everything works from `file://`
except the self-hosted font preloads.

## Optional tooling

These regenerate committed assets. You never need them to run or deploy the site.

> **On `npm run build`:** the committed `.html` files are the real deliverable.
> The generator exists only so the header, footer and `<head>` tags live in one
> place instead of seven. If you hand-edit the HTML and then run `build`, your
> edits are overwritten — so pick one way of working and stick to it.

| Command | What it does |
|---|---|
| `npm run serve` | Local static server on :8080 |
| `npm run build` | Regenerates the `.html` files from `tools/shell.js` + `tools/pages/` |
| `npm run og` | Re-renders `assets/img/og.png` from `tools/og-card.html` |
| `npm run fonts` | Re-downloads the woff2 subsets and rewrites `assets/css/fonts.css` |
| `npm run shots` | Screenshots every page at desktop and mobile into `.shots/` |

`og` and `shots` need Chromium; set `CHROME_BIN` if Playwright's own download
isn't available.

## Fonts

Archivo (display) and Inter (body), self-hosted as latin / latin-ext woff2
subsets under `assets/fonts/`. Both are licensed under the SIL Open Font
License 1.1, which permits redistribution this way. Nothing is fetched from
Google at runtime.

## Browser support

Evergreen Chrome, Firefox, Safari and Edge. Uses `clamp()`, CSS custom
properties, `grid-template-rows` transitions and `IntersectionObserver`.
Respects `prefers-reduced-motion`. The site is fully readable with JavaScript
disabled — only the reveal animations, mobile drawer and marquee need it.
