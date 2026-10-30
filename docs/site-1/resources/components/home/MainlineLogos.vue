<script setup lang="ts">
import { computed } from 'vue'
import arc from './assets/logos/arc.svg'
import descript from './assets/logos/descript.svg'
import mercury from './assets/logos/mercury.svg'
import monzo from './assets/logos/monzo.svg'
import perplexity from './assets/logos/perplexity.svg'
import ramp from './assets/logos/ramp.svg'
import raycast from './assets/logos/raycast.svg'
import retool from './assets/logos/retool.svg'
import watershed from './assets/logos/watershed.svg'

const props = defineProps<{
  title: string
  subtitle: string
  companies: Array<{ name: string; logo: string; width: number; height: number; href: string }>
}>()
const logos: Record<string, string> = { arc, descript, mercury, monzo, perplexity, ramp, raycast, retool, watershed }
const topRow = computed(() => props.companies.slice(0, 4).map((company) => ({ ...company, src: logos[company.logo] })))
const bottomRow = computed(() => props.companies.slice(4).map((company) => ({ ...company, src: logos[company.logo] })))
</script>

<template>
  <section class="overflow-hidden pb-28 lg:pb-32">
    <div class="container space-y-10 lg:space-y-16">
      <div class="text-center">
        <h2 class="mb-4 !text-xl text-balance md:!text-2xl lg:!text-3xl">
          {{ title }}<br class="max-md:hidden" />
          <span class="text-muted-foreground">{{ subtitle }}</span>
        </h2>
      </div>
      <div class="flex w-full flex-col items-center gap-8">
        <div class="hidden w-full md:block">
          <div class="grid grid-cols-4 items-center justify-items-center gap-x-20 lg:gap-x-28">
            <a v-for="company in topRow" :key="company.name" :href="company.href" target="_blank" rel="noreferrer" class="transition-opacity hover:opacity-70">
              <img :src="company.src" :alt="`${company.name} logo`" :width="company.width" :height="company.height" class="object-contain opacity-50 transition-opacity hover:opacity-70 dark:invert" />
            </a>
          </div>
        </div>
        <div class="hidden w-full md:block">
          <div class="grid grid-cols-5 items-center justify-items-center gap-x-20 lg:gap-x-28">
            <a v-for="company in bottomRow" :key="company.name" :href="company.href" target="_blank" rel="noreferrer" class="transition-opacity hover:opacity-70">
              <img :src="company.src" :alt="`${company.name} logo`" :width="company.width" :height="company.height" class="object-contain opacity-50 transition-opacity hover:opacity-70 dark:invert" />
            </a>
          </div>
        </div>
        <div class="grid w-full grid-cols-3 justify-items-center gap-6 md:hidden">
          <a v-for="company in companies" :key="company.name" :href="company.href" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center">
            <img :src="logos[company.logo]" :alt="`${company.name} logo`" :width="company.width" :height="company.height" class="max-h-8 max-w-24 object-contain" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
