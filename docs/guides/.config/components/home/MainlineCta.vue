<script setup lang="ts">
import footerImage from '../../feluqa.rs/.art/feluqa-footer-white-transteinted.png'

defineProps<{
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: Array<{ name: string; href: string; external?: boolean }>
  legalLabel: string
  legalHref: string
  logoAlt: string
}>()
</script>

<template>
  <footer class="flex flex-col items-center gap-14 pt-28 lg:pt-32">
    <div class="container space-y-3 text-center">
      <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
      <p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">{{ description }}</p>
      <div><a :href="actionHref" class="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium !text-primary-foreground !no-underline">{{ actionLabel }}</a></div>
    </div>
    <nav class="container flex flex-col items-center gap-4">
      <ul class="flex list-none flex-wrap items-center justify-center gap-6 p-0">
        <li v-for="item in navigation" :key="item.name">
          <a :href="item.href" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined" class="flex items-center gap-0.5 font-medium !text-foreground !no-underline transition-opacity hover:opacity-75">
            {{ item.name }}
            <svg v-if="item.external" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
        </li>
      </ul>
      <ul class="flex list-none items-center justify-center p-0"><li><a :href="legalHref" class="text-muted-foreground text-sm !no-underline transition-opacity hover:opacity-75">{{ legalLabel }}</a></li></ul>
    </nav>
    <div class="text-primary mt-10 w-full md:mt-14 lg:mt-20"><img :src="footerImage" :alt="logoAlt" class="w-full" /></div>
  </footer>
</template>
