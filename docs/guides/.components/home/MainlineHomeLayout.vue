<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import interFont from './assets/fonts/Inter-Variable.ttf?url'
import dmSansRegular from './assets/fonts/DMSans-Regular.ttf?url'
import dmSansItalic from './assets/fonts/DMSans-Italic.ttf?url'
import dmSansMedium from './assets/fonts/DMSans-Medium.ttf?url'
import dmSansMediumItalic from './assets/fonts/DMSans-MediumItalic.ttf?url'
import dmSansSemiBold from './assets/fonts/DMSans-SemiBold.ttf?url'
import dmSansSemiBoldItalic from './assets/fonts/DMSans-SemiBoldItalic.ttf?url'
import dmSansBold from './assets/fonts/DMSans-Bold.ttf?url'
import dmSansBoldItalic from './assets/fonts/DMSans-BoldItalic.ttf?url'

let fontStyle: HTMLStyleElement | undefined
onMounted(() => {
  fontStyle = document.createElement('style')
  fontStyle.dataset.mainlineFonts = ''
  fontStyle.textContent = [
    `@font-face{font-family:'Mainline Inter';src:url('${interFont}') format('truetype');font-style:normal;font-weight:100 900;font-display:swap}`,
    ...[
      [dmSansRegular, 400, 'normal'], [dmSansItalic, 400, 'italic'],
      [dmSansMedium, 500, 'normal'], [dmSansMediumItalic, 500, 'italic'],
      [dmSansSemiBold, 600, 'normal'], [dmSansSemiBoldItalic, 600, 'italic'],
      [dmSansBold, 700, 'normal'], [dmSansBoldItalic, 700, 'italic'],
    ].map(([url, weight, style]) => `@font-face{font-family:'Mainline DM Sans';src:url('${url}') format('truetype');font-style:${style};font-weight:${weight};font-display:swap}`),
  ].join('\n')
  document.head.append(fontStyle)
})
onBeforeUnmount(() => fontStyle?.remove())
</script>

<template>
  <div class="docs-home">
    <div class="docs-home__top"><slot name="top" /></div>
    <slot name="middle" />
    <div class="docs-home__bottom"><slot name="bottom" /></div>
    <slot name="footer" />
  </div>
</template>
