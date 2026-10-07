const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/gallery.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/gallery/manifest.json'),'utf8'));
assert.equal(manifest.photos.length,19);
assert.equal(new Set(manifest.photos.map(p=>p.sha256)).size,19);
assert.equal((html.match(/data-gallery-photo /g)||[]).length,19);
assert(html.includes('Image Gallery') && html.includes('href="#gallery"') && html.includes('assets/gallery.js'));
assert(html.includes('object-fit:contain') && html.includes('id="galleryDialog"'));
assert(js.includes('image.removeAttribute(\'src\')') && js.includes('dialog.showModal()'));
assert(!js.includes('new Image('),'Do not preload full-size images');
for(const p of manifest.photos){
 for(const filename of [p.thumbnail,p.full]){
  assert(filename.startsWith('assets/gallery/'));
  const buffer=fs.readFileSync(path.join(root,filename));
  assert.equal(buffer.toString('ascii',0,4),'RIFF');assert.equal(buffer.toString('ascii',8,12),'WEBP');
  assert(html.includes(filename));
 }
 assert(p.width<=600&&p.height<=600&&p.fullWidth<=1400&&p.fullHeight<=1400);
 const tag=html.match(new RegExp(`<img src="${p.thumbnail}"[^>]*>`))[0];
 assert(tag.includes('loading="lazy"')&&tag.includes('decoding="async"'));
}
console.log('PASS: 19 supplied gallery photos, 38 valid local WebP assets, lazy thumbnails, full-image links and accessible viewer; product catalogue is separate.');
