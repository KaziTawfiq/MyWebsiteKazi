// Progressive enhancement flags
document.documentElement.classList.remove('no-js');

// Smooth scroll for internal links
const scrollLinks = document.querySelectorAll('a[data-scroll]');
for (const link of scrollLinks) {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Sticky header mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
}

// Theme handling
const THEME_KEY = 'kazi-theme';
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'auto') {
    applyTheme(saved);
  } else {
    applyTheme('auto');
  }
}
initTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'auto';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Tabs
document.querySelectorAll('[data-tabs]').forEach(tabs => {
  const buttons = tabs.querySelectorAll('[role="tab"]');
  const panels  = tabs.querySelectorAll('[role="tabpanel"]');

  function activate(idx) {
    buttons.forEach((btn, i) => {
      const selected = i === idx;
      btn.setAttribute('aria-selected', String(selected));
      panels[i].hidden = !selected;
    });
  }
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => activate(i));
    btn.addEventListener('keydown', (e) => {
      const dir = (e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowLeft') ? -1 : 0;
      if (dir) {
        e.preventDefault();
        let next = (i + dir + buttons.length) % buttons.length;
        buttons[next].focus();
        activate(next);
      }
    });
  });
});

// Animated skill meters
function animateMeters() {
  document.querySelectorAll('.meter').forEach(m => {
    const v = parseInt(m.dataset.value || '0', 10);
    const span = m.querySelector('span');
    if (!span) return;
    let start = null;
    const duration = 900;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      span.style.width = (p * v) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      animateMeters();
      io.disconnect();
    }
  }, { threshold: 0.3 });
  io.observe(skillsSection);
}

// Demo contact form
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', () => {
    alert('Thanks for reaching out! This demo form is not wired to email yet.');
  });
}
