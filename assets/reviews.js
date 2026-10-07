/* Static-site reviews: clearly identified samples and private browser drafts.
 * No Google reviews, public ratings, or verified customer feedback are invented.
 */
(() => {
  'use strict';
  const samples = [
    {name:'Kasun Perera', rating:5, text:'Helpful advice for choosing the right tools for a home repair.'},
    {name:'Nimal Jayasinghe', rating:4, text:'A useful selection of everyday hardware. I would like to see more sizes available.'},
    {name:'Chamari Dissanayake', rating:3, text:'The essentials are convenient to find. Clearer information about stock would help.'},
    {name:'Saman Wijesinghe', rating:4, text:'A practical place to look for plumbing fittings and small project supplies.'},
    {name:'Dilini Karunaratne', rating:5, text:'Friendly product guidance makes planning a painting project easier.'},
    {name:'Pradeep Senanayake', rating:4, text:'Good variety for repair work. More product specifications would be useful.'}
  ];
  const key = 'polwaththa-review-drafts-v1';
  const form = document.getElementById('reviewForm');
  if (!form) return;
  const status = document.getElementById('reviewStatus');
  let drafts = [];
  const valid = p => p && typeof p.name === 'string' && p.name.trim().length > 0 && p.name.length <= 60 && typeof p.text === 'string' && p.text.trim().length > 0 && p.text.length <= 700 && Number.isInteger(p.rating) && p.rating >= 1 && p.rating <= 5;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) drafts = stored.filter(valid).slice(0,20);
  } catch (_) { /* Private browsing or malformed storage must not break the site. */ }
  function reviewCard(review, sample, index) {
    const card = document.createElement('article');
    card.className = 'review-card';
    const top = document.createElement('div'); top.className = 'review-top';
    const avatar = document.createElement('span'); avatar.className = 'review-avatar'; avatar.setAttribute('aria-hidden','true');
    avatar.textContent = review.name.trim().split(/\s+/).slice(0,2).map(s=>Array.from(s)[0]).join('').toUpperCase();
    const identity = document.createElement('div');
    const name = document.createElement('h4'); name.textContent = review.name;
    const label = document.createElement('p'); label.className = 'review-label';
    label.textContent = sample ? 'Sample review · fictional example' : 'Your private draft · not published';
    identity.append(name,label); top.append(avatar,identity);
    const stars = document.createElement('div'); stars.className = 'review-stars'; stars.setAttribute('role','img'); stars.setAttribute('aria-label',`${review.rating} out of 5 stars`);
    stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5-review.rating);
    const text = document.createElement('p'); text.className = 'review-text'; text.textContent = review.text;
    card.append(top,stars,text);
    if (!sample) {
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'review-remove'; remove.textContent = 'Remove draft';
      remove.setAttribute('aria-label',`Remove draft by ${review.name}`);
      remove.addEventListener('click',()=>{drafts.splice(index,1);persist();renderDrafts();status.textContent='Draft removed from this browser.';});
      card.append(remove);
    }
    return card;
  }
  document.getElementById('sampleReviews').replaceChildren(...samples.map(r=>reviewCard(r,true)));
  function persist() {
    try { localStorage.setItem(key,JSON.stringify(drafts)); return true; }
    catch (_) { return false; }
  }
  function renderDrafts() {
    document.getElementById('reviewDrafts').replaceChildren(...drafts.map((r,i)=>reviewCard(r,false,i)));
    document.getElementById('draftHeading').hidden = !drafts.length;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const review = {name:String(fields.get('name')).trim(),rating:Number(fields.get('rating')),text:String(fields.get('review')).trim()};
    if (!valid(review)) { status.textContent='Please add your name, a rating and a review.'; return; }
    drafts.unshift(review); drafts = drafts.slice(0,20);
    const saved = persist(); renderDrafts();
    const email = document.getElementById('sendReview');
    const body = `Name: ${review.name}\nRating: ${review.rating}/5\n\n${review.text}\n\nPlease contact me before publishing this review with my name.`;
    email.href = `mailto:polwaththahardware2024@gmail.com?subject=${encodeURIComponent('Website review — Polwaththa Hardware')}&body=${encodeURIComponent(body)}`;
    email.hidden = false;
    status.textContent = saved ? 'Draft saved only in this browser. To submit it to the shop, choose “Send review by email” and send the message from your email app.' : 'Draft preview ready, but browser storage is unavailable. Use “Send review by email” to send it to the shop.';
  });
  form.addEventListener('input',()=>{document.getElementById('sendReview').hidden=true;});
  renderDrafts();
})();
