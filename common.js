document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
(() => {
  let active, pinned = false, timer;
  const close = () => {
    clearTimeout(timer);
    if (active) document.getElementById(active.getAttribute('aria-describedby')).hidden = true;
    active = null; pinned = false;
  };
  function position() {
    if (!active) return;
    const tip = document.getElementById(active.getAttribute('aria-describedby'));
    const r = active.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    const left = Math.max(12, Math.min(innerWidth-w-12,r.left+r.width/2-w/2));
    const above = r.top > h+20;
    tip.style.left = `${left}px`;
    tip.style.top = `${above?r.top-h-12:Math.min(innerHeight-h-12,r.bottom+12)}px`;
    tip.dataset.side = above?'above':'below';
    tip.style.setProperty('--tip-arrow',`${Math.max(18,Math.min(w-18,r.left+r.width/2-left))}px`);
  }
  document.querySelectorAll('[data-service-tip]').forEach((button,i) => {
    const tip = document.createElement('span');
    tip.id = `service-tip-${i}`; tip.className = 'service-tooltip'; tip.setAttribute('role','tooltip');
    tip.textContent = button.dataset.serviceTip; tip.hidden = true;
    document.body.append(tip); button.setAttribute('aria-describedby',tip.id);
    const show = () => {clearTimeout(timer);if(active!==button) close();active=button;tip.hidden=false;position();};
    const leave = () => {if(active===button&&!pinned)timer=setTimeout(close,160);};
    button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show();});
    button.addEventListener('pointerleave',leave);
    button.addEventListener('focus',show);
    button.addEventListener('blur',()=>{if(active===button)close();});
    button.addEventListener('click',()=>{if(active===button&&pinned)close();else{show();pinned=true;}});
    tip.addEventListener('pointerenter',show);
    tip.addEventListener('pointerleave',leave);
  });
  document.addEventListener('pointerdown',e=>{if(active&&!active.contains(e.target)&&!e.target.closest('.service-tooltip'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  addEventListener('resize',position); addEventListener('scroll',close,{passive:true});
})();
