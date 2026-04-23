/* =====================================================
   LGPD.JS — Banner de Cookies + Exit Intent Popup
   ===================================================== */
(function () {
  const KEY_COOKIE = 'adv_cookie_ok';
  const KEY_POPUP  = 'adv_popup_shown';
  const WPP = 'https://wa.me/5534984321814?text=Olá!%20Vi%20o%20site%20e%20quero%20analisar%20meu%20caso%20gratuitamente.';

  function getCookie(n) {
    return document.cookie.split('; ').find(r => r.startsWith(n + '='))?.split('=')[1];
  }
  function setCookie(n, v, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = `${n}=${v};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }

  /* ── BANNER COOKIES ── */
  function initBanner() {
    if (getCookie(KEY_COOKIE)) return;
    const css = `
      #cb{position:fixed;bottom:0;left:0;right:0;z-index:11000;background:#0D1B2A;border-top:3px solid #C9A84C;padding:16px 24px;animation:cbIn .4s ease}
      @keyframes cbIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      #cbi{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
      #cbt{display:flex;align-items:center;gap:12px;flex:1}
      #cbt p{margin:0;font-size:.88rem;color:rgba(255,255,255,.75);font-family:Lato,sans-serif;line-height:1.5}
      #cbt a{color:#C9A84C;text-decoration:underline}
      #cba{display:flex;gap:10px;flex-shrink:0}
      .cbtn{padding:10px 22px;border-radius:4px;border:none;cursor:pointer;font-family:Lato,sans-serif;font-size:.88rem;font-weight:700;transition:all .2s;white-space:nowrap}
      .cb-ok{background:#C9A84C;color:#0D1B2A}.cb-ok:hover{background:#E2C07A}
      .cb-no{background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.15)}.cb-no:hover{color:rgba(255,255,255,.8)}
      @media(max-width:600px){#cbi{flex-direction:column}#cba{width:100%}.cbtn{flex:1}}`;
    const el = document.createElement('div');
    el.id = 'cb';
    el.innerHTML = `<style>${css}</style>
      <div id="cbi">
        <div id="cbt"><span style="font-size:1.4rem;flex-shrink:0">🍪</span>
          <p>Usamos cookies para melhorar sua experiência. Ao continuar, você aceita nossa <a href="/privacidade.html">Política de Privacidade</a>.</p>
        </div>
        <div id="cba">
          <button class="cbtn cb-ok" id="cb-yes">Aceitar</button>
          <button class="cbtn cb-no" id="cb-no">Recusar</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    function dismiss(ok) {
      setCookie(KEY_COOKIE, ok ? '1' : '0', 365);
      el.style.transition = 'opacity .3s,transform .3s';
      el.style.opacity = '0'; el.style.transform = 'translateY(100%)';
      setTimeout(() => el.remove(), 350);
    }
    document.getElementById('cb-yes').onclick = () => dismiss(true);
    document.getElementById('cb-no').onclick  = () => dismiss(false);
  }

  /* ── EXIT INTENT POPUP ── */
  function initPopup() {
    const path = window.location.pathname;
    const skip = ['/404', '/privacidade', '/thank-you'].some(p => path.includes(p));
    if (skip || sessionStorage.getItem(KEY_POPUP)) return;

    let ready = false, shown = false;
    setTimeout(() => { ready = true; }, 25000); // 25s

    function show() {
      if (shown || !ready) return;
      shown = true;
      sessionStorage.setItem(KEY_POPUP, '1');

      const css = `
        #ep-ov{position:fixed;inset:0;z-index:12000;background:rgba(13,27,42,.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:epFade .3s ease}
        @keyframes epFade{from{opacity:0}to{opacity:1}}
        #ep{background:#fff;border-radius:12px;padding:40px 36px;max-width:480px;width:100%;text-align:center;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.5);animation:epIn .4s cubic-bezier(.34,1.56,.64,1);border-top:5px solid #C9A84C}
        @keyframes epIn{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        #ep-x{position:absolute;top:12px;right:16px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:#9E9B96;padding:4px 8px;border-radius:4px;transition:color .2s}
        #ep-x:hover{color:#0D1B2A}
        #ep-ico{font-size:2.8rem;margin-bottom:12px}
        #ep h2{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:#0D1B2A;margin:0 0 12px;line-height:1.2}
        #ep p{font-size:.95rem;color:#4A4845;margin:0 0 24px;line-height:1.6}
        #ep p strong{color:#C0392B}
        #ep-items{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left}
        .ep-it{font-size:.9rem;font-weight:700;color:#0D1B2A;padding:10px 16px;background:#FAF7F2;border-radius:6px}
        #ep-cta{display:block;background:#25D366;color:#fff;padding:16px;border-radius:6px;font-family:Lato,sans-serif;font-size:1rem;font-weight:700;text-decoration:none;margin-bottom:16px;transition:background .2s,transform .2s}
        #ep-cta:hover{background:#1ebe5b;transform:translateY(-2px)}
        #ep-skip{background:none;border:none;cursor:pointer;font-size:.78rem;color:#9E9B96;text-decoration:underline;font-family:Lato,sans-serif;transition:color .2s}
        #ep-skip:hover{color:#4A4845}
        @media(max-width:520px){#ep{padding:28px 20px}#ep h2{font-size:1.25rem}}`;

      const ov = document.createElement('div');
      ov.id = 'ep-ov';
      ov.innerHTML = `<style>${css}</style>
        <div id="ep">
          <button id="ep-x" aria-label="Fechar">✕</button>
          <div id="ep-ico">⏳</div>
          <h2>Espere! Seus direitos têm prazo.</h2>
          <p>O prazo para ação trabalhista é de <strong>2 anos</strong> após a demissão. Não perca essa janela.</p>
          <div id="ep-items">
            <div class="ep-it">✅ Consulta 100% gratuita</div>
            <div class="ep-it">✅ Sem compromisso</div>
            <div class="ep-it">✅ Resposta no mesmo dia</div>
          </div>
          <a id="ep-cta" href="${WPP}" target="_blank">📱 Falar com Advogado Agora</a>
          <button id="ep-skip">Não, vou perder meus direitos</button>
        </div>`;

      document.body.appendChild(ov);
      function close() { ov.style.opacity = '0'; ov.style.transition = 'opacity .3s'; setTimeout(() => ov.remove(), 320); }
      document.getElementById('ep-x').onclick    = close;
      document.getElementById('ep-skip').onclick = close;
      ov.addEventListener('click', e => { if (e.target === ov) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
    }

    // Desktop: cursor sai pelo topo
    document.addEventListener('mouseleave', function h(e) {
      if (e.clientY < 5) { show(); document.removeEventListener('mouseleave', h); }
    });
    // Mobile: scroll para cima rápido
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < lastY - 100 && y < 300) show();
      lastY = y;
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initBanner, 1000);
    initPopup();
  });
})();
