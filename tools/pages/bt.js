const { page, ctaBand, ARROW } = require('../shell.js');

const kit = [
  ['Scoreboard &amp; clock bugs', 'Score bugs that read from your clock and scoring source, styled to your brand, with the states a real game needs — timeouts, period breaks, overtime, final.'],
  ['Lower thirds', 'Name keys, stat cards, matchup comparisons and interview keys built as a set, so every insert in your show looks like it belongs to the same package.'],
  ['Sponsor billboards', 'Full-frame and corner-bug sponsor elements with rotation logic, plus an as-run log you can hand back to the partner as proof.'],
  ['Stat pages', 'Leaders, box scores, team comparisons and season lines — populated from your data source rather than retyped between whistles.'],
  ['Transitions &amp; stings', 'Wipes, bumpers and open animations cut to your package so a stream returning from break feels produced instead of abrupt.'],
  ['Ticker &amp; social', 'Scrolling scores, promotional messaging and moderated social pulls for the bottom of the frame.'],
];

const body = `
<section class="page-hero" style="--accent: var(--volt); --glow: rgba(61,225,255,.20)">
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>Broadcaster&rsquo;s Toolkit</span></p>
    <p class="eyebrow">Broadcaster&rsquo;s Toolkit</p>
    <h1 class="page-hero__title">Make a small crew look like a network.</h1>
    <p class="lead">
      Plugins and graphics packages for live sports production. Built for the
      people running a show with two cameras, one operator and no margin for
      error.
    </p>
    <div class="btn-row">
      <a class="btn btn--volt" href="contact.html">Get the Toolkit ${ARROW}</a>
      <a class="btn btn--ghost" href="#kit">What&rsquo;s included ${ARROW}</a>
    </div>
  </div>
</section>

<section class="section section--tight" style="--accent: var(--volt)">
  <div class="shell">
    <div class="mock" data-reveal aria-hidden="true" style="max-width:980px;margin-inline:auto">
      <div class="mock__bar">
        <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
        <span class="mock__label">Program out &middot; 1080p59.94</span>
      </div>
      <div style="aspect-ratio:16/9;position:relative;background:linear-gradient(160deg,#16181d,#0c0d10);display:flex;align-items:flex-end;padding:4%">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(245,243,239,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,243,239,.05) 1px,transparent 1px);background-size:48px 48px"></div>

        <div style="position:absolute;top:5%;left:4%;display:flex;align-items:stretch;font-family:var(--font-display);font-weight:800;font-size:clamp(.7rem,1.5vw,1rem);border-radius:4px;overflow:hidden;box-shadow:0 12px 34px -14px #000">
          <span style="background:#0B0B0C;color:#F5F3EF;padding:.45em .75em">HOME</span>
          <span style="background:var(--volt);color:#0B0B0C;padding:.45em .75em">24</span>
          <span style="background:#1E1E23;color:#F5F3EF;padding:.45em .75em">AWAY</span>
          <span style="background:rgba(245,243,239,.14);color:#F5F3EF;padding:.45em .75em">17</span>
          <span style="background:#0B0B0C;color:var(--volt);padding:.45em .75em;font-family:var(--font-mono);font-size:.82em;letter-spacing:.04em">Q3 04:12</span>
        </div>

        <div style="position:absolute;top:5%;right:4%;background:rgba(11,11,12,.82);border:1px solid rgba(61,225,255,.35);border-radius:4px;padding:.5em .8em;font-family:var(--font-mono);font-size:clamp(.55rem,1.1vw,.7rem);letter-spacing:.14em;text-transform:uppercase;color:var(--volt)">
          Sponsor bug &middot; rotating
        </div>

        <div style="position:relative;width:min(70%,520px)">
          <div style="height:5px;width:100%;background:var(--volt)"></div>
          <div style="background:rgba(11,11,12,.9);padding:1em 1.2em">
            <p style="font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:-.02em;font-size:clamp(1rem,2.4vw,1.7rem);line-height:1">Third quarter leaders</p>
            <p style="font-family:var(--font-mono);font-size:clamp(.55rem,1.1vw,.7rem);letter-spacing:.16em;text-transform:uppercase;color:var(--volt);margin-top:.5em">Presented by your partner</p>
          </div>
        </div>
      </div>
    </div>
    <p class="muted" style="text-align:center;font-size:var(--fs-small);margin-top:1.25rem" data-reveal>
      Representative layout. Every package is rebuilt in your colours, type and naming.
    </p>
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    <span class="marquee__item">Score bugs</span>
    <span class="marquee__item">Lower thirds</span>
    <span class="marquee__item">Sponsor billboards</span>
    <span class="marquee__item">Stat pages</span>
    <span class="marquee__item">Transitions</span>
    <span class="marquee__item">Tickers</span>
    <span class="marquee__item">Show opens</span>
  </div>
</div>

<section class="section" id="kit" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">The kit</p>
        <h2 class="h2">Everything a<br>sports show<br>needs on screen.</h2>
      </div>
      <p class="lead" data-reveal>
        Not a folder of loose templates. A designed package where the score bug,
        the lower third and the sponsor read all share the same rules &mdash; and
        an operator can drive the whole thing alone.
      </p>
    </div>

    <div class="cards cards--3">
      ${kit.map(([t, d]) => `<article class="card" data-reveal>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section panel--light" style="--accent: var(--volt)">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">Fits your stack</p>
        <h2 class="h2">Built for the tools you already run.</h2>
        <p class="lead" style="margin-top:1.75rem">
          We deliver into the switcher and CG workflow your crew knows, rather
          than asking you to rebuild the truck around a new piece of software.
          Tell us what you run and we will confirm the delivery format before
          you commit.
        </p>
        <div class="btn-row">
          <a class="btn btn--volt" href="contact.html">Check your setup ${ARROW}</a>
        </div>
      </div>

      <!-- NOTE: confirm this list matches what Flux Athletics actually supports today. -->
      <div data-reveal>
        <div class="feature-list">
          <div class="feature-list__item">
            <span class="feature-list__num">01</span>
            <div>
              <p class="feature-list__title">Software switchers</p>
              <p class="feature-list__body">Packages delivered for common software production stacks, driven by title inputs your operator already understands.</p>
            </div>
          </div>
          <div class="feature-list__item">
            <span class="feature-list__num">02</span>
            <div>
              <p class="feature-list__title">Browser-based overlays</p>
              <p class="feature-list__body">HTML overlay sources that key over program in any tool that accepts a browser input — and update live from your data.</p>
            </div>
          </div>
          <div class="feature-list__item">
            <span class="feature-list__num">03</span>
            <div>
              <p class="feature-list__title">Scoring &amp; stat feeds</p>
              <p class="feature-list__body">Wired to your clock, scoring console or stat provider so the numbers on screen are not being typed by hand.</p>
            </div>
          </div>
          <div class="feature-list__item">
            <span class="feature-list__num">04</span>
            <div>
              <p class="feature-list__title">Operator control</p>
              <p class="feature-list__body">A simple control surface for the person running graphics, built so a student operator can be trained in an afternoon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="--accent: var(--volt)">
  <div class="shell">
    <div class="sec-head sec-head--center">
      <div data-reveal>
        <p class="eyebrow">How it ships</p>
        <h2 class="h2">Three steps to air.</h2>
      </div>
    </div>
    <div class="steps">
      <div class="step" data-reveal>
        <p class="step__n">01</p>
        <h3 class="step__title">Brand it</h3>
        <p class="step__body">We take your marks, colours and type and build the package around them — including the sponsor treatments your partners have already bought.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">02</p>
        <h3 class="step__title">Wire it</h3>
        <p class="step__body">Graphics are connected to your clock, scoring and stat sources, and installed into your production stack ahead of a live date.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">03</p>
        <h3 class="step__title">Train it</h3>
        <p class="step__body">We run a rehearsal with the crew who will operate it, then stay reachable for your first broadcasts of the season.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Tell us what your show looks like.',
  body: 'Send us your stack, your sports and a link to a recent broadcast. We will come back with what the Toolkit would change.',
  label: 'Get the Toolkit',
})}
`;

module.exports = page({
  title: "Broadcaster's Toolkit — Live sports graphics & plugins | Flux Athletics",
  desc: "The Broadcaster's Toolkit from Flux Athletics: score bugs, lower thirds, sponsor billboards, stat pages and plugins that make a small live sports crew look broadcast-grade.",
  page: 'broadcasters-toolkit',
  body,
});
