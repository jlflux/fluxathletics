/* QA screenshots: npm run shots [outDir] */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, '..', '.shots');
const PAGES = ['index', 'command-center', 'broadcasters-toolkit', 'consulting', 'about', 'contact'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    for (const p of PAGES) {
      const page = await ctx.newPage();
      await page.goto('http://localhost:8080/' + p + '.html', { waitUntil: 'networkidle' });
      await page.evaluate(() => new Promise(r => {
        window.scrollTo(0, document.body.scrollHeight); // trigger reveals
        setTimeout(() => { window.scrollTo(0, 0); setTimeout(r, 600); }, 900);
      }));
      await page.screenshot({ path: path.join(OUT, `${p}-${label}.png`), fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log('screenshots →', OUT);
})();
