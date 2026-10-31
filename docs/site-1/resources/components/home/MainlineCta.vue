<script setup lang="ts">
import footerImage from '@docs/src/guides/feluqa.rs/.art/feluqa-footer-white-transteinted.png'

defineProps<{
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: Array<{ name: string; href: string; external?: boolean }>
  subNavigation: Array<{ name: string; href: string; external?: boolean }>
  logoImg?: string
  logoAlt: string
}>()
</script>

<template>
  <footer class="flex w-full flex-col items-center gap-14 pt-8 text-center lg:pt-10">
    <div class="container space-y-3 text-center">
      <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
      <p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">{{ description }}</p>
      <div><a :href="actionHref" class="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium !text-primary-foreground !no-underline">{{ actionLabel }}</a></div>
    </div>
    <nav class="container flex flex-col items-center gap-3">
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
    <div class="text-primary mt-10 w-full md:mt-14 lg:mt-20"><img :src="logoImg || footerImage" :alt="logoAlt" class="mx-auto block w-full max-w-3xl" /></div>
  </footer>
</template>

<style scoped>
.footer-link,
.footer-sub-link { transition: color 180ms ease, opacity 180ms ease; }
.footer-link { color: var(--vp-c-text-1); font-size: 0.9rem; font-weight: 600; }
.footer-sub-link { color: var(--vp-c-text-2); font-size: 0.8rem; }
.footer-link:hover,
.footer-sub-link:hover { color: var(--vp-c-brand-1); }
</style>
