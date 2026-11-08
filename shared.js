/* =====================================================================
   MILINDU MADUSHAN — SHARED SCRIPT
   ===================================================================== */
(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme */
  body.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const t = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  });

  /* Ambient layers */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  body.prepend(progress);
  let dots = document.querySelector('.dot-overlay');
  if (!dots) { dots = document.createElement('div'); dots.className = 'dot-overlay'; dots.setAttribute('aria-hidden', 'true'); body.prepend(dots); }

  /* Scroll state */
  const nav = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  let ticking = false;
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    progress.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile menu */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    const setMenu = open => {
      mobileMenu.classList.toggle('open', open);
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      body.style.overflow = open ? 'hidden' : '';
    };
    hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* Reveal */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
      el.style.transitionDelay = Math.min(Math.max(0, sib.indexOf(el)) * 60, 360) + 'ms';
      el.classList.add('visible');
      revealIO.unobserve(el);
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  window.observeReveal = root => (root || document).querySelectorAll('.reveal:not(.visible)').forEach(el => revealIO.observe(el));
  window.observeReveal();

  /* Pointer effects */
  if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    document.addEventListener('mousemove', e => {
      dots.style.setProperty('--cx', e.clientX + 'px');
      dots.style.setProperty('--cy', e.clientY + 'px');
      const card = e.target.closest && e.target.closest('.spot');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
    }, { passive: true });
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
