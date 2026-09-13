const { page, ctaBand, ARROW } = require('../shell.js');

const modules = [
  ['Sponsorship inventory', 'Every asset you sell — signage, PA reads, video board, digital, hospitality — catalogued once, with its own availability, rate and owner.'],
  ['Obligation tracking', 'Contracts become a checklist of deliverables mapped to specific dates and events, so a missed read is caught the same week, not at renewal.'],
  ['Proof of performance', 'Capture the evidence as it happens — timestamps, photos, as-run logs — and generate the recap a partner will actually renew against.'],
  ['Event staffing', 'Build shift templates per sport and venue, publish openings, assign crews, and track who confirmed, who checked in and who is short.'],
  ['Run of show', 'One shared timeline per event: load-in, rehearsal, promos, activations, media timeouts. Everyone works from the same document, live.'],
  ['Vendors &amp; venues', 'Keep vendor contacts, load-in windows, access requirements and venue-specific rules attached to the event instead of buried in email.'],
  ['Multi-sport scheduling', 'See the whole athletic calendar at once — overlapping events, shared staff, shared spaces — and catch conflicts before they are a Saturday problem.'],
  ['Reporting', 'Season-level views of fulfillment rate, staffing coverage and cost, ready to hand to a director, a partner or a board.'],
];

const faqs = [
  ['Who is the Command Center built for?', 'Athletic departments, conferences and venue operators who run a lot of events with a small full-time staff — the operations, marketing and external relations side rather than compliance or academics.'],
  ['Do we have to move everything at once?', 'No. Most groups start with one problem — usually sponsorship fulfillment or event staffing — get a season under their belt, then expand. The system is designed to be useful on day one with a single module in use.'],
  ['Can it work alongside our ticketing and CRM systems?', 'Yes. The Command Center is built to sit on the operations layer, not replace your ticketing or donor systems. We will map the handoffs during implementation.'],
  ['How long does implementation take?', 'It depends on how many sports and venues you run and how much of your inventory is already documented. We scope that in the audit before anyone signs anything.'],
  ['What happens when our staff turns over?', 'That is a large part of the point. Templates, run-of-show documents and fulfillment records stay with the department rather than leaving with the person who built them.'],
];

const body = `
<section class="page-hero">
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>Command Center</span></p>
    <p class="eyebrow">Athletics Command Center</p>
    <h1 class="page-hero__title">The operating system for your season.</h1>
    <p class="lead">
      Sponsorship obligations, event staffing and game day logistics in one place
      &mdash; so an athletic department running forty events a month can see all of
      them at once.
    </p>
    <div class="btn-row">
      <a class="btn" href="contact.html">Request a walkthrough ${ARROW}</a>
      <a class="btn btn--ghost" href="#modules">What&rsquo;s inside ${ARROW}</a>
    </div>
  </div>
</section>

<div class="shell">
  <div class="stats" data-reveal>
    <div class="stat">
      <p class="stat__k">One</p>
      <p class="stat__v">Shared source of truth for sponsorship, staffing and logistics &mdash; instead of three systems that disagree.</p>
    </div>
    <div class="stat">
      <p class="stat__k">Every</p>
      <p class="stat__v">Contracted obligation tracked to a date, an event and a person responsible for delivering it.</p>
    </div>
    <div class="stat">
      <p class="stat__k">Season</p>
      <p class="stat__v">Long records that survive staff turnover, so next year&rsquo;s team starts from what worked.</p>
    </div>
  </div>
</div>

<section class="section" id="problem">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow">The problem</p>
        <h2 class="h2">The work is not hard. Keeping track of it is.</h2>
      </div>
      <div data-reveal>
        <p class="lead">
          A single home football Saturday can carry a hundred contracted
          obligations, a hundred and fifty staff shifts and a dozen vendors on
          load-in windows that overlap. None of it is complicated on its own.
          All of it at once, across every sport, in spreadsheets and texts, is
          how things get missed.
        </p>
        <div class="feature-list">
          <div class="feature-list__item">
            <span class="feature-list__num">01</span>
            <div>
              <p class="feature-list__title">Obligations slip quietly</p>
              <p class="feature-list__body">A missed PA read or video board spot rarely gets noticed until a partner asks for a recap at renewal time.</p>
            </div>
          </div>
          <div class="feature-list__item">
            <span class="feature-list__num">02</span>
            <div>
              <p class="feature-list__title">Staffing runs on memory</p>
              <p class="feature-list__body">Who works which gate, who confirmed, who no-showed last time — usually known by one person, stored nowhere.</p>
            </div>
          </div>
          <div class="feature-list__item">
            <span class="feature-list__num">03</span>
            <div>
              <p class="feature-list__title">Nothing carries forward</p>
              <p class="feature-list__body">When a coordinator leaves, the run-of-show and the vendor relationships tend to leave with them.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section panel--light" id="modules">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">Modules</p>
        <h2 class="h2">What&rsquo;s inside.</h2>
      </div>
      <p class="lead" data-reveal>
        Start with the piece that hurts most. Add the rest when you are ready
        &mdash; everything shares the same calendar, the same venues and the same
        people.
      </p>
    </div>

    <div class="cards cards--3">
      ${modules.map(([t, d]) => `<article class="card" data-reveal>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="sec-head sec-head--center">
      <div data-reveal>
        <p class="eyebrow">Getting started</p>
        <h2 class="h2">From audit to first event.</h2>
      </div>
    </div>
    <div class="steps">
      <div class="step" data-reveal>
        <p class="step__n">01</p>
        <h3 class="step__title">Audit</h3>
        <p class="step__body">We inventory what you sell and what you staff, and identify where obligations are currently being tracked — or not.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">02</p>
        <h3 class="step__title">Configure</h3>
        <p class="step__body">Your sports, venues, shift templates and partner contracts are loaded in, so the system reflects how your department actually operates.</p>
      </div>
      <div class="step" data-reveal>
        <p class="step__n">03</p>
        <h3 class="step__title">Run a live event</h3>
        <p class="step__body">We are on site or on call for your first events, training the staff who will own it day to day.</p>
      </div>
    </div>
  </div>
</section>

<section class="section panel--light">
  <div class="shell">
    <div class="sec-head">
      <div data-reveal>
        <p class="eyebrow">Questions</p>
        <h2 class="h2">Before you ask.</h2>
      </div>
    </div>
    <div class="accordion" data-reveal>
      ${faqs.map(([q, a], i) => `<div class="acc">
        <h3>
          <button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}">
            ${q}
            <span class="acc__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="acc__panel" id="faq-${i}" data-open="false"><div><p>${a}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand({
  title: 'See it against your own season.',
  body: 'Send us a real weekend from your calendar and we will walk you through how the Command Center would have handled it.',
  label: 'Request a walkthrough',
})}
`;

module.exports = page({
  title: 'Athletics Command Center — Sponsorship & event logistics software | Flux Athletics',
  desc: 'The Athletics Command Center gives athletic departments one system for sponsorship inventory and fulfillment, event staffing, run-of-show and game day logistics.',
  page: 'command-center',
  body,
});
