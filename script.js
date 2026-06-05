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

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || reduceMotion) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';

  var halo = document.createElement('div');
  halo.className = 'cursor-halo';

  document.body.appendChild(dot);
  document.body.appendChild(halo);

  var dotX = window.innerWidth / 2;
  var dotY = window.innerHeight / 2;
  var haloX = dotX;
  var haloY = dotY;
  var targetX = dotX;
  var targetY = dotY;

  function animateCursor() {
    haloX += (targetX - haloX) * 0.16;
    haloY += (targetY - haloY) * 0.16;

    dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
    halo.style.transform = 'translate(' + haloX + 'px, ' + haloY + 'px) translate(-50%, -50%)';

    requestAnimationFrame(animateCursor);
  }

  document.addEventListener('mousemove', function (event) {
    dotX = event.clientX;
    dotY = event.clientY;
    targetX = event.clientX;
    targetY = event.clientY;
  });

  var interactiveTargets = document.querySelectorAll('a, button, .resume-btn, .project-card, .role-card, .impact-stat, .contact-card');
  interactiveTargets.forEach(function (element) {
    element.addEventListener('mouseenter', function () {
      halo.classList.add('is-hover');
    });
    element.addEventListener('mouseleave', function () {
      halo.classList.remove('is-hover');
    });
  });

  animateCursor();
});
