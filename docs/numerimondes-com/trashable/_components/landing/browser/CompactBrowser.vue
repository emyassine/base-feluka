<script setup>
defineProps({
  radius: Number,
  innerRadius: Number,
  pad: Number,
  topbarH: Number,
  border: String,
  bg: String,
  surface: String,
  imageSrc: String,
  imageAlt: String,
  phoneImageSrc: String,
  phoneImageAlt: String,
  tabletImageSrc: String,
  tabletImageAlt: String,
});
</script>

<template>
  <div
    class="platform-preview"
    :style="{
      '--pp-radius': (radius || 14) + 'px',
      '--pp-inner-radius': (innerRadius || 12) + 'px',
      '--pp-pad': (pad || 10) + 'px',
      '--pp-topbar-h': (topbarH || 32) + 'px',
      '--pp-border': border || 'color-mix(in srgb, var(--vp-c-border) 80%, transparent)',
      '--pp-bg': bg || 'color-mix(in srgb, var(--vp-c-bg-soft) 86%, transparent)',
      '--pp-surface': surface || 'color-mix(in srgb, var(--vp-c-bg) 92%, transparent)',
    }"
  >
    <div class="preview-gradient"></div>
    <div class="preview-content">
      <img v-if="imageSrc" class="preview-image" :src="imageSrc" :alt="imageAlt" />
      <img v-if="phoneImageSrc" class="preview-image is-phone" :src="phoneImageSrc" :alt="phoneImageAlt" />
      <img v-if="tabletImageSrc" class="preview-image is-tablet" :src="tabletImageSrc" :alt="tabletImageAlt" />
      <div v-if="!imageSrc && !phoneImageSrc && !tabletImageSrc" class="preview-placeholder">Product UI Preview</div>
    </div>
  </div>
</template>

<style scoped>
.platform-preview {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto 2rem;
  border: 1px solid var(--pp-border);
  border-radius: var(--pp-radius);
  background: var(--pp-bg);
  box-shadow: var(--vp-shadow-3);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  overflow: clip;
  padding-top: var(--pp-topbar-h);
}

.preview-gradient {
  position: absolute;
  left: var(--pp-pad);
  right: var(--pp-pad);
  top: calc(var(--pp-topbar-h) + var(--pp-pad));
  bottom: var(--pp-pad);
  border-radius: var(--pp-inner-radius);
  background:
    radial-gradient(900px 340px at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent), transparent 62%),
    linear-gradient(var(--pp-surface), var(--pp-surface));
}

.preview-content {
  position: relative;
  margin: var(--pp-pad);
  margin-top: var(--pp-pad);
  height: clamp(260px, 46vw, 620px);
  border-radius: var(--pp-inner-radius);
  overflow: hidden;
  background: var(--pp-surface);
}

.preview-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.preview-image.is-phone {
  object-fit: contain;
  padding: clamp(10px, 2.2vw, 22px);
}

.preview-image.is-tablet {
  object-fit: contain;
  padding: clamp(8px, 1.6vw, 16px);
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font: 600 13px/1.2 var(--vp-font-family-base);
  color: var(--vp-c-text-3);
  background: linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg-soft) 75%, transparent), transparent);
}

.platform-preview::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: var(--pp-topbar-h);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-border) 70%, transparent);
  background:
    radial-gradient(circle at 50px 16px, color-mix(in srgb, #28c840 85%, var(--vp-c-bg) 15%) 0 4px, transparent 5px),
    radial-gradient(circle at 18px 16px, color-mix(in srgb, #ff5f57 85%, var(--vp-c-bg) 15%) 0 4px, transparent 5px),
    radial-gradient(circle at 34px 16px, color-mix(in srgb, #febc2e 85%, var(--vp-c-bg) 15%) 0 4px, transparent 5px),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--vp-c-bg) 78%, transparent),
      color-mix(in srgb, var(--vp-c-bg-soft) 78%, transparent)
    );
}

.platform-preview::after {
  content: '';
  position: absolute;
  left: var(--pp-pad);
  right: var(--pp-pad);
  top: calc(var(--pp-topbar-h) + var(--pp-pad));
  bottom: var(--pp-pad);
  border-radius: var(--pp-inner-radius);
  border: 1px solid color-mix(in srgb, var(--vp-c-border) 70%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--vp-c-bg) 70%, transparent);
  pointer-events: none;
}

@media (max-width: 480px) {
  .platform-preview {
    --pp-pad: 8px;
    --pp-topbar-h: 30px;
    --pp-radius: 12px;
    --pp-inner-radius: 10px;
  }

  .preview-content {
    height: clamp(220px, 62vw, 520px);
  }
}
</style>
