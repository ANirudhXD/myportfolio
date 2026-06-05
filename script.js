document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('js');

  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    if (link.getAttribute('href') === page) {
      link.classList.add('nav-active');
    }
  });

  var year = document.querySelector('.footer-year');
  if (year) year.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = document.querySelectorAll('main section');

  function updateScrollProgress() {
    var maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScrollable > 0 ? window.scrollY / maxScrollable : 0;
    document.body.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
  }

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);

  if (!sections.length) return;

  sections.forEach(function (section, index) {
    section.style.setProperty('--reveal-delay', String(index * 70) + 'ms');
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    sections.forEach(function (section) {
      section.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

});
