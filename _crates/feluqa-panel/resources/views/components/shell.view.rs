<div class="fi-app-shell">
  <div class="fi-layout">
    <aside id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar fi-sidebar-open" data-active-path="{{ active }}" aria-label="Primary navigation">
      <div class="fi-sidebar-header-ctn">
        <header class="fi-sidebar-header">
          <div class="fi-sidebar-header-logo-ctn"><a href="/" aria-label="Feluqa home">Feluqa</a></div>
        </header>
      </div>
      {!! navigation !!}
      <footer class="fi-sidebar-footer"><span class="fi-sidebar-item-label">{{ panel }}</span></footer>
    </aside>
    <div class="fi-main-ctn">
      <header class="fi-topbar-ctn">
        <nav class="fi-topbar">
          <div class="fi-topbar-start">@if (panel == "system") Feluqa Core @else Numerimondes @endif</div>
          <div class="fi-topbar-end"><span class="fi-user-menu-trigger">{{ panel }}</span></div>
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
