<script setup lang="ts">
import heroImage from './assets/hero.webp'

defineProps<{
  title: string
  lead: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  points: Array<{ title: string; copy: string }>
}>()
</script>

<template>
  <section class="py-28 lg:py-32 lg:pt-44">
    <div class="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
      <div class="flex-1">
        <h1 class="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
          {{ title }}
        </h1>
        <p class="text-muted-foreground mt-5 text-xl md:text-3xl">{{ lead }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
          <a class="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium !text-primary-foreground !no-underline transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" :href="primaryHref">{{ primaryLabel }}</a>
          <a class="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium !text-foreground !no-underline shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" style="color: var(--vp-c-text-1)" :href="secondaryHref">
            {{ secondaryLabel }}
            <svg class="size-4 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </a>
        </div>
      </div>

      <div class="relative flex flex-1 flex-col justify-center space-y-5 pt-10 lg:pt-0 lg:pl-10">
        <div class="absolute top-0 left-0 hidden h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:block" aria-hidden="true"></div>
        <div class="absolute top-0 left-0 block h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:hidden" aria-hidden="true"></div>
        <div v-for="point in points" :key="point.title" class="flex gap-3 lg:gap-5">
          <svg class="text-foreground mt-1 size-4 shrink-0 lg:size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          <div>
            <h2 class="text-foreground font-semibold">{{ point.title }}</h2>
            <p class="text-muted-foreground max-w-xs text-sm leading-relaxed">{{ point.copy }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
      <div class="relative h-[793px] w-full overflow-hidden rounded-2xl shadow-lg max-lg:rounded-tr-none">
        <img :src="heroImage" alt="Mainline template placeholder: project board interface" class="h-full w-full object-cover object-left-top" />
      </div>
    </div>
  </section>
</template>
