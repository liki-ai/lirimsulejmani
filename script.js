/* ===================================================
   Theme Toggle
   =================================================== */
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

// Respect saved preference (inline script in <head> already set data-theme,
// so this just wires up the button to match)
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===================================================
   Navigation — scroll shadow & active link
   =================================================== */
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('main section[id]');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 110) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', () => {
  updateHeader();
  updateActiveLink();
}, { passive: true });

updateHeader();
updateActiveLink();

/* ===================================================
   Mobile menu toggle
   =================================================== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function openMenu() {
  navMenu.classList.add('open');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

navMenu.querySelectorAll('.nav__link, .btn').forEach(el => {
  el.addEventListener('click', closeMenu);
});

document.addEventListener('click', e => {
  if (
    navMenu.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target) &&
    !themeToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    closeMenu();
    navToggle.focus();
  }
});

/* ===================================================
   Smooth scroll for anchor links
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================
   Fade-in on scroll (IntersectionObserver)
   =================================================== */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle staggered children if they exist
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        if (staggerItems.length > 0) {
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          });
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

fadeEls.forEach(el => observer.observe(el));
