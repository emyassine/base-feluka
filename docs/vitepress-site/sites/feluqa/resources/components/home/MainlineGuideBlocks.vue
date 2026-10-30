<script setup lang="ts">
import { computed } from 'vue'
import triageImage from './assets/features/triage-card.svg'
import cycleImage from './assets/features/cycle-card.svg'
import overviewImage from './assets/features/overview-card.svg'

const props = defineProps<{
  eyebrow?: string
  title: string
  description: string
  items: Array<{
    title: string
    description: string
    image: string
    links: Array<{ label: string; href: string }>
  }>
}>()
const images: Record<string, string> = {
  'triage-card': triageImage,
  'cycle-card': cycleImage,
  'overview-card': overviewImage,
}
const items = computed(() => props.items.map((item) => ({ ...item, src: images[item.image] })))
</script>

<template>
  <section id="feature-modern-teams" class="pb-28 lg:pb-32">
    <div class="container">
      <div class="relative flex items-center justify-center">
        <div class="text-muted-foreground relative h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]" aria-hidden="true"></div>
        <span v-if="eyebrow" class="bg-muted text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide max-md:hidden">{{ eyebrow }}</span>
      </div>

      <div class="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-0 lg:mt-24 lg:grid-cols-2">
        <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
        <p class="text-muted-foreground leading-snug">{{ description }}</p>
      </div>

      <div class="bg-card text-card-foreground mt-8 overflow-hidden rounded-3xl border shadow-sm md:mt-12 lg:mt-20">
        <div class="flex max-md:flex-col">
          <article v-for="(item, index) in items" :key="item.title" class="flex flex-1 max-md:flex-col">
            <div class="flex-1 p-4 pe-0! md:p-6">
              <div class="relative aspect-[1.28/1] overflow-hidden">
                <img :src="item.src" :alt="`${item.title} interface`" class="absolute inset-0 size-full object-cover object-left-top ps-4 pt-2" />
                <div class="from-background absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent"></div>
              </div>
              <div class="flex flex-col gap-3 pe-4 pt-4 md:pe-6 md:pt-6">
                <div>
                  <h3 class="font-display !text-2xl !leading-tight !font-bold !tracking-tight">{{ item.title }}</h3>
                  <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ item.description }}</p>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-2">
                  <a v-for="link in item.links" :key="link.href" :href="link.href" class="inline-flex items-center gap-1 text-sm font-medium !text-foreground !no-underline hover:text-primary">
                    {{ link.label }}
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                  </a>
                </div>
              </div>
            </div>
            <div v-if="index < items.length - 1" class="relative hidden md:block">
              <div class="absolute inset-y-0 left-0 w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground"></div>
            </div>
            <div v-if="index < items.length - 1" class="relative block md:hidden">
              <div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground"></div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
