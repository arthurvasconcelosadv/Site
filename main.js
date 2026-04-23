/* =====================================================
   MAIN.JS — Advogado Trabalhista v2.0
   ===================================================== */

// ─── HEADER SCROLL ───────────────────────────────────
const hdr = document.getElementById('site-header');
if (hdr) {
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ─── MENU MOBILE ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

// ─── FAQ ACCORDION ───────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── SCROLL ANIMATIONS ───────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fi').forEach(el => obs.observe(el));

// ─── FORMULÁRIO DE CONTATO ───────────────────────────
// Abre WhatsApp com a mensagem preenchida e redireciona para thank-you.html
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome    = (document.getElementById('nome')?.value || '').trim();
    const tel     = (document.getElementById('telefone')?.value || '').trim();
    const assunto = (document.getElementById('assunto')?.value || 'Consulta Jurídica').trim();
    const msg     = (document.getElementById('mensagem')?.value || '').trim();

    if (!nome || !tel || !msg) return;

    const texto = encodeURIComponent(
      `Olá! Meu nome é *${nome}*.\n\n` +
      `📋 *Assunto:* ${assunto}\n` +
      `📱 *Telefone:* ${tel}\n\n` +
      `💬 *Mensagem:*\n${msg}`
    );

    // Abre WhatsApp em nova aba
    window.open(`https://wa.me/5534984321814?text=${texto}`, '_blank');

    // Redireciona para página de confirmação
    setTimeout(() => {
      const base = window.location.pathname.includes('/') ?
        window.location.pathname.split('/').slice(0, -1).join('/') + '/' : '/';
      window.location.href = base.replace(/\/+$/, '') === '' ?
        'thank-you.html' :
        window.location.href.replace(/[^/]*$/, '') + 'thank-you.html';
    }, 800);
  });
}

// ─── SMOOTH SCROLL PARA ÂNCORAS ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── MÁSCARA DE TELEFONE ─────────────────────────────
const telInput = document.getElementById('telefone');
if (telInput) {
  telInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
        a ? `(${a}` + (b ? `) ${b}` : '') + (c ? `-${c}` : '') : _);
    } else {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) =>
        `(${a}) ${b}` + (c ? `-${c}` : ''));
    }
    this.value = v;
  });
}

// ─── NAV LINK ATIVO ──────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPage || href.endsWith('/' + currentPage)) {
    link.classList.add('ativo');
  }
});

// ─── TRACKING GA4 (se disponível) ────────────────────
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        event_category: 'Lead',
        event_label: document.title,
      });
    }
  });
});

// ─── COMPATIBILIDADE: suporte a nav-menu (páginas antigas) ───
const navMenuOld = document.getElementById('nav-menu');
const hamburgerOld = document.getElementById('hamburger');
if (navMenuOld && hamburgerOld && !document.getElementById('nav')) {
  hamburgerOld.addEventListener('click', () => {
    navMenuOld.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!hamburgerOld.contains(e.target) && !navMenuOld.contains(e.target)) {
      navMenuOld.classList.remove('open');
    }
  });
}

// ─── COMPATIBILIDADE: fade-in → visible (páginas antigas usam .visible) ───
const obsOld = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obsOld.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => obsOld.observe(el));

// ─── COMPATIBILIDADE: faq-question / faq-answer (páginas antigas) ───
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── COMPATIBILIDADE: whatsapp float antigo (id=whatsapp-float) ───
const wppFloat = document.getElementById('whatsapp-float');
if (wppFloat) {
  const tip = wppFloat.querySelector('.whatsapp-tooltip');
  if (tip) {
    tip.style.display = 'none';
    wppFloat.addEventListener('mouseenter', () => { tip.style.display = 'block'; });
    wppFloat.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }
}
