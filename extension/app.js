const navItems = document.querySelectorAll('.nav-item');
    const frames   = document.querySelectorAll('.tool-frame');
    const badge    = document.getElementById('tool-badge');

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        const id    = item.dataset.frame;
        const label = item.dataset.label;

        navItems.forEach((n) => n.classList.remove('active'));
        frames.forEach((f)   => f.classList.remove('active'));

        item.classList.add('active');
        document.getElementById(`frame-${id}`).classList.add('active');
        badge.textContent = label;
      });
    });