/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

document.addEventListener('DOMContentLoaded', function () {
  const navItems = document.querySelectorAll('.nav-item');
  const frames   = document.querySelectorAll('.tool-frame');
  const badge    = document.getElementById('tool-badge');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const id    = item.dataset.frame;
      const label = item.dataset.label;

      navItems.forEach(function (n) { n.classList.remove('active'); });
      frames.forEach(function (f)   { f.classList.remove('active'); });

      item.classList.add('active');
      document.getElementById('frame-' + id).classList.add('active');
      badge.textContent = label;
      sizeFrame(document.getElementById('frame-' + id));
    });
  });

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
    frames.forEach(sizeFrame);
  }
  frames.forEach(function (frame) {
    frame.addEventListener('load', function () {
      sizeFrame(frame);
      try {
        const doc = frame.contentDocument;
        if (doc && doc.body && typeof ResizeObserver === 'function') {
          if (frame._resizeObserver) frame._resizeObserver.disconnect();
          frame._resizeObserver = new ResizeObserver(function () { sizeFrame(frame); });
          frame._resizeObserver.observe(doc.body);
        }
      } catch (e) { /* cross-origin */ }
    });
  });
  window.addEventListener('load', sizeAllFrames);
  window.addEventListener('resize', sizeAllFrames);
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', sizeAllFrames);
  }
});
