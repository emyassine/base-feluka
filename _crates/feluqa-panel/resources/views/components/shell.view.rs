<a href="#fi-main-content" class="fi-skip-link fi-sr-only">Skip to content</a>
<div class="fi-layout-sidebar-toggle-btn-ctn lg:fi-hidden">
  <button class="fi-icon-btn fi-layout-sidebar-toggle-btn" type="button" data-feluqa-sidebar-toggle aria-controls="fi-main-sidebar" aria-expanded="false" aria-label="Open navigation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
  </button>
</div>
<div class="fi-app-shell" data-panel-id="{{ panel }}">
  <div class="fi-layout">
    <aside id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar" data-active-path="{{ active }}" aria-label="Primary navigation">
      <div class="fi-sidebar-header-ctn">
        <header class="fi-sidebar-header">
          <div class="fi-sidebar-header-logo-ctn"><a href="/" aria-label="Panel home"><span class="fi-logo">{{ brand_name }}</span></a></div>
          <button class="fi-icon-btn fi-sidebar-open-collapse-sidebar-btn" type="button" data-feluqa-sidebar-toggle aria-controls="fi-main-sidebar" aria-expanded="false" aria-label="Expand sidebar" hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 18.75 6-6-6-6"/></svg>
          </button>
          <button class="fi-icon-btn fi-sidebar-close-collapse-sidebar-btn" type="button" data-feluqa-sidebar-toggle aria-controls="fi-main-sidebar" aria-expanded="true" aria-label="Collapse sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m14.25 18.75-6-6 6-6"/></svg>
          </button>
        </header>
      </div>
      <div class="fi-sidebar-header-controls">
        <div class="fi-global-search-ctn">
          <div class="fi-global-search">
            <div class="fi-global-search-field">
              <label for="feluqa-panel-search" class="fi-sr-only">Search navigation</label>
              <div class="fi-input-wrp">
                <div class="fi-input-wrp-prefix fi-input-wrp-prefix-has-content fi-inline" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-4-4"/></svg></div>
                <div class="fi-input-wrp-content-ctn"><input id="feluqa-panel-search" class="fi-input" type="search" autocomplete="off" placeholder="Search" data-feluqa-nav-search></div>
                <div class="fi-input-wrp-suffix fi-inline"><span class="fi-input-wrp-label">⌘K</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!! navigation !!}
      <footer class="fi-sidebar-footer">
        <details class="fi-user-menu">
          <summary class="fi-user-menu-trigger" aria-label="Open account menu">
            <span class="fi-user-avatar" role="img" :aria-label="display_name" data-user-name="{{ display_name }}">{{ display_name }}</span>
            <span class="fi-user-menu-trigger-text">{{ display_name }}</span>
            <span class="fi-user-menu-toggle-button" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg></span>
          </summary>
          <div class="fi-dropdown-panel">
            <div class="fi-user-menu-profile"><span class="fi-user-avatar" aria-hidden="true" data-user-name="{{ display_name }}">{{ display_name }}</span><span><strong>{{ display_name }}</strong><small>{{ email }}</small></span></div>
            <div class="fi-theme-switcher" role="group" aria-label="Theme" data-feluqa-theme-switcher>
              <button type="button" class="fi-theme-switcher-btn" data-feluqa-theme="light" aria-label="Light theme" title="Light"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg></button>
              <button type="button" class="fi-theme-switcher-btn" data-feluqa-theme="dark" aria-label="Dark theme" title="Dark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 15.75A8.25 8.25 0 0 1 8.25 3.75a8.25 8.25 0 1 0 12 12Z"/></svg></button>
              <button type="button" class="fi-theme-switcher-btn" data-feluqa-theme="system" aria-label="System theme" title="System"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="13" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4"/></svg></button>
            </div>
            <form method="post" action="/system/logout"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><button class="fi-user-menu-logout" type="submit">Sign out</button></form>
          </div>
        </details>
      </footer>
    </aside>
    <button class="fi-sidebar-close-overlay" type="button" data-feluqa-sidebar-close aria-label="Close navigation" hidden></button>
    <div class="fi-main-ctn">
      <main id="fi-main-content" class="fi-main fi-width-7xl" tabindex="-1">
        <div class="fi-page"><div class="fi-page-main"><div class="fi-page-content">@yield("default")</div></div></div>
      </main>
    </div>
  </div>
</div>
