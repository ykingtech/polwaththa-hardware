/* One photo renderer; no SVG/emoji replacement scripts or remote hotlinks. */
(() => {
  'use strict';
  const finish = () => document.body.classList.add('ready');
  finish(); // Never wait for product photographs before opening the site.
  const data = window.POLWATHTHA_CATALOG;
  const categories = document.getElementById('categories');
  const panel = document.getElementById('productPanel');
  const grid = document.getElementById('productGrid');
  const title = document.getElementById('categoryTitle');
  if (!data || !data.categories.length) {
    categories.textContent = 'The catalogue could not load. Please refresh or contact the shop.';
    return;
  }
  const esc = text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const photo = item => `<img src="${esc(encodeURI(item.image))}" width="${item.width || 640}" height="${item.height || 640}" loading="lazy" decoding="async" alt="${esc(item.name)}">`;
  const card = item => `<article class="product bg-white rounded-2xl overflow-hidden border border-slate-200">${photo(item)}<div class="p-4"><h4 class="font-bold">${esc(item.name)}</h4><p class="text-slate-500 text-sm mt-1">${esc(item.note)}</p>${item.source ? `<a class="text-xs text-slate-500 underline inline-block mt-3" href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">Photo source</a>` : ''}</div></article>`;
  categories.innerHTML = data.categories.map((group, index) => {
    const supplied = group.items.filter(item => item.local).length;
    const added = group.items.length - supplied;
    const count = supplied ? `${supplied} supplied photos + ${added} illustrated items` : `${added} illustrated product items`;
    return `<button type="button" class="category text-left bg-white rounded-2xl overflow-hidden border border-slate-200" data-category="${index}"><div class="category-preview">${group.items.slice(0, 4).map(photo).join('')}</div><div class="p-5"><small class="text-[#aa7821] uppercase tracking-widest text-[10px] font-bold">Department ${String(index + 1).padStart(2, '0')}</small><h3 class="font-bold text-2xl mt-2">${esc(group.name)}</h3><p class="text-slate-500 text-sm mt-2">${count} · Open collection →</p></div></button>`;
  }).join('');
  let previousButton;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  categories.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    const group = data.categories[Number(button.dataset.category)];
    if (!group) return;
    previousButton = button;
    title.textContent = group.name;
    grid.innerHTML = group.items.map(card).join('');
    categories.classList.add('hidden');
    panel.classList.remove('hidden');
    title.focus({preventScroll:true});
    document.getElementById('products').scrollIntoView({behavior:reducedMotion ? 'auto' : 'smooth'});
  });
  document.getElementById('backBtn').addEventListener('click', () => {
    panel.classList.add('hidden');
    grid.replaceChildren(); // Release the previous category's image elements.
    categories.classList.remove('hidden');
    previousButton?.focus({preventScroll:true});
    document.getElementById('products').scrollIntoView({behavior:reducedMotion ? 'auto' : 'smooth'});
  });
  document.getElementById('paintGrid').innerHTML = data.paints.map(card).join('');
  const menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', () => {
    const hidden = document.getElementById('menu').classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!hidden));
  });
  // Keep the name and card visible even if an asset is accidentally missing.
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.product, .category-preview')) return;
    const message = document.createElement('div');
    message.className = 'photo-unavailable';
    message.textContent = `${img.alt} — photograph unavailable`;
    img.replaceWith(message);
  }, true);
})();
