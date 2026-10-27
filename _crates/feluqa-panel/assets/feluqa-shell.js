"use strict";

(() => {
  const sidebar = document.getElementById('fi-main-sidebar');
  if (!sidebar) return;

  const toggles = document.querySelectorAll('[data-feluqa-sidebar-toggle]');
  const closeButtons = document.querySelectorAll('[data-feluqa-sidebar-close]');
  const overlay = document.querySelector('.fi-sidebar-close-overlay');
  const mobile = window.matchMedia('(max-width: 63.999rem)');
  const search = sidebar.querySelector('[data-feluqa-nav-search]');
  const themeButtons = document.querySelectorAll('[data-feluqa-theme]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const languageSelector = document.querySelector('[data-feluqa-language-selector]');

  if (languageSelector) {
    const localeCookie = document.cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith('feluqa_locale='));
    const supported = ['en', 'fr', 'ar', 'es', 'de', 'pt'];
    const locale = localeCookie?.slice('feluqa_locale='.length);
    const activeLocale = supported.includes(locale) ? locale : 'en';
    const label = languageSelector.querySelector('[data-feluqa-locale-label]');
    const currentFlag = languageSelector.querySelector('[data-feluqa-current-flag]');
    if (label) label.textContent = activeLocale.toUpperCase();
    if (currentFlag) currentFlag.src = `/assets/feluqa/flags/${activeLocale}`;
    languageSelector.querySelectorAll('[data-feluqa-locale-option]').forEach((button) => {
      const selected = button.dataset.feluqaLocaleOption === activeLocale;
      button.setAttribute('aria-current', selected ? 'true' : 'false');
      if (selected) button.insertAdjacentHTML('beforeend', '<span class="w-lang-selected" aria-hidden="true">✓</span>');
    });
    document.documentElement.lang = activeLocale;
    document.documentElement.dir = activeLocale === 'ar' ? 'rtl' : 'ltr';
  }

  const applyTheme = (theme, persist) => {
    currentTheme = theme;
    const dark = theme === 'dark' || (theme === 'system' && systemTheme.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    themeButtons.forEach((button) => {
      const selected = button.dataset.feluqaTheme === theme;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('fi-active', selected);
    });
    if (persist) {
      try {
        localStorage.setItem('feluqa:theme', theme);
      } catch {
        // Theme choice remains active for this page when storage is unavailable.
      }
    }
  };

  let currentTheme = 'system';
  try {
    currentTheme = localStorage.getItem('feluqa:theme') || 'system';
  } catch {
    // Use the operating-system theme when storage is unavailable.
  }
  applyTheme(currentTheme, false);
  themeButtons.forEach((button) => button.addEventListener('click', () => {
    applyTheme(button.dataset.feluqaTheme, true);
  }));
  systemTheme.addEventListener('change', () => {
    if (currentTheme === 'system') applyTheme('system', false);
  });

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

  document.querySelectorAll('[data-feluqa-table-search]').forEach((input) => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLocaleLowerCase();
      const table = input.closest('.fi-ta')?.querySelector('.fi-ta-table tbody');
      table?.querySelectorAll('tr').forEach((row) => {
        row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
      });
    });
  });

  sidebar.querySelectorAll('.fi-user-avatar[data-user-name]').forEach((avatar) => {
    const name = avatar.dataset.userName.trim();
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => Array.from(part)[0]).join('');
    avatar.textContent = initials.toLocaleUpperCase();
  });

  setOpen(!mobile.matches);
})();
