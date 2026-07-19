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
    });
  });
});
