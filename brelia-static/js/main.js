/* =====================================================
   BRELIA GARDEN — main.js
   ===================================================== */

// --- Header: scrolled state + top-bar hide ---
(function () {
  const topBar = document.querySelector('.top-bar');
  const header = document.querySelector('.site-header');
  if (!header) return;

  let topBarH = topBar ? topBar.offsetHeight : 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > topBarH + 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// --- Menu mobile ---
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('aberto');
    document.body.style.overflow = nav.classList.contains('aberto') ? 'hidden' : '';
  });

  // Fecha ao clicar em link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('aberto');
      document.body.style.overflow = '';
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('aberto');
      document.body.style.overflow = '';
    }
  });
})();

// --- Marca link ativo conforme página atual ---
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop();
    if (page === current || (current === '' && page === 'index.html')) {
      link.classList.add('ativo');
    }
  });
})();

// --- Galeria de produto (thumbnails) ---
(function () {
  const mainImg = document.querySelector('.imagem-principal');
  if (!mainImg) return;

  document.querySelectorAll('.produto-galeria-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.src;
      mainImg.alt = thumb.alt;
      document.querySelectorAll('.produto-galeria-thumbs img').forEach(t => t.classList.remove('ativa'));
      thumb.classList.add('ativa');
    });
  });
})();

// --- Animação de entrada nos cards (Intersection Observer) ---
(function () {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .card-produto, .card-categoria, .diferencial-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .card-produto.visible, .card-categoria.visible, .diferencial-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card-produto, .card-categoria, .diferencial-card').forEach(el => {
    obs.observe(el);
  });
})();
