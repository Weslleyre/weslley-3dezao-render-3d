(() => {
 const intervals = [3000, 4000, 5000, 4500];
 document.querySelectorAll('.portfolio-slideshow').forEach((group, groupIndex) => {
  const images = [...group.querySelectorAll('img')];
  let current = 0;
  setInterval(() => {
   if (document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   current = (current + 1) % images.length;
   images.forEach((image, index) => {
    image.classList.toggle('is-active', index === current);
    image.setAttribute('aria-hidden', String(index !== current));
   });
  }, intervals[groupIndex % intervals.length]);
 });
})();
