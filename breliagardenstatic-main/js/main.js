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

// --- Lightbox com zoom dinâmico (segue o cursor) ---
(function () {
  const mainImg = document.querySelector('.imagem-principal');
  if (!mainImg) return;
  mainImg.style.cursor = 'zoom-in';

  const ZOOM = 2.2; // ajuste aqui: 1.5 = zoom leve, 3 = zoom forte

  mainImg.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,.9);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; cursor:zoom-out;
    `;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      max-width:95vw; max-height:95vh; overflow:hidden;
      border-radius:8px; cursor:zoom-in; line-height:0;
    `;

    const img = document.createElement('img');
    img.src = mainImg.src;
    img.style.cssText = `
      display:block; max-width:95vw; max-height:95vh;
      width:auto; height:auto;
      transform-origin: center center;
      transition: transform .08s ease-out;
    `;

    wrapper.appendChild(img);
    overlay.appendChild(wrapper);

    // move o zoom junto com o cursor
    wrapper.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = `scale(${ZOOM})`;
    });

    // some do zoom quando o mouse sai da imagem
    wrapper.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });

    // clique dentro da imagem não fecha o overlay
    wrapper.addEventListener('click', (e) => e.stopPropagation());

    // clique fora (fundo escuro) fecha
    overlay.addEventListener('click', () => overlay.remove());

    document.body.appendChild(overlay);
  });
})();
