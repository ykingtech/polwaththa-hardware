const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/catalog-data.js'), 'utf8'), context);
const data = context.window.POLWATHTHA_CATALOG;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'assets/catalog.js'), 'utf8');
assert.equal(data.categories.length, 19);
assert.equal(data.categories.reduce((n, c) => n + c.items.length, 0), 382);
assert.equal(data.categories.flatMap(c => c.items).filter(p => p.local).length, 49);
assert.equal(data.paints.length, 4);
assert(!/makeProductSvg|svgMarkup|emojiFor|generated-thumb|data:image\/svg/.test(html + runtime));
assert(html.includes('assets/brand/owner.jpeg') && html.includes('assets/brand/polwaththa-logo.png'));
assert(fs.existsSync(path.join(root, 'Business R pdf.pdf')));
assert(html.includes('object-fit:contain'));
const photos = data.categories.flatMap(c => c.items).concat(data.paints);
for (const item of photos) {
  assert(item.name && item.image, 'Product must have a name and photograph');
  assert(!/^(https?:|data:)/.test(item.image), `Not a local photograph: ${item.name}`);
  const absolute = path.resolve(root, item.image);
  assert(absolute.startsWith(root + path.sep));
  assert(fs.existsSync(absolute), `Missing photograph: ${item.name}`);
  assert(!/owner|polwaththa-logo/.test(item.image), 'Portrait or logo used as a product');
  const bytes = fs.readFileSync(absolute);
  if (!item.local) {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert(item.source?.startsWith('https://'));
    assert(item.width > 0 && item.width <= 640 && item.height > 0 && item.height <= 640);
  }
  // Enforce exact filename casing for Linux/GitHub hosting, not only Windows.
  let dir = root;
  for (const part of item.image.split('/')) {
    assert(fs.readdirSync(dir).includes(part), `Wrong filename case: ${item.image}`);
    dir = path.join(dir, part);
  }
}
console.log(`PASS: 19 categories, 382 product cards, 4 paints, 49 supplied photos; every photograph exists locally with correct case.`);
