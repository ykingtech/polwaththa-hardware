/* Independent mobile navigation; it does not depend on the product catalogue. */
(() => {
  const button=document.getElementById('menuBtn'),menu=document.getElementById('menu');
  if(!button||!menu)return;
  const desktop=window.matchMedia('(min-width:1024px)');
  function setOpen(open){
    menu.dataset.open=String(open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Close menu':'Open menu');
    button.textContent=open?'×':'☰';
  }
  button.addEventListener('click',()=>setOpen(menu.dataset.open!=='true'));
  menu.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false);});
  document.addEventListener('pointerdown',event=>{
    if(menu.dataset.open==='true'&&!menu.contains(event.target)&&!button.contains(event.target))setOpen(false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&menu.dataset.open==='true'){setOpen(false);button.focus();}
  });
  document.addEventListener('focusin',event=>{
    if(menu.dataset.open==='true'&&!menu.contains(event.target)&&!button.contains(event.target))setOpen(false);
  });
  desktop.addEventListener('change',()=>setOpen(false));
  setOpen(false);
})();
