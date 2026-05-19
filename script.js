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
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
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

// Run once on load
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
  const isOpen = navMenu.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

// Close menu on nav link click
navMenu.querySelectorAll('.nav__link, .btn').forEach(el => {
  el.addEventListener('click', closeMenu);
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (
    navMenu.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on Escape key
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

    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

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
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));
