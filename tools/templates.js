/* Flux Athletics — page templates.
   Pure functions: content object in, HTML strings out. No Node APIs, no DOM,
   so the same file runs in tools/build.js AND in the browser inside admin.html.
   That is what lets the admin publish finished HTML without a build server. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FluxTemplates = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- helpers ---------- */
  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const br = (v) => esc(v).replace(/\n/g, '<br>');
  const attr = (v) => esc(v);
  const list = (arr) => Array.isArray(arr) ? arr : [];

  const ARROW = '<svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const MARK = (cls) => `<svg class="${cls || 'brand__mark'}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path class="b1" d="M16 5h20l-4 8H12z"/><path class="b2" d="M12 16h20l-4 8H8z"/><path class="b3" d="M8 27h10l-4 8H4z"/></svg>`;

  const btn = (b, extra) => {
    const style = (b && b.style) || 'primary';
    const cls = 'btn' + (style === 'ghost' ? ' btn--ghost' : '') + (extra ? ' ' + extra : '');
    return `<a class="${cls}" href="${attr(b.href)}">${esc(b.label)} ${ARROW}</a>`;
  };

  const link = (label, href) =>
    `<a class="link" href="${attr(href)}">${esc(label)} ${ARROW}</a>`;

  /* A theme name maps to the accent token a section or card uses. */
  const accentVar = (theme) => theme === 'support' ? 'var(--volt)' : 'var(--flux)';
  const sectionAccent = (theme) => theme === 'support' ? ' style="--accent: var(--volt)"' : '';

  /* ---------- shared chrome ---------- */
  function brandTokens(brand) {
    const b = brand || {};
    return `<style id="brand-tokens">:root{` +
      `--flux:${attr(b.primary || '#0DF786')};` +
      `--volt:${attr(b.support || '#889165')};` +
      `--field:${attr(b.support || '#889165')};` +
      `--ink:${attr(b.ink || '#0B0B0C')};` +
      `--paper:${attr(b.paper || '#F5F3EF')};` +
      `}</style>`;
  }

  function head(c, page, meta) {
    const site = c.site || {};
    const domain = String(site.domain || '').replace(/\/$/, '');
    const url = domain + '/' + (page === 'home' ? '' : page + '.html');
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${attr(meta.description)}">
<link rel="canonical" href="${attr(url)}">
<meta name="theme-color" content="${attr((c.brand || {}).ink || '#0B0B0C')}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:title" content="${attr(meta.title)}">
<meta property="og:description" content="${attr(meta.description)}">
<meta property="og:url" content="${attr(url)}">
<meta property="og:image" content="${attr(domain)}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(meta.title)}">
<meta name="twitter:description" content="${attr(meta.description)}">

<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/favicon.svg">

<link rel="preload" href="assets/fonts/archivo-800-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/styles.css">
${brandTokens(c.brand)}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
  }

  function brandBlock(c) {
    const s = c.site || {};
    return `<a class="brand" href="index.html" aria-label="${attr(s.name)} — home">
      ${MARK()}
      <span class="brand__word">${esc(s.wordmarkBold)} <span>${esc(s.wordmarkLight)}</span></span>
    </a>`;
  }

  function header(c, page) {
    const nav = list(c.nav);
    const cta = (c.site || {}).ctaLabel || 'Book a call';
    return `<header class="header">
  <div class="header__inner">
    ${brandBlock(c)}

    <nav class="nav" aria-label="Primary">
      ${nav.map(n => `<a class="nav__link" href="${attr(n.href)}"${n.href === page + '.html' ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n      ')}
    </nav>

    <div class="header__cta">
      <a class="btn" href="contact.html">${esc(cta)} ${ARROW}</a>
    </div>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle menu">
      <span></span>
    </button>
  </div>
</header>

<div class="mobile-nav" id="mobile-nav">
  <nav class="mobile-nav__list" aria-label="Mobile">
    ${nav.map(n => `<a href="${attr(n.href)}">${esc(n.label)} <span>${esc(n.num)}</span></a>`).join('\n    ')}
  </nav>
  <div class="mobile-nav__foot">
    <a class="btn" href="contact.html">${esc(cta)} ${ARROW}</a>
  </div>
</div>
`;
  }

  function footer(c) {
    const f = c.footer || {};
    const email = (c.site || {}).email || '';
    return `<footer class="footer">
  <div class="shell">
    <div class="footer__top">
      <div>
        ${brandBlock(c)}
        <p class="footer__word" style="margin-top:1.5rem">${esc(f.word)}</p>
      </div>

      ${list(f.columns).map(col => `<div class="footer__col">
        <h4>${esc(col.title)}</h4>
        <ul>
          ${list(col.links).map(l => `<li><a href="${attr(l.href)}">${esc(l.label)}</a></li>`).join('\n          ')}
        </ul>
      </div>`).join('\n\n      ')}
    </div>

    <div class="footer__bottom">
      <p>&copy; <span data-year>2026</span> ${esc((c.site || {}).name)}. ${esc(f.legal)}</p>
      <p><a href="mailto:${attr(email)}">${esc(email)}</a></p>
    </div>
  </div>
</footer>

<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
  }

  function ctaBand(c, cta) {
    return `<section class="cta-band">
  ${MARK('cta-band__mark')}
  <div class="shell cta-band__inner">
    <div data-reveal>
      <h2>${br(cta.title)}</h2>
      <p>${esc(cta.body)}</p>
    </div>
    <div data-reveal>
      <a class="btn" href="contact.html">${esc(cta.label)} ${ARROW}</a>
    </div>
  </div>
</section>
`;
  }

  /* ---------- shared section pieces ---------- */
  const marquee = (items) => `<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    ${list(items).map(i => `<span class="marquee__item">${esc(i)}</span>`).join('\n    ')}
  </div>
</div>
`;

  const steps = (s, light) => `<section class="section${light ? ' panel--light' : ''}">
  <div class="shell">
    <div class="sec-head sec-head--center">
      <div data-reveal>
        <p class="eyebrow">${esc(s.eyebrow)}</p>
        <h2 class="h2">${br(s.heading)}</h2>
      </div>
    </div>
    <div class="steps">
      ${list(s.items).map((it, i) => `<div class="step" data-reveal>
        <p class="step__n">${String(i + 1).padStart(2, '0')}</p>
        <h3 class="step__title">${esc(it.title)}</h3>
        <p class="step__body">${esc(it.body)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>
`;

  const cardGrid = (items, three) => `<div class="cards${three ? ' cards--3' : ''}">
      ${list(items).map(it => `<article class="card" data-reveal>
        ${it.num ? `<p class="num">${esc(it.num)}</p>` : ''}
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.body)}</p>
      </article>`).join('\n      ')}
    </div>`;

  const featureList = (items) => `<div class="feature-list">
          ${list(items).map((it, i) => `<div class="feature-list__item">
            <span class="feature-list__num">${String(i + 1).padStart(2, '0')}</span>
            <div>
              <p class="feature-list__title">${esc(it.title)}</p>
              <p class="feature-list__body">${esc(it.body)}</p>
            </div>
          </div>`).join('\n          ')}
        </div>`;

  const pageHero = (h, theme) => `<section class="page-hero"${sectionAccent(theme)}>
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>${esc(h.crumb)}</span></p>
    <p class="eyebrow">${esc(h.eyebrow)}</p>
    <h1 class="page-hero__title">${br(h.title)}</h1>
    <p class="lead">${esc(h.lead)}</p>
    ${list(h.buttons).length ? `<div class="btn-row">
      ${list(h.buttons).map(b => btn(b)).join('\n      ')}
    </div>` : ''}
  </div>
</section>
`;

  /* A broadcast "program out" preview, drawn in CSS. */
  const broadcastMock = (p, opts) => {
    const o = opts || {};
    const sb = p.scoreboard || {};
    const lt = p.lowerThird || {};
    return `<div class="mock" data-reveal aria-hidden="true"${o.wide ? ' style="max-width:980px;margin-inline:auto"' : ''}>
        <div class="mock__bar">
          <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
          <span class="mock__label">${esc(p.mockLabel)}</span>
        </div>
        <div class="screen">
          <div class="screen__grid"></div>
          <div class="screen__score">
            <span class="s-team">${esc(sb.home)}</span>
            <span class="s-num">${esc(sb.homeScore)}</span>
            <span class="s-team s-team--alt">${esc(sb.away)}</span>
            <span class="s-num s-num--alt">${esc(sb.awayScore)}</span>
            <span class="s-clock">${esc(sb.clock)}</span>
          </div>
          ${p.sponsorBug ? `<div class="screen__bug">${esc(p.sponsorBug)}</div>` : ''}
          <div class="screen__lower">
            <div class="screen__rule"></div>
            <div class="screen__card">
              <p class="screen__title">${esc(lt.title)}</p>
              <p class="screen__sponsor">${esc(lt.sponsor)}</p>
            </div>
          </div>
        </div>
      </div>`;
  };

  /* Real broadcast stills. Until any are uploaded, the drawn mock stands in —
     clearly captioned as representative so it is never mistaken for a real show. */
  const gallerySection = (g, preview) => {
    const items = list(g && g.items);
    if (!items.length) {
      return `<section class="section section--tight" style="--accent: var(--volt)">
  <div class="shell">
    ${broadcastMock(preview, { wide: true })}
    <p class="muted" style="text-align:center;font-size:var(--fs-small);margin-top:1.25rem" data-reveal>${esc((g && g.emptyNote) || preview.caption)}</p>
  </div>
</section>
`;
    }
    return `<section class="section" id="on-air" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(g.eyebrow)}</p>
        <h2 class="h2">${br(g.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(g.lead)}</p>
    </div>

    <div class="gallery">
      ${items.map((it, i) => `<figure class="shot" data-reveal>
        <button class="shot__btn" type="button" data-shot="${i}" aria-label="Enlarge image${it.caption ? ': ' + attr(it.caption) : ''}">
          <img src="${attr(it.src)}" alt="${attr(it.alt || it.caption || '')}" loading="lazy" decoding="async">
        </button>
        ${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ''}
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>
`;
  };

  /* ---------- pages ---------- */
  function home(c) {
    const p = c.home;
    const cc = p.fieldhouseSplit;
    const tk = p.toolkitSplit;
    const cons = p.consultingSection;
    const bars = ['35', '58', '44', '88', '62', '40', '72', '51'];

    const body = `
<section class="hero">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__grid"></div>
    <div class="hero__glow"></div>
    <div class="hero__glow hero__glow--2"></div>
  </div>

  <div class="shell hero__inner">
    <p class="eyebrow hero__fade">${esc(p.hero.eyebrow)}</p>

    <h1 class="hero__title">
      ${list(p.hero.titleLines).map((l, i) => `<span class="line"><span style="--delay:${60 + i * 90}ms">${esc(l)}</span></span>`).join('\n      ')}
    </h1>

    <div class="hero__foot hero__fade">
      <div>
        <p class="lead">${esc(p.hero.lead)}</p>
        <div class="btn-row">
          ${list(p.hero.buttons).map(b => btn(b)).join('\n          ')}
        </div>
      </div>
      <p class="hero__scroll">
        Scroll
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true"><path d="M6 1v15M1 11l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </p>
    </div>
  </div>
</section>

${marquee(p.marquee)}
<section class="section" id="what-we-do">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.whatWeDo.eyebrow)}</p>
        <h2 class="h2">${br(p.whatWeDo.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.whatWeDo.lead)}</p>
    </div>
  </div>

  <div class="pillars">
    ${list(p.pillars).map(pl => `<article class="pillar${pl.theme === 'support' ? ' pillar--volt' : ''}" data-reveal>
      <p class="pillar__num">${esc(pl.num)}</p>
      <h3 class="pillar__title">${esc(pl.title)} <em>${esc(pl.titleAccent)}</em></h3>
      <p class="pillar__body">${esc(pl.body)}</p>
      <ul class="pillar__list">
        ${list(pl.list).map(i => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
      ${link(pl.linkLabel, pl.linkHref)}
    </article>`).join('\n\n    ')}
  </div>
</section>

<section class="section panel--light">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">${esc(cc.eyebrow)}</p>
        <h2 class="h2">${br(cc.heading)}</h2>
        <p class="lead" style="margin-top:1.75rem">${esc(cc.lead)}</p>
        <div class="btn-row">
          ${btn(cc.button)}
        </div>
      </div>

      <div class="mock" data-reveal aria-hidden="true">
        <div class="mock__bar">
          <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
          <span class="mock__label">${esc(cc.mockLabel)}</span>
        </div>
        <div class="mock__body">
          ${list(cc.mockRows).map(r => `<div class="mock-row">
            <div>
              <p class="mock-row__title">${esc(r.title)}</p>
              <p class="mock-row__meta">${esc(r.meta)}</p>
            </div>
            <span class="chip chip--${attr(r.chipStyle)}">${esc(r.chip)}</span>
          </div>`).join('\n          ')}
          <div class="mock-bars">
            ${bars.map((h, i) => `<i${i === 3 ? ' class="on"' : ''} data-h="${h}"></i>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="--accent: var(--volt)">
  <div class="shell">
    <div class="split split--reverse">
      <div data-reveal>
        <p class="eyebrow">${esc(tk.eyebrow)}</p>
        <h2 class="h2">${br(tk.heading)}</h2>
        <p class="lead" style="margin-top:1.75rem">${esc(tk.lead)}</p>
        <div class="btn-row">
          ${btn(tk.button)}
        </div>
      </div>

      ${broadcastMock(tk, {})}
    </div>
  </div>
</section>

<section class="section panel--light" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(cons.eyebrow)}</p>
        <h2 class="h2">${br(cons.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(cons.lead)}</p>
    </div>

    ${cardGrid(cons.cards, true)}

    <div class="btn-row" data-reveal>
      ${btn(cons.button)}
    </div>
  </div>
</section>

${steps(p.howWeWork, false)}
${ctaBand(c, p.cta)}
`;
    return head(c, 'home', p.meta) + header(c, 'index') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function fieldhouse(c) {
    const p = c.fieldhouse;
    const body = `
${pageHero(p.hero, 'primary')}
<div class="shell">
  <div class="stats" data-reveal>
    ${list(p.stats).map(s => `<div class="stat">
      <p class="stat__k">${esc(s.k)}</p>
      <p class="stat__v">${esc(s.v)}</p>
    </div>`).join('\n    ')}
  </div>
</div>

<section class="section" id="problem">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">${esc(p.problem.eyebrow)}</p>
        <h2 class="h2">${br(p.problem.heading)}</h2>
      </div>
      <div data-reveal>
        <p class="lead">${esc(p.problem.lead)}</p>
        ${featureList(p.problem.items)}
      </div>
    </div>
  </div>
</section>

<section class="section panel--light" id="modules">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.modules.eyebrow)}</p>
        <h2 class="h2">${br(p.modules.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.modules.lead)}</p>
    </div>

    ${cardGrid(p.modules.items, true)}
  </div>
</section>

${steps(p.steps, false)}
<section class="section panel--light">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.faq.eyebrow)}</p>
        <h2 class="h2">${br(p.faq.heading)}</h2>
      </div>
    </div>
    <div class="accordion" data-reveal>
      ${list(p.faq.items).map((f, i) => `<div class="acc">
        <h3>
          <button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}">
            ${esc(f.q)}
            <span class="acc__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="acc__panel" id="faq-${i}" data-open="false"><div><p>${esc(f.a)}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand(c, p.cta)}
`;
    return head(c, 'fieldhouse', p.meta) + header(c, 'fieldhouse') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function toolkit(c) {
    const p = c.toolkit;
    const body = `
${pageHero(p.hero, 'support')}
${gallerySection(p.gallery, p.preview)}
${marquee(p.marquee)}
<section class="section" id="kit" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.kit.eyebrow)}</p>
        <h2 class="h2">${br(p.kit.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.kit.lead)}</p>
    </div>

    ${cardGrid(p.kit.items, true)}
  </div>
</section>

<section class="section panel--light" style="--accent: var(--volt)">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">${esc(p.compat.eyebrow)}</p>
        <h2 class="h2">${br(p.compat.heading)}</h2>
        <p class="lead" style="margin-top:1.75rem">${esc(p.compat.lead)}</p>
        <div class="btn-row">
          ${btn(p.compat.button)}
        </div>
      </div>

      <!-- NOTE: ${esc(p.compat.note)} -->
      <div data-reveal>
        ${featureList(p.compat.items)}
      </div>
    </div>
  </div>
</section>

${steps(p.steps, false).replace('<section class="section"', '<section class="section" style="--accent: var(--volt)"')}
${ctaBand(c, p.cta)}
`;
    return head(c, 'broadcasters-toolkit', p.meta) + header(c, 'broadcasters-toolkit') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function consulting(c) {
    const p = c.consulting;
    const body = `
${pageHero(p.hero, 'support')}
<section class="section" style="--accent: var(--volt)">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">${esc(p.why.eyebrow)}</p>
        <h2 class="h2">${br(p.why.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.why.lead)}</p>
    </div>
  </div>
</section>

<section class="section panel--light" id="practices" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.practices.eyebrow)}</p>
        <h2 class="h2">${br(p.practices.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.practices.lead)}</p>
    </div>
    ${cardGrid(p.practices.items, true)}
  </div>
</section>

<section class="section" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.engagements.eyebrow)}</p>
        <h2 class="h2">${br(p.engagements.heading)}</h2>
      </div>
      <p class="lead" data-reveal>${esc(p.engagements.lead)}</p>
    </div>

    ${cardGrid(p.engagements.items, true)}
  </div>
</section>

${steps(p.process, true).replace('<section class="section panel--light"', '<section class="section panel--light" style="--accent: var(--volt)"')}
${ctaBand(c, p.cta)}
`;
    return head(c, 'consulting', p.meta) + header(c, 'consulting') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function about(c) {
    const p = c.about;
    const body = `
${pageHero(p.hero, 'primary')}
<section class="section">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">${esc(p.intro.eyebrow)}</p>
        <h2 class="h2">${br(p.intro.heading)}</h2>
      </div>
      <div data-reveal>
        ${list(p.intro.paragraphs).map((t, i) => `<p class="lead"${i ? ' style="margin-top:1.5rem"' : ''}>${esc(t)}</p>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="section panel--light">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">${esc(p.beliefs.eyebrow)}</p>
        <h2 class="h2">${br(p.beliefs.heading)}</h2>
      </div>
    </div>
    ${cardGrid(list(p.beliefs.items).map((b, i) => ({ num: '0' + (i + 1), title: b.title, body: b.body })), false)}
  </div>
</section>

<!-- ${esc(p.team.note)} -->
<section class="section">
  <div class="shell">
    <div class="split split--reverse">
      <div data-reveal>
        <p class="eyebrow">${esc(p.team.eyebrow)}</p>
        <h2 class="h2">${br(p.team.heading)}</h2>
        <p class="lead" style="margin-top:1.75rem">${esc(p.team.lead)}</p>
        <div class="btn-row">
          ${btn(p.team.button)}
        </div>
      </div>
      <div class="stats" data-reveal style="grid-template-columns:1fr">
        ${list(p.team.stats).map(s => `<div class="stat">
          <p class="stat__k">${esc(s.k)}</p>
          <p class="stat__v">${esc(s.v)}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

${ctaBand(c, p.cta)}
`;
    return head(c, 'about', p.meta) + header(c, 'about') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function contact(c) {
    const p = c.contact;
    const email = (c.site || {}).email || '';
    const f = p.form;
    const linkStyle = ' style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0"';
    const body = `
${pageHero(p.hero, 'primary')}
<section class="section section--tight section--flush-top">
  <div class="shell">
    <div class="split split--top">
      <div data-reveal>
        <form class="form" data-contact-form action="${attr(f.action)}" method="post" data-mailto="${attr(email)}" novalidate>
          <div class="form__row">
            <div class="field">
              <label for="name">Your name</label>
              <input id="name" name="name" type="text" autocomplete="name" placeholder="Jane Doe" required>
            </div>
            <div class="field">
              <label for="organization">Organization</label>
              <input id="organization" name="organization" type="text" autocomplete="organization" placeholder="University / property / network">
            </div>
          </div>

          <div class="form__row">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" placeholder="you@school.edu" required>
            </div>
            <div class="field">
              <label for="interest">I’m interested in</label>
              <select id="interest" name="interest">
                ${list(f.interests).map(i => `<option>${esc(i)}</option>`).join('\n                ')}
              </select>
            </div>
          </div>

          <div class="field">
            <label for="message">${esc(f.messageLabel)}</label>
            <textarea id="message" name="message" placeholder="${attr(f.messagePlaceholder)}"></textarea>
          </div>

          <div class="btn-row" style="margin-top:1rem;align-items:center">
            <button class="btn" type="submit">${esc(f.submitLabel)} ${ARROW}</button>
            <p class="form__status" role="status" aria-live="polite"></p>
          </div>
          <p class="form__note">
            Prefer email? <a class="link" href="mailto:${attr(email)}"${linkStyle}>${esc(email)}</a>
          </p>
        </form>
      </div>

      <div data-reveal>
        <div class="detail-list">
          <div>
            <p class="detail__k">Email</p>
            <p class="detail__v"><a class="link" href="mailto:${attr(email)}"${linkStyle}>${esc(email)}</a></p>
          </div>
          <div>
            <p class="detail__k">${esc(p.details.expectTitle)}</p>
            <p class="detail__v" style="color:var(--on-dark-muted)">${esc(p.details.expect)}</p>
          </div>
          <div>
            <p class="detail__k">${esc(p.details.includeTitle)}</p>
            <ul style="color:var(--on-dark-muted);display:grid;gap:.5rem;margin-top:.25rem">
              ${list(p.details.include).map(i => `<li>— ${esc(i)}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
    return head(c, 'contact', p.meta) + header(c, 'contact') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  function notFound(c) {
    const p = c.notFound;
    const body = `
<section class="hero" style="min-height:auto;padding-bottom:var(--section)">
  <div class="hero__bg" aria-hidden="true"><div class="hero__grid"></div><div class="hero__glow"></div></div>
  <div class="shell hero__inner">
    <p class="eyebrow">${esc(p.eyebrow)}</p>
    <h1 class="hero__title" style="font-size:var(--fs-display)">${list(p.titleLines).map(esc).join('<br>')}</h1>
    <p class="lead" style="margin-top:2rem">${esc(p.lead)}</p>
    <div class="btn-row">
      ${list(p.buttons).map(b => btn(b)).join('\n      ')}
    </div>
  </div>
</section>
`;
    return head(c, '404', p.meta) + header(c, '404') + '<main id="main">\n' + body + '</main>\n' + footer(c);
  }

  /* ---------- extras the admin can also regenerate ---------- */
  function favicon(brand) {
    const b = brand || {};
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="Flux Athletics">
  <rect width="40" height="40" rx="9" fill="${attr(b.ink || '#0B0B0C')}"/>
  <path d="M16 8h17l-3.4 6.8H12.6z" fill="${attr(b.primary || '#0DF786')}"/>
  <path d="M12.6 17.4h17l-3.4 6.8H9.2z" fill="${attr(b.paper || '#F5F3EF')}" opacity=".85"/>
  <path d="M9.2 26.8h8.5l-3.4 6.8H5.8z" fill="${attr(b.paper || '#F5F3EF')}" opacity=".45"/>
</svg>
`;
  }

  function sitemap(c) {
    const domain = String((c.site || {}).domain || '').replace(/\/$/, '');
    const pages = ['', 'fieldhouse.html', 'broadcasters-toolkit.html', 'consulting.html', 'about.html', 'contact.html'];
    const today = new Date().toISOString().slice(0, 10);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${domain}/${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
  }

  const robots = (c) => `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /tools/

Sitemap: ${String((c.site || {}).domain || '').replace(/\/$/, '')}/sitemap.xml
`;

  /* ---------- public ---------- */
  function renderAll(c) {
    return {
      'index.html': home(c),
      'fieldhouse.html': fieldhouse(c),
      'broadcasters-toolkit.html': toolkit(c),
      'consulting.html': consulting(c),
      'about.html': about(c),
      'contact.html': contact(c),
      '404.html': notFound(c),
      'assets/img/favicon.svg': favicon(c.brand),
      'sitemap.xml': sitemap(c),
      'robots.txt': robots(c),
    };
  }

  return { renderAll, favicon, sitemap, robots, esc };
}));
