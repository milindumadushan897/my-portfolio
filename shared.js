/* =========================================================
   SHARED JS — used by index.html, blog.html, tools.html
========================================================= */

// ── Theme ──────────────────────────────────────────────────
const body = document.body;
body.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
document.getElementById('themeToggle').addEventListener('click', () => {
  const t = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// ── Mobile Menu ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }));
}

// ── Custom Cursor ──────────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animC() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animC);
})();

// ── Particles ──────────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
function resizeC() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeC();
window.addEventListener('resize', resizeC);
class P {
  constructor() { this.r(); }
  r() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .3;
    this.vy = (Math.random() - .5) * .3;
    this.s  = Math.random() * 1.5 + .5;
    this.o  = Math.random() * .4 + .1;
  }
  u() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.r();
  }
  d() {
    const dk = body.getAttribute('data-theme') !== 'light';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
    ctx.fillStyle = dk ? `rgba(59,130,246,${this.o})` : `rgba(29,78,216,${this.o * .5})`;
    ctx.fill();
  }
}
const ps = Array.from({ length: 80 }, () => new P());
function dLines() {
  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const dk = body.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.strokeStyle = dk
          ? `rgba(59,130,246,${.06 * (1 - dist / 120)})`
          : `rgba(29,78,216,${.04 * (1 - dist / 120)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(ps[i].x, ps[i].y);
        ctx.lineTo(ps[j].x, ps[j].y);
        ctx.stroke();
      }
    }
  }
}
(function anim() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ps.forEach(p => { p.u(); p.d(); });
  dLines();
  requestAnimationFrame(anim);
})();

// ── Back to Top ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  const backTopBtn = document.getElementById('backTop');
  if (backTopBtn) backTopBtn.classList.toggle('visible', window.scrollY > 400);
});
document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
