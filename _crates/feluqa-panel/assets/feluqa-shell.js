"use strict";

(() => {
  const sidebar = document.getElementById('fi-main-sidebar');
  if (!sidebar) return;

  const toggles = document.querySelectorAll('[data-feluqa-sidebar-toggle]');
  const closeButtons = document.querySelectorAll('[data-feluqa-sidebar-close]');
  const overlay = document.querySelector('.fi-sidebar-close-overlay');
  const mobile = window.matchMedia('(max-width: 63.999rem)');
  const search = sidebar.querySelector('[data-feluqa-nav-search]');

  const setOpen = (open) => {
    sidebar.dataset.sidebarOpen = String(open);
    sidebar.classList.toggle('fi-sidebar-open', open);
    toggles.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    closeButtons.forEach((button) => button.toggleAttribute('hidden', !open || !mobile.matches));
    overlay?.toggleAttribute('hidden', !open || !mobile.matches);
    sidebar.querySelectorAll('.fi-sidebar-header-logo-ctn, .fi-sidebar-header-controls, .fi-sidebar-group-label, .fi-sidebar-group-collapse-btn, .fi-sidebar-item-label, .fi-user-menu-trigger-text, .fi-user-menu-toggle-button').forEach((element) => {
      element.toggleAttribute('hidden', !open);
    });
    sidebar.querySelectorAll('.fi-sidebar-open-collapse-sidebar-btn').forEach((button) => button.toggleAttribute('hidden', open || mobile.matches));
    sidebar.querySelectorAll('.fi-sidebar-close-collapse-sidebar-btn').forEach((button) => button.toggleAttribute('hidden', !open || mobile.matches));
  };

  toggles.forEach((button) => button.addEventListener('click', () => {
    setOpen(sidebar.dataset.sidebarOpen !== 'true');
  }));
  closeButtons.forEach((button) => button.addEventListener('click', () => setOpen(false)));
  sidebar.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobile.matches) setOpen(false);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches) setOpen(false);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search?.focus();
    }
  });
  mobile.addEventListener('change', (event) => setOpen(!event.matches));

  sidebar.querySelectorAll('[data-feluqa-group-toggle]').forEach((button) => {
    const label = button.dataset.groupLabel;
    const group = button.closest('.fi-sidebar-group');
    const items = group?.querySelector('[data-feluqa-group-items]');
    if (!items || !label) return;
    const storageKey = `feluqa:sidebar:collapsed:${label}`;
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(storageKey) === 'true';
    } catch {
      collapsed = false;
    }
    const setCollapsed = (value) => {
      collapsed = value;
      group.classList.toggle('fi-collapsed', collapsed);
      items.hidden = collapsed;
      button.setAttribute('aria-expanded', String(!collapsed));
      try {
        localStorage.setItem(storageKey, String(collapsed));
      } catch {
        // Storage can be unavailable in private or restricted browser contexts.
      }
    };
    setCollapsed(collapsed);
    button.addEventListener('click', () => setCollapsed(!collapsed));
  });

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    sidebar.querySelectorAll('.fi-sidebar-group').forEach((group) => {
      let visibleItems = 0;
      group.querySelectorAll(':scope > [data-feluqa-group-items] > .fi-sidebar-item').forEach((item) => {
        const visible = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !visible;
        if (visible) visibleItems += 1;
      });
      group.hidden = visibleItems === 0;
      if (query) {
        const items = group.querySelector('[data-feluqa-group-items]');
        if (items) items.hidden = false;
        group.classList.remove('fi-collapsed');
      }
    });
  });

  sidebar.querySelectorAll('.fi-user-avatar[data-user-name]').forEach((avatar) => {
    const name = avatar.dataset.userName.trim();
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => Array.from(part)[0]).join('');
    avatar.textContent = initials.toLocaleUpperCase();
  });

  setOpen(!mobile.matches);
})();
