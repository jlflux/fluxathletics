const { page, ARROW, EMAIL } = require('../shell.js');

const body = `
<section class="page-hero">
  <div class="page-hero__glow" aria-hidden="true"></div>
  <div class="shell page-hero__inner">
    <p class="breadcrumb"><a href="index.html">Flux Athletics</a> / <span>Contact</span></p>
    <p class="eyebrow">Contact</p>
    <h1 class="page-hero__title">Let&rsquo;s talk.</h1>
    <p class="lead">
      Tell us what you run and what is breaking. We reply to everything within
      one business day.
    </p>
  </div>
</section>

<section class="section section--tight section--flush-top">
  <div class="shell">
    <div class="split split--top">
      <div data-reveal>
        <!-- FORM SETUP -------------------------------------------------------
             As written, this form opens the visitor's email client with the
             answers pre-filled — it works with no backend.

             To collect submissions properly, set action="" below to a form
             endpoint (Formspree, Netlify Forms, Basin, your own handler) and
             main.js will POST to it in the background instead.
        ------------------------------------------------------------------- -->
        <form class="form" data-contact-form action="" method="post" data-mailto="${EMAIL}" novalidate>
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
              <label for="interest">I&rsquo;m interested in</label>
              <select id="interest" name="interest">
                <option>Athletics Command Center</option>
                <option>Broadcaster&rsquo;s Toolkit</option>
                <option>Consulting</option>
                <option>Something else</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="message">What are you working on?</label>
            <textarea id="message" name="message" placeholder="Sports you run, venues, crew size, and the part that keeps going wrong."></textarea>
          </div>

          <div class="btn-row" style="margin-top:1rem;align-items:center">
            <button class="btn" type="submit">Send it ${ARROW}</button>
            <p class="form__status" role="status" aria-live="polite"></p>
          </div>
          <p class="form__note">
            Prefer email? <a class="link" href="mailto:${EMAIL}" style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0">${EMAIL}</a>
          </p>
        </form>
      </div>

      <div data-reveal>
        <div class="detail-list">
          <div>
            <p class="detail__k">Email</p>
            <p class="detail__v"><a class="link" href="mailto:${EMAIL}" style="font-size:inherit;font-family:inherit;text-transform:none;letter-spacing:0">${EMAIL}</a></p>
          </div>
          <!-- EDIT ME: add phone, address and social links when you have them. -->
          <div>
            <p class="detail__k">What to expect</p>
            <p class="detail__v" style="color:var(--on-dark-muted)">
              A reply within one business day, and a 30-minute call if it looks
              like a fit. No deck, no pitch &mdash; we would rather hear how your
              operation actually runs.
            </p>
          </div>
          <div>
            <p class="detail__k">Good things to include</p>
            <ul style="color:var(--on-dark-muted);display:grid;gap:.5rem;margin-top:.25rem">
              <li>&mdash; Sports and venues you cover</li>
              <li>&mdash; How many events in a typical month</li>
              <li>&mdash; Your production stack, if broadcast is involved</li>
              <li>&mdash; When your season starts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

module.exports = page({
  title: 'Contact — Flux Athletics',
  desc: 'Get in touch with Flux Athletics about the Athletics Command Center, the Broadcaster’s Toolkit, or sports marketing, media and event management consulting.',
  page: 'contact',
  body,
});
