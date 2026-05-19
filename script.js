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

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===================================================
   Navigation — Scroll Shadow & Active Link
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
    if (window.scrollY >= section.offsetTop - 120) {
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
   Mobile Menu Toggle
   =================================================== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function toggleMenu() {
  const isOpen = navMenu.classList.contains('open');
  if (isOpen) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) toggleMenu();
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    toggleMenu();
  }
});

/* ===================================================
   Smooth Scroll
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================
   Fade-in & Staggered Animations
   =================================================== */
const fadeEls = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Handle staggered children
      const staggerItems = entry.target.querySelectorAll('.stagger-item');
      staggerItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100);
      });
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeEls.forEach(el => observer.observe(el));
