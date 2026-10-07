/* Progressive enhancement: thumbnail links also work without JavaScript. */
(() => {
  'use strict';
  const grid=document.getElementById('galleryGrid');
  const dialog=document.getElementById('galleryDialog');
  if (!grid || !dialog || typeof dialog.showModal !== 'function') return;
  const links=[...grid.querySelectorAll('[data-gallery-photo]')];
  const image=document.getElementById('galleryFullImage');
  const caption=document.getElementById('galleryCaption');
  const status=document.getElementById('galleryImageStatus');
  let index=0,opener,previousOverflow;
  function display(next) {
    index=(next+links.length)%links.length;
    const link=links[index],thumb=link.querySelector('img');
    caption.textContent=`${thumb.alt} · ${index+1} / ${links.length}`;
    status.textContent='Loading photograph…';
    image.alt=thumb.alt;
    image.width=Number(link.dataset.fullWidth);
    image.height=Number(link.dataset.fullHeight);
    image.src=link.href; // Only one full-size photo is requested at a time.
    document.getElementById('galleryOriginalLink').href=link.href;
  }
  image.addEventListener('load',()=>{status.textContent='';});
  image.addEventListener('error',()=>{if(dialog.open)status.textContent='The photograph could not load. Try opening it in a new tab.';});
  grid.addEventListener('click',event=>{
    const link=event.target.closest('[data-gallery-photo]');
    if(!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button!==0) return;
    event.preventDefault();opener=link;
    previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.showModal();display(links.indexOf(link));
  });
  document.getElementById('galleryPrevious').addEventListener('click',()=>display(index-1));
  document.getElementById('galleryNext').addEventListener('click',()=>display(index+1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();display(index-1);}
    if(event.key==='ArrowRight'){event.preventDefault();display(index+1);}
  });
  dialog.addEventListener('close',()=>{
    image.removeAttribute('src'); // Release the full-size image on close.
    status.textContent='';document.body.style.overflow=previousOverflow||'';
    opener?.focus({preventScroll:true});
  });
})();
