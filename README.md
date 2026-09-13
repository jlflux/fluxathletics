# Flux Athletics — website

Marketing site for Flux Athletics: the **Athletics Command Center**, the
**Broadcaster's Toolkit**, and sports marketing / media / event management
**consulting**.

Static HTML, CSS and JavaScript with **zero npm dependencies**, plus a built-in
admin for editing every word on the site.

---

## The short version

- **To change site content:** open `/admin.html`, edit, hit **Publish**.
- **To change layout or styling:** edit `assets/css/styles.css` or
  `tools/templates.js`, then `npm run build`.

---

## How it fits together

```
content.json        ← every word, link, colour and meta tag on the site
      │
      ├── tools/templates.js   turns content.json into HTML
      │         │
      │         ├── tools/build.js  (Node)    → writes the .html files
      │         └── admin.html      (browser) → live preview + publish
      │
      └── the committed .html files are what actually gets served
```

`tools/templates.js` is deliberately dependency-free and runs in both Node and
the browser. That is what lets the admin publish finished HTML without a build
server — and it means a publish from the admin produces byte-identical output
to `npm run build`.

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
| `admin.html` | Content editor (see below) |

`robots.txt` and `sitemap.xml` are generated too, so the domain only has to be
set in one place.

---

## The admin

Open `/admin.html` on the live site, or locally with `npm run serve` →
<http://localhost:8080/admin.html>.

**What you can change:** everything in `content.json` — headlines, body copy,
button labels, link targets, nav items, list items, FAQ entries, form dropdown
options, brand colours, page titles and meta descriptions, the footer.

The form is generated from the shape of `content.json`, so anything you add to
that file automatically becomes editable — no admin code to update.

**What it does not change:** page structure and styling. Reordering whole
sections or changing how a section looks is a code edit in
`tools/templates.js` / `assets/css/styles.css`.

### Features

- Live preview at real desktop (1280px) and mobile (390px) widths
- Add, remove and reorder any repeatable item
- Brand colour pickers that apply across every page
- Drafts autosave to your browser, so a closed tab does not lose work
- **Publish** commits `content.json` and every regenerated file to GitHub in a
  single commit; your host redeploys from there
- **Download JSON** / **Import** as a no-account fallback or backup

### Publishing setup

Publish needs a GitHub token. Create a
[fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
scoped to **only this repository**, with **Contents: Read and write** and
nothing else.

> **Read this before ticking "Remember this token".**
> `admin.html` is a static file, so it is publicly reachable on your live
> site — anyone who guesses the URL can open it. That on its own is harmless:
> without a token it can only edit a local draft that goes nowhere. A
> *remembered* token, though, sits in that browser's storage. Only save it on a
> machine that is yours alone, and revoke the token in GitHub if you lose the
> device. Leaving the box unticked and pasting the token each time is the safer
> default.
>
> If you want the page itself locked down, both Vercel and Cloudflare Pages can
> password-protect a single path — worth doing if the site is public.

The publish target lives in `content.json` under `repo`
(`owner` / `name` / `branch`), editable from the admin's **Publishing target**
section. Point `branch` at whichever branch your host deploys.

---

## Editing in code

**Colours, type and spacing** are tokens at the top of `assets/css/styles.css`.
The four brand colours are overridden per-page by a small `#brand-tokens`
block generated from `content.json`, so the admin can change them — edit them
there, or in the admin, rather than in the stylesheet.

```json
"brand": {
  "primary": "#0DF786",   // buttons, CTA band, Command Center
  "support": "#889165",   // Broadcaster's Toolkit, Consulting
  "ink":     "#0B0B0C",   // dark background
  "paper":   "#F5F3EF"    // light sections
}
```

Accent colours used as text on light backgrounds are auto-darkened with
`color-mix()`, so they stay legible whatever you pick.

`npm run build` refuses to run if `content.json` has a blank string or an empty
list, which is almost always a mis-keyed edit that would silently render an
empty section.

---

## Deploying

The generated HTML is committed, so the site works on any static host even with
no build step. Running the build is still worth it — it guarantees the HTML can
never drift from `content.json`.

- **Vercel** — `vercel.json` is already configured (build `node tools/build.js`,
  output `.`, install skipped since there are no dependencies).
- **Cloudflare Pages** — build command `node tools/build.js`, output directory
  `/`, no install command needed.
- **Netlify** — build `node tools/build.js`, publish directory `.`.
- **GitHub Pages / any web server** — serve the repo root as-is.

## Local preview

```bash
npm run serve    # → http://localhost:8080
```

## Optional tooling

Needs `npm i -D playwright` first — deliberately not a dependency of the site,
so no host's install step can fail on it.

| Command | What it does |
|---|---|
| `npm run build` | Regenerates every page from `content.json` |
| `npm run serve` | Local static server on :8080 |
| `npm run og` | Re-renders `assets/img/og.png` (the social share card) |
| `npm run fonts` | Re-downloads the woff2 subsets and rewrites `assets/css/fonts.css` |
| `npm run shots` | Screenshots every page at desktop and mobile into `.shots/` |

`og.png` is a rendered image, so it is the one thing the admin cannot update —
re-run `npm run og` after changing brand colours.

---

## Contact form

As shipped, the form opens the visitor's email client with their answers
pre-filled. It needs no backend and works immediately.

To collect submissions properly, set **Contact → Contact form → Form endpoint
URL** in the admin (or `contact.form.action` in `content.json`) to a Formspree,
Basin, Netlify Forms or custom endpoint. `assets/js/main.js` detects it and
POSTs in the background instead, showing a success message in place.

## Still to do before launch

- [ ] Point `site.domain` at your real domain (feeds canonical, OG, sitemap, robots).
- [ ] Replace `hello@fluxathletics.com` with your real address.
- [ ] Confirm the Broadcaster's Toolkit compatibility list matches what you
      actually support — it is flagged in `content.json` under
      `toolkit.compat.note`.
- [ ] Replace the About page's team block with your real story — flagged under
      `about.team.note`.
- [ ] Wire up the contact form endpoint.

## Fonts

Archivo (display) and Inter (body), self-hosted as latin / latin-ext woff2
subsets under `assets/fonts/`. Both are licensed under the SIL Open Font
License 1.1, which permits redistribution this way. Nothing is fetched from
Google at runtime.

## Browser support

Evergreen Chrome, Firefox, Safari and Edge. Uses `clamp()`, CSS custom
properties, `color-mix()`, `grid-template-rows` transitions and
`IntersectionObserver`. Respects `prefers-reduced-motion`. The site is fully
readable with JavaScript disabled — only the reveal animations, mobile drawer
and marquee need it.
