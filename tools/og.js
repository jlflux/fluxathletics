/* Renders assets/img/og.png (1200x630 social card) from tools/og-card.html.
   Run: npm run og   (requires devDependency `playwright`) */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'og-card.html'));

  /* Pull the brand colours from content.json so the share card can never drift
     out of sync with the site the way it did after the first colour change. */
  const brand = JSON.parse(
    require('fs').readFileSync(path.join(__dirname, '..', 'content.json'), 'utf8')
  ).brand || {};
  await page.evaluate((b) => {
    const r = document.documentElement.style;
    if (b.primary) r.setProperty('--primary', b.primary);
    if (b.support) r.setProperty('--support', b.support);
    if (b.ink) r.setProperty('--ink', b.ink);
    if (b.paper) r.setProperty('--paper', b.paper);
  }, brand);

  await page.waitForTimeout(1200); // let webfonts settle
  await page.screenshot({ path: path.join(__dirname, '..', 'assets', 'img', 'og.png') });
  await browser.close();
  console.log('wrote assets/img/og.png');
})();
