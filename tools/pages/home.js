const { page, ctaBand, ARROW } = require('../shell.js');

const marqueeItems = [
  'Sponsorship fulfillment', 'Event staffing', 'Game day logistics',
  'Live graphics', 'Broadcast plugins', 'Sports marketing',
  'Media strategy', 'Venue operations',
];

const body = `
<section class="hero">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__grid"></div>
    <div class="hero__glow"></div>
    <div class="hero__glow hero__glow--2"></div>
  </div>

  <div class="shell hero__inner">
    <p class="eyebrow hero__fade">Software &middot; Broadcast tools &middot; Consulting</p>

    <h1 class="hero__title">
      <span class="line"><span style="--delay:60ms">Game day,</span></span>
      <span class="line"><span style="--delay:150ms">under</span></span>
      <span class="line"><span style="--delay:240ms">control.</span></span>
    </h1>

    <div class="hero__foot hero__fade">
      <div>
        <p class="lead">
          We build the software, broadcast tools and strategy that keep athletic
          departments and live productions running &mdash; from the sponsorship
          contract to the graphic on screen.
        </p>
        <div class="btn-row">
          <a class="btn" href="command-center.html">Explore the platform ${ARROW}</a>
          <a class="btn btn--ghost" href="broadcasters-toolkit.html">See the Toolkit ${ARROW}</a>
        </div>
      </div>
      <p class="hero__scroll">
        Scroll
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true"><path d="M6 1v15M1 11l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </p>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    ${marqueeItems.map(i => `<span class="marquee__item">${i}</span>`).join('\n    ')}
  </div>
</div>

<section class="section" id="what-we-do">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">What we do</p>
        <h2 class="h2">Three ways we<br>take work off<br>your plate.</h2>
      </div>
      <p class="lead" data-reveal>
        Most athletic operations are held together by spreadsheets, group texts and
        the one person who knows how everything works. We replace that with systems
        &mdash; and the people who know how to run them.
      </p>
    </div>
  </div>

  <div class="pillars">
    <article class="pillar" data-reveal>
      <p class="pillar__num">01 / Software</p>
      <h3 class="pillar__title">Athletics <em>Command Center</em></h3>
      <p class="pillar__body">
        One system for the logistics behind a season: sponsorship inventory and
        fulfillment, event staffing, schedules, vendors and venues. Built for
        athletic departments that run dozens of events at once.
      </p>
      <ul class="pillar__list">
        <li>Sponsorship inventory &amp; proof of performance</li>
        <li>Event staffing &amp; shift assignment</li>
        <li>Game day run-of-show and logistics</li>
      </ul>
      <a class="link" href="command-center.html">Explore the platform ${ARROW}</a>
    </article>

    <article class="pillar pillar--volt" data-reveal>
      <p class="pillar__num">02 / Broadcast</p>
      <h3 class="pillar__title">Broadcaster&rsquo;s <em>Toolkit</em></h3>
      <p class="pillar__body">
        Plugins and graphics packages for live sports production. Scoreboards,
        lower thirds, sponsor billboards and stat pages that look broadcast-grade
        without a broadcast-sized crew.
      </p>
      <ul class="pillar__list">
        <li>Animated graphics packages</li>
        <li>Scoreboard &amp; clock integrations</li>
        <li>Sponsor rotation &amp; as-run logging</li>
      </ul>
      <a class="link" href="broadcasters-toolkit.html">See what&rsquo;s inside ${ARROW}</a>
    </article>

    <article class="pillar pillar--field" data-reveal>
      <p class="pillar__num">03 / Advisory</p>
      <h3 class="pillar__title">Sports <em>Consulting</em></h3>
      <p class="pillar__body">
        Marketing, media and event management strategy from people who have
        actually run the event. We help you price inventory, plan the operation
        and build the crew to deliver it.
      </p>
      <ul class="pillar__list">
        <li>Sponsorship strategy &amp; valuation</li>
        <li>Event management &amp; staffing plans</li>
        <li>Media &amp; broadcast strategy</li>
      </ul>
      <a class="link" href="consulting.html">How we work ${ARROW}</a>
    </article>
  </div>
</section>

<section class="section panel--light">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">01 &mdash; Athletics Command Center</p>
        <h2 class="h2">Every obligation,<br>every shift,<br>one screen.</h2>
        <p class="lead" style="margin-top:1.75rem">
          Sponsorship deals live in contracts. Staffing lives in a group chat.
          Run-of-show lives in someone&rsquo;s head. The Command Center puts all
          three in the same place, so nothing gets missed on a Saturday with four
          events running at once.
        </p>
        <div class="btn-row">
          <a class="btn" href="command-center.html">Explore the platform ${ARROW}</a>
        </div>
      </div>

      <div class="mock" data-reveal aria-hidden="true">
        <div class="mock__bar">
          <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
          <span class="mock__label">Command Center &mdash; Saturday</span>
        </div>
        <div class="mock__body">
          <div class="mock-row">
            <div>
              <p class="mock-row__title">Video board takeover &mdash; Q2 media timeout</p>
              <p class="mock-row__meta">Sponsor obligation &middot; 2 of 3 delivered</p>
            </div>
            <span class="chip chip--live">On air</span>
          </div>
          <div class="mock-row">
            <div>
              <p class="mock-row__title">Gate staff &mdash; North concourse</p>
              <p class="mock-row__meta">14 of 14 shifts assigned</p>
            </div>
            <span class="chip chip--ok">Staffed</span>
          </div>
          <div class="mock-row">
            <div>
              <p class="mock-row__title">Concourse activation &mdash; setup</p>
              <p class="mock-row__meta">Vendor load-in &middot; 90 min window</p>
            </div>
            <span class="chip chip--pend">Pending</span>
          </div>
          <div class="mock-bars">
            <i data-h="35"></i><i data-h="58"></i><i data-h="44"></i><i class="on" data-h="88"></i>
            <i data-h="62"></i><i data-h="40"></i><i data-h="72"></i><i data-h="51"></i>
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
        <p class="eyebrow">02 &mdash; Broadcaster&rsquo;s Toolkit</p>
        <h2 class="h2">Broadcast-grade<br>graphics. Two-person<br>crew.</h2>
        <p class="lead" style="margin-top:1.75rem">
          The gap between a network show and a campus stream is rarely the camera
          &mdash; it&rsquo;s the graphics. Our plugins and packages drop into the
          production tools you already run and make a small crew look like a big one.
        </p>
        <div class="btn-row">
          <a class="btn btn--volt" href="broadcasters-toolkit.html">See what&rsquo;s inside ${ARROW}</a>
        </div>
      </div>

      <div class="mock" data-reveal aria-hidden="true">
        <div class="mock__bar">
          <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
          <span class="mock__label">Program out &middot; 1080p59.94</span>
        </div>
        <div style="aspect-ratio:16/9;position:relative;background:linear-gradient(160deg,#16181d,#0c0d10);display:flex;align-items:flex-end;padding:5%">
          <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(245,243,239,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,243,239,.05) 1px,transparent 1px);background-size:40px 40px"></div>
          <div style="position:absolute;top:6%;left:5%;display:flex;align-items:stretch;font-family:var(--font-display);font-weight:800;font-size:clamp(.7rem,1.5vw,.95rem);letter-spacing:.02em;border-radius:4px;overflow:hidden;box-shadow:0 10px 30px -12px #000">
            <span style="background:#0B0B0C;color:#F5F3EF;padding:.45em .7em">HOME</span>
            <span style="background:var(--volt);color:#0B0B0C;padding:.45em .7em">24</span>
            <span style="background:#1E1E23;color:#F5F3EF;padding:.45em .7em">AWAY</span>
            <span style="background:rgba(245,243,239,.14);color:#F5F3EF;padding:.45em .7em">17</span>
            <span style="background:#0B0B0C;color:var(--volt);padding:.45em .7em;font-family:var(--font-mono);font-size:.85em">Q3 04:12</span>
          </div>
          <div style="position:relative;width:min(78%,420px)">
            <div style="height:4px;width:100%;background:var(--volt)"></div>
            <div style="background:rgba(11,11,12,.88);backdrop-filter:blur(6px);padding:.9em 1.1em">
              <p style="font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:-.02em;font-size:clamp(.9rem,2vw,1.3rem);line-height:1">Third quarter leaders</p>
              <p style="font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.14em;text-transform:uppercase;color:var(--volt);margin-top:.4em">Presented by your sponsor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section panel--light" style="--accent: var(--field)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">03 &mdash; Consulting</p>
        <h2 class="h2">Strategy from<br>people who have<br>worked the event.</h2>
      </div>
      <p class="lead" data-reveal>
        Software solves the repeatable problems. The rest &mdash; what an asset is
        worth, how a venue should flow, which partner is right &mdash; takes
        judgment. That is the part we do in the room with you.
      </p>
    </div>

    <div class="cards cards--3">
      <article class="card" data-reveal>
        <h3>Sports marketing</h3>
        <p>Inventory audits, sponsorship valuation, partner strategy and renewal
        packages built on what you can actually deliver and prove.</p>
      </article>
      <article class="card" data-reveal>
        <h3>Media &amp; broadcast</h3>
        <p>Production planning, rights and distribution strategy, graphics
        standards, and workflow design for the crew size you really have.</p>
      </article>
      <article class="card" data-reveal>
        <h3>Event management</h3>
        <p>Run-of-show, staffing models, vendor coordination and venue logistics
        &mdash; planned in advance and documented so it survives turnover.</p>
      </article>
    </div>

    <div class="btn-row" data-reveal>
      <a class="btn btn--field" href="consulting.html">See the engagements ${ARROW}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="sec-head sec-head--center">
      <div data-reveal>
        <p class="eyebrow">How we work</p>
        <h2 class="h2">Simple on purpose.</h2>
      </div>
    </div>

    <div class="steps">
      <div class="step" data-reveal>
        <p class="step__n">01</p>
        <h3 class="step__title">Audit</h3>
        <p class="step__body">
          We map what you sell, what you staff and what you broadcast &mdash; then
          show you where obligations are slipping and where hours are being burned.
        </p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">02</p>
        <h3 class="step__title">Install</h3>
        <p class="step__body">
          Command Center is configured around your sports, venues and season.
          Toolkit graphics are built to your brand and loaded into your production
          stack.
        </p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">03</p>
        <h3 class="step__title">Run it</h3>
        <p class="step__body">
          We stay on through your first events, train the staff who will own it,
          and leave you with a system that does not depend on any one person.
        </p>
      </div>
    </div>
  </div>
</section>

${ctaBand()}
`;

module.exports = page({
  title: 'Flux Athletics — Software, broadcast tools & consulting for sports',
  desc: 'Flux Athletics builds the Athletics Command Center for sponsorship and event logistics, the Broadcaster’s Toolkit for live sports graphics, and offers sports marketing, media and event management consulting.',
  page: 'home',
  body,
});
