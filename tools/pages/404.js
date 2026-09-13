const { page, ARROW } = require('../shell.js');
const body = `
<section class="hero" style="min-height:auto;padding-bottom:var(--section)">
  <div class="hero__bg" aria-hidden="true"><div class="hero__grid"></div><div class="hero__glow"></div></div>
  <div class="shell hero__inner">
    <p class="eyebrow">Error 404</p>
    <h1 class="hero__title" style="font-size:var(--fs-display)">Off the<br>field.</h1>
    <p class="lead" style="margin-top:2rem">
      That page does not exist &mdash; or it moved. Here is the way back.
    </p>
    <div class="btn-row">
      <a class="btn" href="index.html">Back to home ${ARROW}</a>
      <a class="btn btn--ghost" href="contact.html">Contact us ${ARROW}</a>
    </div>
  </div>
</section>
`;
module.exports = page({
  title: 'Page not found — Flux Athletics',
  desc: 'That page could not be found.',
  page: '404',
  body,
});
