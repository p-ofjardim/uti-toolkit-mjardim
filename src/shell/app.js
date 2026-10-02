// Shell do UTI Toolkit: banner de instalação e registro do service worker (PWA),
// navegação e redimensionamento de iframes (PWA e extensão).
// O script roda no fim do <body>: o DOM já está parseado.
// O build remove o bloco PWA-ONLY na versão da extensão.

/* PWA-ONLY */
let deferredPrompt = null;
const installBanner = document.getElementById('install-banner');
const installBtn    = document.getElementById('install-btn');
const dismissBtn    = document.getElementById('dismiss-install');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.classList.add('show');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBanner.classList.remove('show');
});

dismissBtn.addEventListener('click', () => {
  installBanner.classList.remove('show');
});

window.addEventListener('appinstalled', () => {
  installBanner.classList.remove('show');
  deferredPrompt = null;
});

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('{{BASE}}sw.js').catch(() => {});
}
/* END PWA-ONLY */

// ── Navigation ──
const navItems = document.querySelectorAll('.nav-item');
const frames   = document.querySelectorAll('.tool-frame');
const badge    = document.getElementById('tool-badge');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const id = item.dataset.frame;
    const label = item.dataset.label;

    navItems.forEach((n) => n.classList.remove('active'));
    frames.forEach((f) => f.classList.remove('active'));

    item.classList.add('active');
    document.getElementById(`frame-${id}`).classList.add('active');
    badge.textContent = label;
    sizeFrame(document.getElementById(`frame-${id}`));
  });
});

// ── iOS iframe scroll fix ──
// iOS Safari does not scroll iframes with fixed height (WebKit bug 149264).
// Resize each same-origin frame to its content height and let .app-content scroll.
function sizeFrame(frame) {
  if (!frame) return;
  try {
    const doc = frame.contentDocument;
    if (!doc || !doc.body) return;
    frame.style.height = 'auto';
    const h = Math.max(
      doc.body.scrollHeight,
      doc.documentElement.scrollHeight,
      frame.parentElement.clientHeight
    );
    frame.style.height = h + 'px';
  } catch (e) { /* cross-origin: keep CSS height */ }
}

function sizeAllFrames() {
  document.querySelectorAll('.tool-frame').forEach(sizeFrame);
  }

document.querySelectorAll('.tool-frame').forEach(frame => {
    frame.addEventListener('load', () => {
      sizeFrame(frame);
      try {
        const doc = frame.contentDocument;
        if (doc && doc.body && typeof ResizeObserver === 'function') {
          if (frame._resizeObserver) frame._resizeObserver.disconnect();
          const ro = new ResizeObserver(() => sizeFrame(frame));
          ro.observe(doc.body);
          frame._resizeObserver = ro;
        }
      } catch (e) { /* cross-origin */ }
    });
  });

window.addEventListener('load', sizeAllFrames);
window.addEventListener('resize', sizeAllFrames);
window.visualViewport && visualViewport.addEventListener('resize', sizeAllFrames);