<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
const footerImage = '/media/images/feluqa-footer-white-transteinted.png'

const props = defineProps<{
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: Array<{ name: string; href: string; external?: boolean }>
  subNavigation: Array<{ name: string; href: string; external?: boolean }>
  logoImg?: string
  logoImgDark?: string
  logoAlt: string
  logoStyles?: { dark?: string; light?: string }
}>()

const { isDark } = useData()
const logoStyle = computed(() => isDark.value ? props.logoStyles?.dark ?? '' : props.logoStyles?.light ?? '')
const logoSource = computed(() => (isDark.value ? props.logoImgDark : undefined) || props.logoImg || footerImage)
</script>

<template>
  <footer class="footer-cta flex w-full flex-col items-center gap-8 pt-6 text-center md:gap-14 md:pt-8 lg:pt-10">
    <div class="container footer-cta__content space-y-3 text-center">
      <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
      <p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">{{ description }}</p>
      <div class="mt-4"><FeluqaButton tag="a" :href="actionHref" size="lg">{{ actionLabel }}</FeluqaButton></div>
    </div>
    <nav class="container footer-cta__content flex flex-col items-center gap-3">
      <ul v-if="navigation.length" class="footer-navigation flex list-none flex-wrap items-center justify-center gap-x-7 gap-y-2 p-0">
        <li v-for="item in navigation" :key="`${item.href}-${item.name}`">
          <a :href="item.href" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined" class="footer-link flex items-center gap-1 !no-underline">
            {{ item.name }}
            <svg v-if="item.external" class="size-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
        </li>
      </ul>
      <ul v-if="subNavigation.length" class="footer-sub-navigation flex list-none flex-wrap items-center justify-center gap-x-5 gap-y-2 p-0">
        <li v-for="item in subNavigation" :key="`${item.href}-${item.name}`">
          <a :href="item.href" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined" class="footer-sub-link !no-underline">{{ item.name }}</a>
        </li>
      </ul>
    </nav>
    <div class="footer-brand text-primary mt-4 md:mt-14 lg:mt-20"><img :src="logoSource" :alt="logoAlt" :style="logoStyle" class="footer-brand-image" /></div>
  </footer>
</template>

<style scoped>
.footer-cta,
.footer-cta__content { box-sizing: border-box; min-width: 0; max-width: 100%; }
.footer-cta__content { width: 100%; padding-inline: 16px; }
.footer-brand { box-sizing: border-box; width: 100%; min-width: 0; max-width: 100%; overflow: clip; }
.footer-brand-image { display: block; width: 100%; max-width: 100%; max-height: clamp(4rem, 12vw, 12rem); height: auto; margin-inline: auto; object-fit: contain; }
.footer-link,
.footer-sub-link { transition: color 180ms ease, opacity 180ms ease; }
.footer-link { color: var(--vp-c-text-1); font-size: 0.9rem; font-weight: 600; }
.footer-sub-link { color: var(--vp-c-text-2); font-size: 0.8rem; }
.footer-link:hover,
.footer-sub-link:hover { color: var(--vp-c-brand-1); }
</style>
