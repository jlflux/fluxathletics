const { page, ctaBand, ARROW } = require('../shell.js');

const beliefs = [
  ['Operations is the product', 'The scoreboard is the visible part. What decides whether a season goes well is whether the load-in window held and the read got made.'],
  ['Tools should fit the crew you have', 'Nobody in college athletics is getting a bigger staff next year. Everything we build assumes fewer people, not more.'],
  ['Prove it or do not sell it', 'A sponsorship is worth what you can demonstrate you delivered. We build for evidence, because renewals are won with it.'],
  ['Simple beats complete', 'A system people actually use on a Saturday is worth more than a comprehensive one they abandon by October.'],
];

const body = `
<section class="page-hero">
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>About</span></p>
    <p class="eyebrow">About</p>
    <h1 class="page-hero__title">We build for the people in the back of house.</h1>
    <p class="lead">
      Flux Athletics makes software, broadcast tools and strategy for the side of
      sports the crowd never sees &mdash; the operations, partnerships and
      production work that decides whether an event actually lands.
    </p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">The company</p>
        <h2 class="h2">One company,<br>three fronts.</h2>
      </div>
      <div data-reveal>
        <p class="lead">
          We started from a simple observation: the same athletic department that
          cannot prove a sponsor read happened is also the one asking a student
          operator to run graphics for a conference broadcast. Those are not
          separate problems. They are the same shortage of time, people and
          systems.
        </p>
        <p class="lead" style="margin-top:1.5rem">
          So we work on all three: the
          <a class="link" href="command-center.html" style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0">Athletics Command Center</a>
          for the logistics, the
          <a class="link" href="broadcasters-toolkit.html" style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0">Broadcaster&rsquo;s Toolkit</a>
          for what goes on screen, and
          <a class="link" href="consulting.html" style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0">consulting</a>
          for the decisions no software can make for you.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section panel--light">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">What we believe</p>
        <h2 class="h2">Four things<br>we keep<br>coming back to.</h2>
      </div>
    </div>
    <div class="cards">
      ${beliefs.map(([t, d], i) => `<article class="card" data-reveal>
        <p class="pillar__num" style="color:var(--flux)">0${i + 1}</p>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- EDIT ME ------------------------------------------------------------------
     This section is intentionally generic. Replace it with your real founding
     story, background and team. Anything specific — years in the industry,
     events worked, clients, headcount — should be written by you so it is
     accurate.
--------------------------------------------------------------------------- -->
<section class="section">
  <div class="shell">
    <div class="split split--reverse">
      <div data-reveal>
        <p class="eyebrow">Who you work with</p>
        <h2 class="h2">Small team. Direct line.</h2>
        <p class="lead" style="margin-top:1.75rem">
          You will not be handed to an account manager. The people who scope the
          work are the people who do it, and you will have their number during
          your event weeks.
        </p>
        <div class="btn-row">
          <a class="btn" href="contact.html">Talk to us ${ARROW}</a>
        </div>
      </div>
      <div class="stats" data-reveal style="grid-template-columns:1fr">
        <div class="stat">
          <p class="stat__k">Built by operators</p>
          <p class="stat__v">Product decisions come from event weeks, not from a roadmap meeting.</p>
        </div>
        <div class="stat">
          <p class="stat__k">On site when it counts</p>
          <p class="stat__v">We are reachable through your first live events, every time.</p>
        </div>
      </div>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Come tell us what your Saturdays look like.',
  body: 'The best first conversation is a plain description of one event week — what goes right, and what you are always chasing.',
})}
`;

module.exports = page({
  title: 'About — Flux Athletics',
  desc: 'Flux Athletics builds software, broadcast tools and strategy for the operations, partnerships and production side of sports.',
  page: 'about',
  body,
});
