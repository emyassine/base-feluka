@rs
let home_active = if active == "/system" || active == "/admin" { " fi-active" } else { "" };
let users_active = if active == "/system/users" { " fi-active" } else { "" };
let roles_active = if active == "/system/roles" { " fi-active" } else { "" };
let tenants_active = if active == "/system/tenants" { " fi-active" } else { "" };
let modules_active = if active == "/system/modules" { " fi-active" } else { "" };
let connections_active = if active == "/system/connections" { " fi-active" } else { "" };
let migrations_active = if active == "/system/migrations" { " fi-active" } else { "" };
let audit_active = if active == "/system/audit" { " fi-active" } else { "" };
let crm_active = if active == "/admin/customers" { " fi-active" } else { "" };
@endrs
<div class="fi-app-shell">
  <div class="fi-layout">
    <aside id="fi-main-sidebar" class="fi-sidebar fi-main-sidebar fi-sidebar-open" aria-label="Primary navigation">
      <div class="fi-sidebar-header-ctn">
        <header class="fi-sidebar-header">
          <div class="fi-sidebar-header-logo-ctn"><a href="/" aria-label="Feluqa home">Feluqa</a></div>
        </header>
      </div>
      <nav class="fi-sidebar-nav" aria-label="Panel navigation">
        <ul class="fi-sidebar-nav-groups">
          <li class="fi-sidebar-group">
            <ul class="fi-sidebar-group-items">
              @if (panel == "system")
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ home_active }}"><a class="fi-sidebar-item-btn" href="/system"><span class="fi-sidebar-item-label">Overview</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ users_active }}"><a class="fi-sidebar-item-btn" href="/system/users"><span class="fi-sidebar-item-label">Users</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ roles_active }}"><a class="fi-sidebar-item-btn" href="/system/roles"><span class="fi-sidebar-item-label">Roles</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ tenants_active }}"><a class="fi-sidebar-item-btn" href="/system/tenants"><span class="fi-sidebar-item-label">Tenants</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ modules_active }}"><a class="fi-sidebar-item-btn" href="/system/modules"><span class="fi-sidebar-item-label">Modules</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ connections_active }}"><a class="fi-sidebar-item-btn" href="/system/connections"><span class="fi-sidebar-item-label">Connections</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ migrations_active }}"><a class="fi-sidebar-item-btn" href="/system/migrations"><span class="fi-sidebar-item-label">Migrations</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ audit_active }}"><a class="fi-sidebar-item-btn" href="/system/audit"><span class="fi-sidebar-item-label">Audit log</span></a></li>
              @else
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ home_active }}"><a class="fi-sidebar-item-btn" href="/admin"><span class="fi-sidebar-item-label">Overview</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url{{ crm_active }}"><a class="fi-sidebar-item-btn" href="/admin/customers"><span class="fi-sidebar-item-label">Customers</span></a></li>
                <li class="fi-sidebar-item fi-sidebar-item-has-url"><a class="fi-sidebar-item-btn" href="/system"><span class="fi-sidebar-item-label">Feluqa Core</span></a></li>
              @endif
            </ul>
          </li>
        </ul>
      </nav>
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
