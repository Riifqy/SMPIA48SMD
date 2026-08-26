// =========================================================
// HAMBURGER MENU (mobile)
// =========================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    // On mobile, tapping a top-level dropdown label (Academics/About) opens
    // the submenu instead of navigating away, since there's no hover there.
    const parentItem = link.closest('.nav-item');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTopLevelDropdownLink = parentItem && link.parentElement === parentItem;

    if (isMobile && isTopLevelDropdownLink) {
      const alreadyOpen = parentItem.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach((el) => el.classList.remove('open'));
      if (!alreadyOpen) {
        parentItem.classList.add('open');
      }
      return; // don't navigate or close the menu yet
    }

    navLinks.classList.remove('open');
    document.querySelectorAll('.nav-item.open').forEach((el) => el.classList.remove('open'));
  });
});

// =========================================================
// ACTIVE PAGE HIGHLIGHT — marks the current page's nav link
// (and its parent dropdown label) so it's clear where you are.
// =========================================================
(function highlightActiveNavLink() {
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '') currentPage = 'index.html';

  navLinks.querySelectorAll('a[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        const topLink = parentItem.querySelector(':scope > a');
        if (topLink) topLink.classList.add('active');
      }
    }
  });
})();

// =========================================================
// POSTER / ANNOUNCEMENT SLIDER — auto-advances, with
// clickable dots, prev/next arrows, and pause-on-hover.
// =========================================================
(function posterSlider() {
  const track = document.getElementById('posterTrack');
  if (!track) return; // section only exists on the homepage

  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('posterDots');
  const prevBtn = document.getElementById('posterPrev');
  const nextBtn = document.getElementById('posterNext');
  const slider = document.getElementById('posterSlider');
  const AUTO_ADVANCE_MS = 4500;

  let current = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'poster-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to poster ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    render();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTO_ADVANCE_MS);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  render();
  startAuto();
})();

// =========================================================
// SCHOOL PROFILE VIDEO
// Replace VIDEO_URL with the real video link.
// =========================================================
const VIDEO_URL = ''; // example: 'assets/school-profile.mp4'

const videoBox = document.getElementById('videoBox');
const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', () => {
  if (!VIDEO_URL) {
    alert('No video set yet. Add your video link in script.js under the VIDEO_URL variable.');
    return;
  }
  videoBox.innerHTML = `
    <video controls autoplay style="width:100%; height:100%; border-radius:20px;">
      <source src="${VIDEO_URL}" type="video/mp4">
      Your browser does not support video playback.
    </video>
  `;
});

// =========================================================
// CENTER SCROLL TRACKS WHEN THEY FIT
// The photo rows (Extracurricular, Facilities, Meet the Teacher)
// scroll sideways on small screens. On wider screens, once every
// item already fits without overflowing, center the row instead
// of leaving it stuck to the left.
// =========================================================
function updateScrollTrackCentering() {
  document.querySelectorAll('.scroll-track').forEach((track) => {
    const fits = track.scrollWidth <= track.clientWidth + 1;
    track.classList.toggle('fits', fits);
  });
}

updateScrollTrackCentering();
window.addEventListener('resize', updateScrollTrackCentering);

// =========================================================
// SCROLL REVEAL — elements fade in smoothly as they enter view
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}