<script setup lang="ts">
import heroImage from './assets/hero.webp'
import SideRays from './SideRays.vue'
import FeluqaButton from '../FeluqaButton.vue'

defineProps<{
  title: string
  lead: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  heroAlt: string
  points: Array<{ title: string; description: string }>
}>()
</script>

<template>
  <section class="relative isolate py-28 lg:py-32 lg:pt-44">
    <div class="docs-home__rays pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] overflow-hidden md:h-[500px] lg:h-[600px]" aria-hidden="true">
      <SideRays
        :speed="2.5"
        ray-color1="var(--vp-c-brand-1)"
        ray-color2="var(--vp-c-brand-2)"
        :intensity="2"
        :spread="2"
        origin="top-right"
        :tilt="0"
        :saturation="1.5"
        :blend="0.75"
        :falloff="1.6"
        :opacity="0.48"
      />
    </div>

    <div class="container relative z-10 flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
      <div class="box-border min-w-0 flex-1">
        <h1 class="docs-home__hero-title text-foreground max-w-160 text-balance !text-3xl !tracking-tight md:!text-4xl lg:!text-5xl">
          {{ title }}
        </h1>
        <p class="docs-home__hero-lead text-muted-foreground mt-5 text-xl md:text-3xl">{{ lead }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
          <FeluqaButton tag="a" :href="primaryHref" color="primary">{{ primaryLabel }}</FeluqaButton>
          <FeluqaButton tag="a" :href="secondaryHref" color="gray" outlined icon-position="after">
            {{ secondaryLabel }}
            <template #icon><svg class="size-4 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></template>
          </FeluqaButton>
        </div>
      </div>

      <div class="relative box-border flex min-w-0 flex-1 flex-col justify-center pt-10 lg:pt-0">
        <div class="absolute top-0 left-0 hidden h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:block" aria-hidden="true"></div>
        <div class="absolute top-0 left-0 block h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:hidden" aria-hidden="true"></div>
        <div class="space-y-5 lg:pl-10">
          <div v-for="point in points" :key="point.title" class="flex gap-3 lg:gap-5">
            <svg class="text-foreground mt-1 size-4 shrink-0 lg:size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            <div>
              <h2 class="text-foreground !text-base !font-semibold !leading-6">{{ point.title }}</h2>
              <p class="text-muted-foreground max-w-xs text-sm leading-relaxed">{{ point.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
      <div class="relative h-[793px] w-full overflow-hidden rounded-2xl shadow-lg max-lg:rounded-tr-none">
        <img :src="heroImage" :alt="heroAlt" class="h-full w-full object-cover object-left-top" />
      </div>
    </div>
  </section>
</template>
