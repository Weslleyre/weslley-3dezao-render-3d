(() => {
  const links = [...document.querySelectorAll('.backstage-gallery .backstage-image')];
  const dialog = document.querySelector('.backstage-lightbox');
  if (!links.length || !dialog || !dialog.showModal) return;
  const image = dialog.querySelector('.backstage-full');
  const caption = dialog.querySelector('#backstage-caption');
  const close = dialog.querySelector('.backstage-close');
  const previous = dialog.querySelector('.backstage-prev');
  const next = dialog.querySelector('.backstage-next');
  const controls = [close, previous, next];
  let index = 0, opener, scrollY = 0, animation;
  function restore() {
    animation?.cancel();
    document.body.classList.remove('backstage-open');
    document.body.style.removeProperty('--backstage-scroll');
    window.scrollTo({top:scrollY,behavior:'instant'});
    opener?.focus({preventScroll:true});
  }
  function show(value) {
    index = (value + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = `${index + 1} / ${links.length} — ${image.alt}`;
    animation?.cancel();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation = image.animate([{opacity:0},{opacity:1}], {duration:160,easing:'ease-out'});
    }
  }
  links.forEach((link, i) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!dialog.open && document.body.classList.contains('backstage-open')) restore();
      opener = link;
      scrollY = window.scrollY;
      show(i);
      document.body.style.setProperty('--backstage-scroll', `-${scrollY}px`);
      document.body.classList.add('backstage-open');
      dialog.showModal();
      close.focus({preventScroll:true});
    });
    link.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); link.click(); }
    });
  });
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const current = controls.indexOf(document.activeElement);
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });
  dialog.addEventListener('close', () => {
    // A queued close event must not reset a gallery that has already reopened.
    if (dialog.open) return;
    restore();
  });
})();
