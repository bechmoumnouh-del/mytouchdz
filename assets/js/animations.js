/**
 * ─────────────────────────────────────────────────────────────────────────
 *  animations.js — presentation-only enhancement layer (anime.js)
 * ─────────────────────────────────────────────────────────────────────────
 *  Adds page-load, on-scroll and hover animations on top of the existing
 *  markup/behavior. Deliberately does NOT touch main.js, product-details.js
 *  or any of the lib/*.js files, and never changes layout, colors, fonts,
 *  or element order — only opacity/transform, which are reset to a neutral
 *  state once each animation finishes.
 *
 *  Fully optional / non-blocking:
 *  - If the anime.js CDN fails to load, this file no-ops and the page
 *    behaves exactly as it did before (no hidden content, nothing broken).
 *  - If the visitor has "prefers-reduced-motion" enabled, this file no-ops.
 *  - Runs in its own DOMContentLoaded handler *after* main.js's handler
 *    (script order in index.html), so it only ever animates content that
 *    main.js has already filled in — never placeholder/empty elements.
 * ─────────────────────────────────────────────────────────────────────────
 */
document.addEventListener('DOMContentLoaded', () => {

  if (typeof anime === 'undefined') return; // CDN blocked/offline — do nothing
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const EASE = 'easeOutCubic';

  // Clears any inline style anime.js left behind so elements return to
  // being fully controlled by the stylesheet again (important for the
  // sticky gallery / sticky header, which rely on CSS for positioning).
  function clearInlineStyle(el, props) {
    if (!el) return;
    props.forEach(p => { el.style[p] = ''; });
  }

  // ── 1) Page-load entrance: hero content fades/slides in, staggered ──
  (function heroEntrance() {
    const targets = [
      document.querySelector('.gallery--desktop'),
      document.querySelector('.gallery--mobile'),
      document.querySelector('.product-title'),
      document.querySelector('.product-description'),
      document.querySelector('.price-row'),
      document.querySelector('.order-box'),
    ].filter(Boolean);

    if (!targets.length) return;

    anime.set(targets, { opacity: 0, translateY: 14 });

    anime.timeline({ easing: EASE })
      .add({
        targets,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 550,
        delay: anime.stagger(80),
        complete: () => targets.forEach(el => clearInlineStyle(el, ['opacity', 'transform'])),
      });
  })();

  // ── 2) Sticky mobile buy bar: slide up once, shortly after load ─────
  (function buybarEntrance() {
    const bar = document.querySelector('.mobile-buybar');
    if (!bar) return;
    anime.set(bar, { translateY: 20, opacity: 0 });
    anime({
      targets: bar,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: 300,
      easing: EASE,
      complete: () => clearInlineStyle(bar, ['transform', 'opacity']),
    });
  })();

  // ── 3) On-scroll reveal: testimonial images fade/slide in as they ───
  //     enter the viewport (each one animates once, independently).
  (function testimonialsOnScroll() {
    const heading = document.querySelector('.testimonials__heading');
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    const revealEl = (el, index = 0) => {
      anime.set(el, { opacity: 0, translateY: 24 });
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 600,
        delay: index * 60,
        easing: EASE,
        complete: () => clearInlineStyle(el, ['opacity', 'transform']),
      });
    };

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show them, no animation.
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealEl(el, Number(el.dataset.revealIndex || 0));
        obs.unobserve(el);
      });
    }, { threshold: 0.15 });

    function observeCards() {
      const imgs = grid.querySelectorAll('img');
      imgs.forEach((img, i) => {
        img.dataset.revealIndex = i;
        observer.observe(img);
      });
    }

    if (heading) {
      const headingObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          revealEl(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      headingObserver.observe(heading);
    }

    // Testimonials are rendered synchronously by main.js before this file's
    // DOMContentLoaded handler runs, but guard with a small retry in case a
    // future edit makes that async.
    if (grid.querySelector('img')) {
      observeCards();
    } else {
      const mo = new MutationObserver(() => {
        if (grid.querySelector('img')) {
          observeCards();
          mo.disconnect();
        }
      });
      mo.observe(grid, { childList: true });
    }
  })();

  // ── 4) Hover micro-interactions (desktop pointer only) ──────────────
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hasHover) {
    const hoverPop = (el, scale = 1.02) => {
      if (!el) return;
      el.addEventListener('mouseenter', () => {
        anime({ targets: el, scale, duration: 180, easing: 'easeOutQuad' });
      });
      el.addEventListener('mouseleave', () => {
        anime({
          targets: el,
          scale: 1,
          duration: 180,
          easing: 'easeOutQuad',
          complete: () => clearInlineStyle(el, ['transform']),
        });
      });
    };

    document.querySelectorAll('.package').forEach(el => hoverPop(el, 1.015));
    document.querySelectorAll('.delivery-card').forEach(el => hoverPop(el, 1.02));
    hoverPop(document.querySelector('.buy-btn'), 1.02);
  }

  // ── 5) Tiny "confirm" pulse when a package/delivery option is picked ─
  //     (purely visual — the actual selection logic still lives in main.js)
  function attachSelectPulse(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => {
        anime({
          targets: el,
          scale: [1, 1.04, 1],
          duration: 260,
          easing: 'easeOutQuad',
          complete: () => clearInlineStyle(el, ['transform']),
        });
      });
    });
  }
  attachSelectPulse('.package');
  attachSelectPulse('.delivery-card');

  // ── 6) Discount badges: playful pop-in + gentle idle "breathing" pulse ─
  (function discountBadgePop() {
    const badges = document.querySelectorAll('.discount-badge, .package__discount');
    if (!badges.length) return;

    badges.forEach((badge, i) => {
      if (!badge.textContent.trim()) return; // nothing to show — skip
      anime.set(badge, { scale: 0, rotate: -8 });
      anime({
        targets: badge,
        scale: [0, 1.15, 1],
        rotate: [-8, 0],
        duration: 650,
        delay: 500 + i * 90,
        easing: 'easeOutElastic(1, .6)',
        complete: () => {
          clearInlineStyle(badge, ['transform']);
          // Subtle, youthful "breathing" loop once it has landed
          anime({
            targets: badge,
            scale: [1, 1.06, 1],
            duration: 1400,
            easing: 'easeInOutSine',
            loop: true,
          });
        },
      });
    });
  })();
});
