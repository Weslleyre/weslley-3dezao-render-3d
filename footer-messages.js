(() => {
  const root = document.querySelector('.footer-messages');
  if (!root) return;
  const messages = [...root.querySelectorAll('.footer-message')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  setInterval(() => {
    if (document.hidden || reduce.matches) return;
    current = (current + 1) % messages.length;
    messages.forEach((message, index) => {
      message.classList.toggle('is-active', index === current);
      message.setAttribute('aria-hidden', String(index !== current));
    });
  }, 5000);
})();
