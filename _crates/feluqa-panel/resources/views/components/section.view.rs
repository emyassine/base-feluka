<section class="fi-section fi-section-has-header fi-section-has-content">
  <header class="fi-section-header">
    <div class="fi-section-header-content">
      <div class="fi-section-header-text-ctn">
        <h2 class="fi-section-header-heading">{{ heading }}</h2>
        @if (!description.is_empty())
        <p class="fi-section-header-description">{{ description }}</p>
        @endif
      </div>
    </div>
  </header>
  <div class="fi-section-content-ctn"><div class="fi-section-content">@yield("default")</div></div>
</section>
