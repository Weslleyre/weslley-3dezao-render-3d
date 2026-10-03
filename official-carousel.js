(() => {
 const root=document.querySelector('.official-carousel'); if(!root)return;
 const slides=[...root.querySelectorAll('.official-slide')], dots=[...root.querySelectorAll('[data-banner]')], pause=root.querySelector('.official-pause');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'); let current=0,paused=reduce.matches,timer;
 function show(i){current=i; slides.forEach((s,n)=>{s.classList.toggle('is-active',n===i);s.inert=n!==i;s.setAttribute('aria-hidden',String(n!==i));dots[n].setAttribute('aria-pressed',String(n===i));});}
 function run(){clearInterval(timer);pause.textContent=paused?'Reproduzir':'Pausar';pause.setAttribute('aria-label',paused?'Reproduzir banners':'Pausar banners');if(!paused&&!document.hidden)timer=setInterval(()=>{if(!slides[current].contains(document.activeElement))show((current+1)%slides.length);},5000);}
 dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);run();}));pause.addEventListener('click',()=>{paused=!paused;run();});document.addEventListener('visibilitychange',run);reduce.addEventListener('change',()=>{paused=reduce.matches;run();});run();
})();
