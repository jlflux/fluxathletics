/* Renders every static file in the repo from content.json.

   Run: npm run build

   content.json is the single source of truth for all copy, links, brand
   colours and meta tags. tools/templates.js turns it into HTML. The admin at
   /admin.html runs those same templates in the browser, so a publish from the
   admin produces byte-identical output to this script. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const templates = require('./templates.js');
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));

/* Guard: an empty list or blank string almost always means a mis-keyed edit in
   content.json, which would silently render a section with nothing in it. */
function validate(node, path, problems) {
  if (Array.isArray(node)) {
    if (node.length === 0) problems.push(path + ' is an empty list');
    node.forEach((v, i) => validate(v, path + '[' + i + ']', problems));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) validate(v, path ? path + '.' + k : k, problems);
  } else if (typeof node === 'string' && node.trim() === '' && !path.endsWith('form.action')) {
    problems.push(path + ' is blank');
  }
  return problems;
}

const problems = validate(content, '', []);
if (problems.length) {
  console.error('content.json problems:\n  ' + problems.join('\n  ') + '\n');
  process.exit(1);
}

const files = templates.renderAll(content);
let n = 0;

for (const [rel, body] of Object.entries(files)) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);
  console.log('  ' + rel.padEnd(30) + body.length + ' bytes');
  n++;
}
console.log(`\nbuilt ${n} files from content.json`);
