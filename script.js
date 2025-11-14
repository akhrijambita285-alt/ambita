// Animasi & interaksi untuk website profil
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const ctas = document.querySelectorAll('.cta-pulse');

  // 1) Header fade-in on load
  requestAnimationFrame(() => {
    header.classList.add('loaded');
  });

  // 2) Add subtle continuous pulse to primary CTAs (only if not reduced motion)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    ctas.forEach(c => c.classList.add('pulse-animate'));
  }

  // 3) Setup reveals with IntersectionObserver and staggered delays
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const observer = new IntersectionObserver((entries) => {
    // We group reveals by section by their nearest section ancestor to create a stagger
    const toShow = [];
    entries.forEach(entry => {
      if (entry.isIntersecting) toShow.push(entry.target);
    });
    if (toShow.length === 0) return;

    // Sort by offsetTop to ensure consistent order
    toShow.sort((a,b) => (a.getBoundingClientRect().top - b.getBoundingClientRect().top));
    toShow.forEach((el, idx) => {
      // progressive delay per element
      const delay = idx * 90;
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08
  });

  reveals.forEach((el) => observer.observe(el));

  // 4) Skill card tilt on pointer move and flip on click / keyboard (accessibility)
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const inner = card.querySelector('.card-inner');

    function setTransform(x, y, rotateZ=0) {
      inner.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${rotateZ}deg)`;
    }

    function handlePointerMove(e){
      // If reduced motion, don't do tilt
      if (reduce) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 12; // -6 .. 6
      const rotateX = (0.5 - py) * 10; // -5 .. 5
      // slight translateZ effect
      setTransform(rotateX, rotateY);
    }

    function reset(){
      inner.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1)';
      inner.style.transform = '';
      setTimeout(()=> inner.style.transition = '', 600);
    }

    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', reset);

    // Flip on click for accessibility and touch devices
    card.addEventListener('click', (ev) => {
      ev.currentTarget.classList.toggle('is-flipped');
    });

    // keyboard accessibility: Enter toggles flip, Esc closes
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        card.classList.toggle('is-flipped');
      } else if (ev.key === 'Escape') {
        card.classList.remove('is-flipped');
      }
    });
  });

  // 5) Small enhancement: set copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 6) Simple nav toggle for small screens
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav){
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.style.display = expanded ? '' : 'block';
    });
  }
});