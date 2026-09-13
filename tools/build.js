/* Regenerates the .html files in the repo root from tools/shell.js (header,
   footer, <head>) + tools/pages/*.js (per-page content).

   OPTIONAL. The committed .html files are the deliverable — you can edit them
   directly and never run this. It exists so the header, footer and meta tags
   only have to be changed in one place.

   If you have hand-edited the .html files, running this WILL overwrite those
   edits. Run: npm run build */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = {
  'index.html': 'home',
  'command-center.html': 'cc',
  'broadcasters-toolkit.html': 'bt',
  'consulting.html': 'con',
  'about.html': 'about',
  'contact.html': 'contact',
  '404.html': '404',
};

for (const [file, mod] of Object.entries(PAGES)) {
  const html = require(path.join(__dirname, 'pages', mod + '.js'));
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log('wrote', file, `(${html.length} bytes)`);
}
