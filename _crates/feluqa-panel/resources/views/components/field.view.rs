<div class="fi-fo-field" data-field-wrapper>
  <div class="fi-fo-field-label-col">
    <div class="fi-fo-field-label-ctn">
      <label class="fi-fo-field-label" for="{{ id }}">
        <span class="fi-fo-field-label-content">{{ label }}
	        @if (required)
        		<sup class="fi-fo-field-label-required-mark">*</sup>
			@endif
		</span>
      </label>
    </div>
  </div>
  <div class="fi-fo-field-content-col">
    <div class="fi-input-wrp">
      <div class="fi-input-wrp-content-ctn">@yield("default")</div>
    </div>
  </div>
</div>
