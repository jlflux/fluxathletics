const { page, ctaBand, ARROW } = require('../shell.js');

const practices = [
  ['Sponsorship strategy &amp; valuation', 'What your inventory is actually worth, what is being under-sold, and how to package it so renewals are a conversation about results rather than rate cards.'],
  ['Partner activation', 'Turning a signed deal into something a fan notices — activation concepts your venue and staff can genuinely execute on a game day.'],
  ['Media &amp; broadcast strategy', 'Production standards, rights and distribution decisions, and a realistic plan for the number of shows you want to put out this season.'],
  ['Event management', 'Run-of-show design, vendor coordination, venue flow and contingency planning for events from a home doubleheader to a championship weekend.'],
  ['Staffing models', 'How many people you need, in which roles, at what cost — plus the training and documentation that keeps it working after turnover.'],
  ['Brand &amp; marketing', 'Positioning, creative direction and campaign planning for departments, events and properties that need to sell tickets and partnerships.'],
];

const body = `
<section class="page-hero" style="--accent: var(--field); --glow: rgba(184,255,60,.16)">
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>Consulting</span></p>
    <p class="eyebrow">Consulting</p>
    <h1 class="page-hero__title">Advice from inside the operation.</h1>
    <p class="lead">
      Sports marketing, media and event management consulting for athletic
      departments, rights holders and properties &mdash; from people who build
      the software and work the events.
    </p>
    <div class="btn-row">
      <a class="btn btn--field" href="contact.html">Start a conversation ${ARROW}</a>
      <a class="btn btn--ghost" href="#practices">What we advise on ${ARROW}</a>
    </div>
  </div>
</section>

<section class="section" style="--accent: var(--field)">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">Why us</p>
        <h2 class="h2">We do not hand you a deck and leave.</h2>
      </div>
      <p class="lead" data-reveal>
        Most strategy work in this industry stops at the recommendation. Ours
        does not, because we also build the tools that carry it out. When we tell
        you an inventory should be repackaged or a staffing model should change,
        we can show you the system that makes it hold up over a full season
        &mdash; and we are there when it goes live.
      </p>
    </div>
  </div>
</section>

<section class="section panel--light" id="practices" style="--accent: var(--field)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">Practice areas</p>
        <h2 class="h2">What we<br>advise on.</h2>
      </div>
      <p class="lead" data-reveal>
        Engagements usually start in one of these and grow into the next. We are
        happy to be brought in for a single question.
      </p>
    </div>
    <div class="cards cards--3">
      ${practices.map(([t, d]) => `<article class="card" data-reveal>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" style="--accent: var(--field)">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">Engagements</p>
        <h2 class="h2">Three ways<br>to work<br>together.</h2>
      </div>
      <p class="lead" data-reveal>
        Scope and fees are set after a first conversation, because the right
        shape depends on whether you need an answer, a plan or a pair of hands.
      </p>
    </div>

    <div class="cards cards--3">
      <article class="card" data-reveal>
        <p class="pillar__num" style="color:var(--field)">01 / Short</p>
        <h3>The audit</h3>
        <p>A fixed-scope review of your sponsorship inventory, event operation or
        broadcast workflow, ending in a written set of findings and a prioritised
        list of what to fix first.</p>
      </article>
      <article class="card" data-reveal>
        <p class="pillar__num" style="color:var(--field)">02 / Project</p>
        <h3>The build</h3>
        <p>We design the thing and stand it up with you &mdash; a new partnership
        package, an event plan, a staffing model, a production standard &mdash;
        through to its first live use.</p>
      </article>
      <article class="card" data-reveal>
        <p class="pillar__num" style="color:var(--field)">03 / Ongoing</p>
        <h3>The season</h3>
        <p>Retained advisory across a competition year: planning ahead of each
        window, on-call through event weeks, and a review when the season closes.</p>
      </article>
    </div>
  </div>
</section>

<section class="section panel--light" style="--accent: var(--field)">
  <div class="shell">
    <div class="sec-head sec-head--center">
      <div data-reveal>
        <p class="eyebrow">Process</p>
        <h2 class="h2">How an engagement runs.</h2>
      </div>
    </div>
    <div class="steps">
      <div class="step" data-reveal>
        <p class="step__n">01</p>
        <h3 class="step__title">Listen</h3>
        <p class="step__body">A working session with the people who actually run it — not just the people who sign the contract.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">02</p>
        <h3 class="step__title">Recommend</h3>
        <p class="step__body">Findings written plainly, ordered by what will change the most for the least disruption to your calendar.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">03</p>
        <h3 class="step__title">Implement</h3>
        <p class="step__body">We stay through execution, whether that means standing up the Command Center, rebuilding a package, or working the event with you.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Bring us the problem you keep postponing.',
  body: 'A first conversation costs nothing and usually ends with a clear idea of whether we are the right people for it.',
  label: 'Start a conversation',
})}
`;

module.exports = page({
  title: 'Consulting — Sports marketing, media & event management | Flux Athletics',
  desc: 'Flux Athletics consulting: sponsorship strategy and valuation, media and broadcast strategy, event management, staffing models and marketing for athletic departments and rights holders.',
  page: 'consulting',
  body,
});
