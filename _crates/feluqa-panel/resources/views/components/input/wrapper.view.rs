<div class="fi-input-wrp">
  <div class="fi-input-wrp-prefix fi-input-wrp-prefix-has-content fi-inline" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-4-4"/></svg>
  </div>
  <div class="fi-input-wrp-content-ctn">@yield("default")</div>
  @if (!suffix.is_empty())
  <div class="fi-input-wrp-suffix fi-inline"><span class="fi-input-wrp-label">{{ suffix }}</span></div>
  @endif
</div>
