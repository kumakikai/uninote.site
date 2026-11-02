// Uni:Note & Pocket local site: mobile menu, header hide/show on scroll, phone fixed bar, scroll reveal.
(function () {
  'use strict';
  // Marks that scripts run: the scroll-reveal styles are scoped to html.js so content stays visible without JS.
  document.documentElement.classList.add('js');
  var nav = document.getElementById('site-nav');
  var burger = document.querySelector('.burger');
  var header = document.querySelector('.site-header');
  var phone = window.matchMedia ? window.matchMedia('(max-width: 640px)') : {matches: false};

  function setExpanded(button, expanded) { button.setAttribute('aria-expanded', expanded ? 'true' : 'false'); }

  // Menu button (phone): toggles the three links (機能・使うシーン・料金).
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      setExpanded(burger, !open);
      header.classList.toggle('nav-open', !open);
      document.body.classList.toggle('nav-open', !open);
      if (!open) header.classList.remove('is-hidden');
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') burger.click();
  });

  // Header (§3.38 (4)): on phones it hides when scrolling down and comes back when scrolling up.
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (!header.classList.contains('nav-open')) {
      if (y > lastY + 4 && y > 64) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 64) header.classList.remove('is-hidden');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, {passive: true});

  // Fixed bar (§3.37 (1)): phones only; shown once the hero is scrolled past, hidden while the final CTA is visible.
  var bar = document.getElementById('fixed-bar');
  var hero = document.querySelector('.hero');
  var finalCta = document.querySelector('.final-cta');
  function updateBar() {
    if (!bar) return;
    var heroPassed = hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > 300;
    var ctaVisible = false;
    if (finalCta) { var r = finalCta.getBoundingClientRect(); ctaVisible = r.top < window.innerHeight && r.bottom > 0; }
    var show = phone.matches && heroPassed && !ctaVisible;
    bar.hidden = !show;
    bar.classList.toggle('is-shown', show);
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(updateBar); }, {passive: true});
  window.addEventListener('resize', updateBar);
  updateBar();

  // Scroll reveal: soft fade-in only; disabled with prefers-reduced-motion or without IntersectionObserver.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach(function (el) { observer.observe(el); });
})();
