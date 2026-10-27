  <header class="head" id="head">
    <div class="topbar"><div class="wrap">
      <a class="brand" href="/" aria-label="Webkernel home"><picture data-theme-picture><source srcset="/assets/branding/webkernel-logo-dark.webp" type="image/webp" media="(prefers-color-scheme: dark)"><img class="brand-logo" src="/assets/branding/webkernel-logo-light.webp" alt="Webkernel" width="181" height="40" fetchpriority="high" decoding="async"></picture></a>
      <span class="grow"></span>
      <div class="search"><label><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg><input type="search" placeholder="Search docs and packages" aria-label="Search docs and packages" autocomplete="off"><kbd>/</kbd></label></div>
      <a class="ext" href="#explore">Get started <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg></a>
    </div></div>
    <div class="subbar"><div class="wrap">
      <nav class="subnav grow" aria-label="Main navigation">
        <a @if (page.is_home) class="active" aria-current="page" @endif href="/">Get started</a>
        <a href="/#environment">Environment</a><a href="/#concepts">Concepts</a>
        <a href="/#build">Build</a><a href="/#packages">Packages</a>
        <a href="/#components">Components</a><a href="/#docs">Documentation</a>
        <a @if (!page.is_home) class="active" aria-current="page" @endif href="/about">About</a>
      </nav>
      <div class="subbar-controls">
        <div class="meta"><span><span class="dot"></span> Request {{ page.request_time() }} ms</span></div>
        <details class="language-switcher"><summary><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"></path></svg> EN <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg></summary><nav aria-label="Language"><a href="/">English</a><a href="/about">Français</a></nav></details>
        <button class="theme-toggle" id="theme-toggle" data-theme-toggle role="switch" aria-checked="false" aria-label="Toggle dark mode"><span></span></button>
      </div>
    </div></div>
  </header>
