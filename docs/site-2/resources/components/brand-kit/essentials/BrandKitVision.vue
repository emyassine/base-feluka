<template>
  <article class="brand-kit-vision brand-kit-overview__section brand-kit-overview__section--bordered">
    <div class="brand-kit-overview__column">
      <p class="brand-kit-overview__label">{{ label }}</p>
      <h2 :id="titleId" class="brand-kit-vision__title">
        <span class="silky-bbi" style="line-height: 1.15"><slot /></span>
      </h2>
    </div>
  </article>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  titleId?: string
}>(), {
  label: 'Our Vision',
  titleId: 'brand-kit-overview-title-0-0',
})
</script>

<style scoped>
.brand-kit-vision {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  border-bottom: 1px solid var(--brand-kit-line);
}

.brand-kit-overview__column {
  min-width: 0;
}

.brand-kit-overview__label {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-vision__title {
  margin: 0;
  padding-top: 0.7rem;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.brand-kit-vision :deep(.inline-image-preview) {
  position: relative;
  display: inline-flex;
  width: 1.7em;
  height: 1.15em;
  margin: 0 0.08em;
  vertical-align: -0.15em;
  cursor: pointer;
}

.brand-kit-vision :deep(.inline-image-preview > img) {
  width: 100%;
  height: 100%;
  border-radius: 0.18em;
  object-fit: cover;
}

.brand-kit-vision :deep(.inline-image-preview__popover) {
  position: absolute;
  z-index: 5;
  bottom: calc(100% + 0.65rem);
  left: 50%;
  display: grid;
  width: min(18rem, 75vw);
  gap: 0.45rem;
  padding: 0.55rem;
  border: 1px solid var(--brand-kit-line);
  border-radius: 0.65rem;
  background: var(--vp-c-bg);
  box-shadow: 0 0.8rem 2.5rem rgb(0 0 0 / 18%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 0.35rem);
  transition: opacity 160ms ease, transform 160ms ease;
}

.brand-kit-vision :deep(.inline-image-preview__popover > img) {
  display: block;
  width: 100%;
  max-height: 12rem;
  border-radius: 0.35rem;
  object-fit: cover;
}

.brand-kit-vision :deep(.inline-image-preview__caption) {
  color: var(--brand-kit-muted);
  font-size: 0.75rem;
  line-height: 1.4;
}

.brand-kit-vision :deep(.inline-image-preview:hover .inline-image-preview__popover),
.brand-kit-vision :deep(.inline-image-preview:focus-visible .inline-image-preview__popover),
.brand-kit-vision :deep(.inline-image-preview:focus-within .inline-image-preview__popover) {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .brand-kit-vision :deep(.inline-image-preview__popover) {
    transition: none;
  }
}
</style>
