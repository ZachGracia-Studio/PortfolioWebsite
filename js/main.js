// Nav scroll state
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu
const hamburger = document.querySelector('.nav-hamburger');
const mobileOverlay = document.querySelector('.nav-mobile-overlay');
if (hamburger && mobileOverlay) {
  const setMenu = (open) => {
    mobileOverlay.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger.addEventListener('click', () => {
    setMenu(!mobileOverlay.classList.contains('open'));
  });
  mobileOverlay.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
}

// Portfolio filter
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');
if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      const filter = tab.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.brand === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Active nav link
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  const isProjectPage = currentFile && window.location.pathname.includes('/projects/');
  if (
    href === currentFile ||
    (currentFile === '' && href === 'index.html') ||
    (isProjectPage && href === 'portfolio.html')
  ) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});
