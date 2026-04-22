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
  hamburger.addEventListener('click', () => {
    const isOpen = mobileOverlay.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileOverlay.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Portfolio filter
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');
if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
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
  }
});

// Contact form prevent default (placeholder behavior)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sent —';
      btn.disabled = true;
    }
  });
}

// Cart notify form
const notifyForm = document.querySelector('.cart-notify');
if (notifyForm) {
  notifyForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = notifyForm.querySelector('.cart-notify-btn');
    if (btn) {
      btn.textContent = 'You\'re on the list';
      btn.disabled = true;
    }
  });
}
