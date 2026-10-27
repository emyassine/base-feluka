<div class="fi-app-shell">
  <div class="fi-layout">
    <aside id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar" data-active-path="{{ active }}" aria-label="Primary navigation">
      <div class="fi-sidebar-header-ctn">
        <header class="fi-sidebar-header">
          <div class="fi-sidebar-header-logo-ctn"><a href="/" aria-label="Panel home"><span class="fi-logo-mark" aria-hidden="true">F</span><span>@if (panel == "system") Feluqa Core @else Numerimondes @endif</span></a></div>
        </header>
      </div>
      {!! navigation !!}
      <footer class="fi-sidebar-footer"><span class="fi-sidebar-item-label">@if (panel == "system") Feluqa Core @else Numerimondes @endif</span></footer>
    </aside>
    <button class="fi-sidebar-backdrop" type="button" data-feluqa-sidebar-close aria-label="Close navigation"></button>
    <div class="fi-main-ctn">
      <header class="fi-topbar-ctn">
        <nav class="fi-topbar">
          <div class="fi-topbar-start"><button class="fi-mobile-menu-button" type="button" data-feluqa-sidebar-toggle aria-controls="fi-main-sidebar" aria-expanded="false">Menu</button><span>@if (panel == "system") Feluqa Core @else {{ panel }} @endif</span></div>
          <div class="fi-topbar-end">
            <details class="fi-user-menu">
              <summary class="fi-user-menu-trigger" aria-label="User account">
                <span class="fi-user-avatar" role="img" :aria-label="display_name">{{ display_name }}</span>
                <span class="fi-user-menu-trigger-text"><strong>{{ display_name }}</strong><small>{{ email }}</small></span>
                <span class="fi-user-menu-toggle-button" aria-hidden="true">⌄</span>
              </summary>
              <div class="fi-dropdown-panel"><p>@if (panel == "system") Feluqa Core @else Numerimondes @endif</p></div>
            </details>
          </div>
        </nav>
      </header>
      <main id="fi-main-content" class="fi-main fi-width-7xl" tabindex="-1">
        <div class="fi-page">
          <div class="fi-page-main"><div class="fi-page-content">@yield("default")</div></div>
        </div>
      </main>
    </div>
  </div>
</div>
