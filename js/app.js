/* ═══════════════════════════════════════════════════
   ALBAAB HUSAIN PORTFOLIO — MAIN APP JS
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM Ready ── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    initNavbar();
    initHamburger();
    initTyped();
    initScrollReveal();
    initFooterYear();
    initNavActiveLinks();
  }

  /* ═══════════════════════════════════════════════════
     THEME — Dark / Light Toggle
     ═══════════════════════════════════════════════════ */
  function initTheme() {
    const html   = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Persist theme in localStorage; default to dark
    const saved = localStorage.getItem('portfolio-theme') || 'dark';
    applyTheme(saved);

    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
    }
  }

  /* ═══════════════════════════════════════════════════
     NAVBAR — Scroll shadow + Active link tracking
     ═══════════════════════════════════════════════════ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  function initNavActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.includes(entry.target.id)) {
                link.classList.add('nav-link--active');
              } else {
                link.classList.remove('nav-link--active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ═══════════════════════════════════════════════════
     HAMBURGER — Mobile menu
     ═══════════════════════════════════════════════════ */
  function initHamburger() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.classList.toggle('open');
      menu.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    menu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target) && menu.classList.contains('open')) {
        btn.classList.remove('open');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     TYPED.JS — Hero typewriter effect
     ═══════════════════════════════════════════════════ */
  function initTyped() {
    const el = document.getElementById('heroTyped');
    if (!el || typeof Typed === 'undefined') return;

    new Typed('#heroTyped', {
      strings: [
        'Full Stack Products.',
        'Scalable SaaS Platforms.',
        'AI-Powered Pipelines.',
        'React & Next.js Apps.',
        'Cloud-Native Systems.',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 400,
      loop: true,
      smartBackspace: true,
    });
  }

  /* ═══════════════════════════════════════════════════
     SCROLL REVEAL — GSAP ScrollTrigger animations
     ═══════════════════════════════════════════════════ */
  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: use IntersectionObserver for simple reveals
      fallbackReveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Stagger the skill groups
    gsap.utils.toArray('.skill-group').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Timeline items stagger
    gsap.utils.toArray('.timeline-item').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Project cards stagger
    gsap.utils.toArray('.project-card').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Generic reveal-up elements (excluding ones already handled)
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      if (el.closest('.skill-group, .timeline-item, .project-card')) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // reveal-left
    gsap.utils.toArray('.reveal-left').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // reveal-right
    gsap.utils.toArray('.reveal-right').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Stat numbers count-up (handles "3+", "25M+", "2", etc.)
    gsap.utils.toArray('.stat-number').forEach((el) => {
      const raw    = el.textContent.trim();
      // Extract the numeric portion (supports decimal and integer)
      const numMatch = raw.match(/^([\d.]+)/);
      if (!numMatch) return;
      const target = parseFloat(numMatch[1]);
      if (isNaN(target)) return;
      // Everything after the number is the suffix (e.g. "M+", "+", "")
      const suffix = raw.slice(numMatch[1].length);

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () {
          const rounded = Number.isInteger(target)
            ? Math.round(obj.val)
            : obj.val.toFixed(1);
          el.textContent = rounded + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }

  function fallbackReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════
     FOOTER — Dynamic year
     ═══════════════════════════════════════════════════ */
  function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
