<template>
  <div id="template-overlay" v-html="templateOverlay"></div>
  <div id="__framer-badge-container" v-html="badge"></div>
  <div id="svg-templates" style="position: absolute; overflow: hidden; bottom: 0; left: 0; width: 0; height: 0; z-index: 0; contain: strict" aria-hidden="true" v-html="svgTemplates"></div>
</template>

<script setup lang="ts">
import templateOverlay from './BrandKitOurBrandDecorations-templateOverlay.html?raw'
import badge from './BrandKitOurBrandDecorations-badge.html?raw'
import svgTemplates from './BrandKitOurBrandDecorations-svgTemplates.html?raw'
</script>
