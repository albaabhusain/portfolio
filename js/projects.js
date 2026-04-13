/* ═══════════════════════════════════════════════════
   ALBAAB HUSAIN PORTFOLIO — PROJECTS PAGE JS
   Filter chips + GSAP stagger animations
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initProjectFilter();
    initProjectAnimations();
    initScrollReveal();
  });

  /* ─── Filter ─── */
  function initProjectFilter() {
    const chips    = document.querySelectorAll('.filter-chip');
    const cards    = document.querySelectorAll('.project-full-card');
    const emptyEl  = document.getElementById('filterEmpty');
    if (!chips.length || !cards.length) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        // Update active chip
        chips.forEach((c) => c.classList.remove('filter-chip--active'));
        chip.classList.add('filter-chip--active');

        const filter = chip.dataset.filter;
        let visible = 0;

        cards.forEach((card) => {
          const categories = (card.dataset.category || '').split(' ');
          const show = filter === 'all' || categories.includes(filter);

          if (show) {
            card.classList.remove('hidden');
            visible++;
          } else {
            card.classList.add('hidden');
          }
        });

        if (emptyEl) {
          emptyEl.hidden = visible > 0;
        }

        // Re-animate visible cards
        animateVisibleCards();
      });
    });
  }

  /* ─── GSAP stagger on filter change ─── */
  function animateVisibleCards() {
    if (typeof gsap === 'undefined') return;

    const visible = document.querySelectorAll('.project-full-card:not(.hidden)');
    gsap.fromTo(
      visible,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
      }
    );
  }

  /* ─── Initial load animation ─── */
  function initProjectAnimations() {
    if (typeof gsap === 'undefined') return;

    // Animate cards in on load
    gsap.fromTo(
      '.project-full-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.3,
      }
    );

    // Hero text animation
    gsap.fromTo(
      '.projects-page-hero .back-link, .projects-page-hero .section-label, .projects-page-hero .projects-page-title, .projects-page-hero .projects-page-sub',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.1,
      }
    );
  }

  /* ─── Scroll reveals (CTA box, etc.) ─── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      reveals.forEach((el) => {
        const isLeft  = el.classList.contains('reveal-left');
        const isRight = el.classList.contains('reveal-right');
        const fromX   = isLeft ? -40 : isRight ? 40 : 0;
        const fromY   = (!isLeft && !isRight) ? 40 : 0;

        gsap.fromTo(
          el,
          { opacity: 0, x: fromX, y: fromY },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    } else {
      // Fallback
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
  }

})();
