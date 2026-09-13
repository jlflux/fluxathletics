/* Static page assembler for fluxathletics.
   Emits plain HTML files — no runtime dependency, no build step for the host. */
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || process.cwd();

const SITE = 'https://www.fluxathletics.com';
const EMAIL = 'hello@fluxathletics.com';

const NAV = [
  { key: 'command-center',      href: 'command-center.html',      label: 'Command Center',        num: '01' },
  { key: 'broadcasters-toolkit', href: 'broadcasters-toolkit.html', label: 'Broadcaster&rsquo;s Toolkit', num: '02' },
  { key: 'consulting',          href: 'consulting.html',          label: 'Consulting',            num: '03' },
  { key: 'about',               href: 'about.html',               label: 'About',                 num: '04' },
  { key: 'contact',             href: 'contact.html',             label: 'Contact',               num: '05' },
];

const MARK = (cls = 'brand__mark') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path class="b1" d="M16 5h20l-4 8H12z"/><path class="b2" d="M12 16h20l-4 8H8z"/><path class="b3" d="M8 27h20l-4 8H4z"/></svg>`;

const ARROW = `<svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const head = ({ title, desc, page }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${page === 'home' ? '' : page + '.html'}">
<meta name="theme-color" content="#0B0B0C">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Flux Athletics">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/${page === 'home' ? '' : page + '.html'}">
<meta property="og:image" content="${SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">

<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/favicon.svg">

<link rel="preload" href="assets/fonts/archivo-800-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;

const header = (page) => `<header class="header">
  <div class="header__inner">
    <a class="brand" href="index.html" aria-label="Flux Athletics — home">
      ${MARK()}
      <span class="brand__word">Flux <span>Athletics</span></span>
    </a>

    <nav class="nav" aria-label="Primary">
      ${NAV.map(n => `<a class="nav__link" href="${n.href}"${n.key === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
    </nav>

    <div class="header__cta">
      <a class="btn" href="contact.html">Book a call ${ARROW}</a>
    </div>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle menu">
      <span></span>
    </button>
  </div>
</header>

<div class="mobile-nav" id="mobile-nav">
  <nav class="mobile-nav__list" aria-label="Mobile">
    ${NAV.map(n => `<a href="${n.href}">${n.label} <span>${n.num}</span></a>`).join('\n    ')}
  </nav>
  <div class="mobile-nav__foot">
    <a class="btn" href="contact.html">Book a call ${ARROW}</a>
  </div>
</div>
`;

const ctaBand = ({
  title = 'Let&rsquo;s get your season under control.',
  body = 'Tell us what you run — a department, a conference, a broadcast crew — and we&rsquo;ll show you the shortest path to a cleaner operation.',
  label = 'Start the conversation',
} = {}) => `<section class="cta-band">
  ${MARK('cta-band__mark')}
  <div class="shell cta-band__inner">
    <div data-reveal>
      <h2>${title}</h2>
      <p>${body}</p>
    </div>
    <div data-reveal>
      <a class="btn" href="contact.html">${label} ${ARROW}</a>
    </div>
  </div>
</section>
`;

const footer = () => `<footer class="footer">
  <div class="shell">
    <div class="footer__top">
      <div>
        <a class="brand" href="index.html" aria-label="Flux Athletics — home">
          ${MARK()}
          <span class="brand__word">Flux <span>Athletics</span></span>
        </a>
        <p class="footer__word" style="margin-top:1.5rem">Software, signal &amp; strategy for sports.</p>
      </div>

      <div class="footer__col">
        <h4>What we do</h4>
        <ul>
          <li><a href="command-center.html">Athletics Command Center</a></li>
          <li><a href="broadcasters-toolkit.html">Broadcaster&rsquo;s Toolkit</a></li>
          <li><a href="consulting.html">Consulting</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; <span data-year>2026</span> Flux Athletics. All rights reserved.</p>
      <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
  </div>
</footer>

<script src="assets/js/main.js" defer></script>
</body>
</html>
`;

const page = ({ title, desc, page: key, body }) =>
  head({ title, desc, page: key }) + header(key) + `<main id="main">\n` + body + `</main>\n` + footer();

module.exports = { page, ctaBand, ARROW, MARK, EMAIL, SITE, OUT, fs, path };
