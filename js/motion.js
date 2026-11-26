// Home motion: one entrance, the hero drawing itself, quiet reveals. All of it
// switches off for people who ask their device for reduced motion.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  if (reduce) { root.classList.add('motion-off'); }

  // 1. Hero: the graphite drawing resolves, then the finished art fades in under it.
  const draw = document.querySelector('.hero-draw');
  if (draw) {
    const done = () => draw.classList.add('drawn');
    const sketch = draw.querySelector('sketch-portrait');
    if (reduce || !sketch || !window.customElements) done();
    else {
      sketch.addEventListener('sketchend', done, { once: true });
      setTimeout(done, 7000); // never leave the hero blank
    }
  }

  // 2. Plates and section headings rise into place once as they enter the screen.
  if (reduce || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.featured-card, .sketch-link, .index-line, .about-teaser-inner > *, .close-band-inner');
  targets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
      e.target.style.transitionDelay = Math.min(siblings.indexOf(e.target), 5) * 60 + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
})();
