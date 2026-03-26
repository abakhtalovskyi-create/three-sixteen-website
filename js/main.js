/* ═══════════════════════════════════════════════
   THREE SIXTEEN — Shared JavaScript
   ═══════════════════════════════════════════════ */

(function() {
'use strict';

/* ─── PAGE TRANSITION ─── */
const pt = document.querySelector('.page-transition');
function navigate(href) {
  if (!pt || href.startsWith('#')) return;
  pt.classList.add('entering');
  setTimeout(() => { window.location = href; }, 550);
}
if (pt) {
  pt.classList.add('leaving');
  setTimeout(() => { pt.classList.remove('leaving'); }, 600);
  // Intercept all internal links
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank') return;
    e.preventDefault();
    navigate(href);
  });
}

/* ─── LOADER ─── */
const loader   = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderNum = document.getElementById('loaderNum');
if (loader) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (loaderBar) loaderBar.style.width = progress + '%';
    if (loaderNum) loaderNum.textContent = Math.round(progress) + '%';
    if (progress >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        initHeroAnim();
      }, 300);
    }
  }, 70);
}

function initHeroAnim() {
  // Hero title words
  document.querySelectorAll('.page-hero__title .word, .hero__title .word').forEach((w, i) => {
    w.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { w.style.transform = 'translateY(0)'; }, i * 110);
  });
  // Hero subtitle lines
  document.querySelectorAll('.page-hero__subtitle .line, .hero__subtitle .line').forEach((l, i) => {
    l.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { l.style.transform = 'translateY(0)'; }, 200 + i * 120);
  });
  // Hero bg parallax-in
  document.querySelectorAll('.page-hero__bg, .hero__bg').forEach(bg => bg.classList.add('loaded'));
}

/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById('cursor');
if (cursor) {
  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });
  (function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
  // mix-blend-mode: difference handles auto-inversion — no JS needed
}

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
const scrollProgress = document.querySelector('.scroll-progress');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollProgress) {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProgress.style.width = ((window.scrollY / max) * 100) + '%';
    }
  }, { passive: true });
}

/* ─── MOBILE MENU ─── */
const burger  = document.getElementById('navBurger');
const overlay = document.getElementById('navOverlay');
if (burger && overlay) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, .img-reveal').forEach(el => {
  revealObs.observe(el);
});

/* ─── STATEMENT WORD REVEAL ─── */
const statementText = document.getElementById('statementText');
if (statementText) {
  const words = statementText.querySelectorAll('.statement__word-inner');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        words.forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 75));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  obs.observe(statementText);
}

/* ─── PARALLAX ─── */
const parallaxEls = document.querySelectorAll('[data-parallax]');
function updateParallax() {
  parallaxEls.forEach(el => {
    const section = el.closest('.parallax-section') || el.parentElement;
    const rect = section.getBoundingClientRect();
    const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const speed = parseFloat(el.dataset.parallax) || 0.4;
    const offset = (ratio - 0.5) * window.innerHeight * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
}
if (parallaxEls.length) {
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

/* ─── COUNTER ANIMATION ─── */
const statEls = document.querySelectorAll('.stat__num[data-count]');
if (statEls.length) {
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const dur = 1600;
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.innerHTML = val + '<span>' + suffix + '</span>';
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => countObs.observe(el));
}

/* ─── SMOOTH SCROLL (anchor links) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── ACTIVE NAV LINK ─── */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-overlay__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && href !== '#' && (currentPath === href || window.location.pathname.endsWith(href))) {
    a.classList.add('active');
  }
});

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.btn-primary, .btn-dark, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─── HORIZONTAL SCROLL DIRECTION REVERSE ─── */
const horizReverse = document.querySelectorAll('.horiz-text__track--reverse');
// Already handled by CSS animation direction

})();
