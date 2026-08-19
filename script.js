// ============================================================
// script.js
// A few small, commented interactions — good starting points if
// you want to practice modifying vanilla JS behavior.
// ============================================================

// ---- 1. Footer year (so you never have to update it by hand) ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- 2. Mobile menu toggle ----
const menuToggle = document.getElementById('menuToggle');
const tabs = document.querySelector('.tabs');

if (menuToggle && tabs) {
  menuToggle.addEventListener('click', () => {
    const isOpen = tabs.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // close the menu after picking a link (nice on mobile)
  tabs.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      tabs.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- 3. Hero terminal typing animation ----
// Types out a command, then reveals a few "output" lines underneath.
const typedCommandEl = document.getElementById('typedCommand');
const typedOutputEl = document.getElementById('typedOutput');
const cursorEl = document.getElementById('cursor');

const COMMAND = 'whoami --verbose';
const OUTPUT_LINES = [
  { key: 'name', value: 'Sarnab Debnath' },
  { key: 'role', value: 'CS student, aspiring developer' },
  { key: 'status', value: 'building things & open to internships' },
];

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function typeText(el, text, speed = 55) {
  return new Promise(resolve => {
    if (prefersReducedMotion()) {
      el.textContent = text;
      resolve();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runBootSequence() {
  if (!typedCommandEl || !typedOutputEl) return;

  await typeText(typedCommandEl, COMMAND);

  // small pause before "output" appears, like a real shell
  await new Promise(r => setTimeout(r, 350));

  // hide the blinking cursor once the command line is "submitted"
  if (cursorEl) cursorEl.style.display = 'none';

  OUTPUT_LINES.forEach((line, index) => {
    const p = document.createElement('p');
    p.className = 'out-line';
    p.style.animationDelay = `${index * 180}ms`;
    p.innerHTML = `<span class="out-key">${line.key}:</span> ${line.value}`;
    typedOutputEl.appendChild(p);
  });
}

runBootSequence();

// ---- 4. Active tab highlight on scroll ----
const sections = document.querySelectorAll('main [id]');
const navLinks = document.querySelectorAll('.tab[data-tab]');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const match = link.getAttribute('href') === `#${id}`;
          link.style.color = match ? 'var(--text)' : '';
          link.style.background = match ? 'var(--bg-panel)' : '';
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

// ---- 5. Dark / light theme toggle ----
// Remembers your choice in localStorage so it persists on reload.
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀'; // sun icon = currently light, click to go dark
  } else {
    root.removeAttribute('data-theme');
    themeIcon.textContent = '☾'; // moon icon = currently dark, click to go light
  }
}

// on load: use saved preference, or fall back to the visitor's OS setting
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme('light');
} else {
  applyTheme('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// ---- 6. Resume download button ----
// The button in the hero links to "resume.pdf" with the `download` attribute.
// Right now there's no resume.pdf in the folder, so the link won't find a file yet.
// To make it work: add your resume as resume.pdf in this same folder
// (same location as index.html) — no code changes needed after that.

// ---- 7. Project filter (by tech tag) ----
// Reads the data-tags attribute on each .project-card, builds filter buttons
// automatically, and shows/hides cards on click.
const filterRow = document.getElementById('filterRow');
const projectCards = document.querySelectorAll('.project-card[data-tags]');

if (filterRow && projectCards.length) {
  // collect every unique tag across all project cards
  const allTags = new Set();
  projectCards.forEach(card => {
    card.dataset.tags.split(',').forEach(tag => allTags.add(tag.trim()));
  });

  // build one button per tag and add it after the existing "all" button
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = tag;
    btn.textContent = tag.toLowerCase();
    filterRow.appendChild(btn);
  });

  filterRow.addEventListener('click', event => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;

    // update which button looks "active"
    filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const selected = btn.dataset.filter;

    projectCards.forEach(card => {
      const tags = card.dataset.tags.split(',').map(t => t.trim());
      const shouldShow = selected === 'all' || tags.includes(selected);
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
}

// ---- 8. Scroll progress bar + back-to-top button ----
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = `${percent}%`;
  if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 400);
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI(); // run once on load in case the page opens mid-scroll (e.g. via anchor link)

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

// ---- 9. Contact form (front-end only placeholder) ----
// This does NOT send an email on its own. Wire it up to a service like
// Formspree, EmailJS, or your own backend endpoint — see the comment below.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    // TODO: replace this with a real request, e.g.:
    // fetch('https://formspree.io/f/your-form-id', {
    //   method: 'POST',
    //   headers: { Accept: 'application/json' },
    //   body: new FormData(contactForm),
    // })

    formStatus.textContent = '$ message queued — connect a backend to actually send it.';
    contactForm.reset();
  });
}
