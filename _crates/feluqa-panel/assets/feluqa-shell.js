(() => {
  const sidebar = document.getElementById('fi-main-sidebar');
  if (!sidebar) return;

  const toggle = document.querySelector('[data-feluqa-sidebar-toggle]');
  const close = document.querySelector('[data-feluqa-sidebar-close]');
  const mobile = window.matchMedia('(max-width: 63.999rem)');

  const setOpen = (open) => {
    sidebar.dataset.sidebarOpen = String(open);
    toggle?.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('fi-sidebar-open', open && mobile.matches);
  };

  toggle?.addEventListener('click', () => {
    setOpen(sidebar.dataset.sidebarOpen !== 'true');
  });
  close?.addEventListener('click', () => setOpen(false));
  sidebar.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobile.matches) setOpen(false);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches) setOpen(false);
  });
  mobile.addEventListener('change', (event) => setOpen(!event.matches));
  setOpen(!mobile.matches);
})();
