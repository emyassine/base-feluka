@extends("app::layouts.main")
@section("content")
  <main class="layout"><div class="multipage-content">
    <div data-multipage-active="start">
      <section id="explore" aria-labelledby="explore-title">
        <p class="eyebrow">Explore Webkernel</p>
        <h2 id="explore-title">Built to be understood.</h2>
        <div class="story-grid">
          <a class="story" href="/#concepts"><img src="/assets/art/architecture-unsplash-640.webp" srcset="/assets/art/architecture-unsplash-320.webp 320w, /assets/art/architecture-unsplash-640.webp 640w" sizes="(max-width: 600px) 120px, 33vw" alt="Sunlit concrete arches" width="640" height="427" fetchpriority="high"><small>01 / Architecture</small><h3>Understand the foundations</h3><p>Request lifecycle, performance budgets, and domain boundaries.</p></a>
          <a class="story" href="/#build"><img src="/assets/art/workshop-unsplash-640.webp" srcset="/assets/art/workshop-unsplash-320.webp 320w, /assets/art/workshop-unsplash-640.webp 640w" sizes="(max-width: 600px) 120px, 33vw" alt="Metal components on engineering blueprints" width="640" height="427" loading="lazy" decoding="async"><small>02 / Development</small><h3>Build your application</h3><p>Routes, views, and the frontend tools that bring them together.</p></a>
          <a class="story" href="/#docs"><img src="/assets/art/library-unsplash-640.webp" srcset="/assets/art/library-unsplash-320.webp 320w, /assets/art/library-unsplash-640.webp 640w" sizes="(max-width: 600px) 120px, 33vw" alt="Wooden bookshelves at a library" width="640" height="427" loading="lazy" decoding="async"><small>03 / Reference</small><h3>Get into the details</h3><p>Documentation shipped with each installed package.</p></a>
        </div>
      </section>
      <nav class="quick-links" aria-label="Quick links"><span>Quick links</span><a class="btn" href="/#environment">Check your environment <span aria-hidden="true">→</span></a><a class="btn" href="/#build">Your first route <span aria-hidden="true">→</span></a><a class="btn" href="/about">About Numerimondes <span aria-hidden="true">→</span></a></nav>
      <x-site::section id="environment" eyebrow="Numerimondes" title="Technology under your control."><p class="lede">Independent software, systems and digital infrastructure for organisations that want control of their tools and their data.</p></x-site::section>
      <x-site::section id="concepts" eyebrow="Architecture" title="One ecosystem. Separate runtimes."><p class="lede">Web, APIs, mobile, desktop, games and real-time systems share contracts and tooling while each profile keeps the runtime its constraints require.</p></x-site::section>
      <x-site::section id="build" eyebrow="Development" title="Build for the work at hand."><p class="lede">Routes and views stay close to the application. Production views compile into the binary; development tools are designed for a short edit-and-refresh loop.</p></x-site::section>
      <x-site::section id="packages" eyebrow="Packages" title="Small, visible dependencies."><p class="lede">Use established Rust components where they fit, with explicit ownership of configuration, storage and deployment.</p></x-site::section>
      <section id="components"><p class="eyebrow">Components</p><h2>Reusable application building blocks.</h2></section>
      <section id="docs"><p class="eyebrow">Reference</p><h2>Documentation that travels with the platform.</h2></section>
    </div>
  </div></main>

@endsection
