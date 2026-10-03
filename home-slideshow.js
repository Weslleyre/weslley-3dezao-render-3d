(() => {
 const root = document.querySelector('.home-slideshow');
 if (!root) return;
 const images = [...root.querySelectorAll('img')];
 let current = 0;
 images[0].classList.add('is-active');
 root.classList.add('is-ready');
 setInterval(() => {
  if (document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  images[current].classList.remove('is-active');
  images[current].setAttribute('aria-hidden', 'true');
  current = (current + 1) % images.length;
  images[current].classList.add('is-active');
  images[current].removeAttribute('aria-hidden');
 }, 5000);
})();
