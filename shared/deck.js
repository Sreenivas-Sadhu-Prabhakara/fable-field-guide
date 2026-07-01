/* shared deck behaviour: rail w/ hover labels, slide counter, scroll reveals,
   calibrated-bar fills, progress bar, keyboard nav. Reduced-motion is handled
   in CSS; this only toggles state classes. */
(function () {
  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  const rail = document.getElementById('rail');
  const counter = document.getElementById('counter');
  const topbar = document.getElementById('topbar');

  if (rail) slides.forEach((s, i) => {
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.label = s.dataset.name || ('Slide ' + (i + 1));
    a.setAttribute('aria-label', a.dataset.label);
    a.addEventListener('click', e => { e.preventDefault(); s.scrollIntoView({ behavior: 'smooth' }); });
    rail.appendChild(a);
  });
  const dots = rail ? [...rail.children] : [];

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.rev').forEach(r => r.classList.add('in'));
    e.target.querySelectorAll('.bar').forEach(b => b.classList.add('in'));
    const i = slides.indexOf(e.target);
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
    if (counter) counter.textContent =
      String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }), { threshold: 0.55 });
  slides.forEach(s => io.observe(s));

  if (topbar) addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    topbar.style.width = (100 * scrollY / Math.max(h, 1)) + '%';
  }, { passive: true });

  const cur = () => {
    let best = 0, bd = 1e9;
    slides.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().top); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault(); slides[Math.min(cur() + 1, slides.length - 1)].scrollIntoView({ behavior: 'smooth' });
    }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault(); slides[Math.max(cur() - 1, 0)].scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
