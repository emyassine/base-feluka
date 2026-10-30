<script setup lang="ts">
import { computed, ref } from 'vue'
import amy from './assets/testimonials/amy-chase.webp'
import jonas from './assets/testimonials/jonas-kotara.webp'
import kevin from './assets/testimonials/kevin-yam.webp'
import kundo from './assets/testimonials/kundo-marta.webp'

const props = defineProps<{
  title: string
  description: string
  actionLabel: string
  items: Array<{ quote: string; author: string; role: string; company: string; image: string }>
}>()
const rail = ref<HTMLElement | null>(null)
const images: Record<string, string> = { 'amy-chase': amy, 'jonas-kotara': jonas, 'kevin-yam': kevin, 'kundo-marta': kundo }
const testimonials = computed(() => props.items.map((item) => ({ ...item, src: images[item.image] })))
function scroll(direction: number) {
  rail.value?.scrollBy({ left: direction * (rail.value.clientWidth * 0.7), behavior: 'smooth' })
}
</script>

<template>
    <section class="overflow-hidden py-28 lg:py-32">
      <div class="container">
        <div class="space-y-4">
          <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
          <p class="text-muted-foreground max-w-md leading-snug">{{ description }}</p>
          <a href="#" class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-md !text-foreground !no-underline">
            {{ actionLabel }}
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
        </div>
        <div class="relative mt-8 md:mt-12 lg:mt-20">
          <div ref="rail" class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <article v-for="(item, index) in testimonials" :key="`${item.author}-${index}`" class="bg-muted flex h-full min-w-0 shrink-0 grow-0 basis-4/5 snap-start flex-col overflow-hidden rounded-xl border-none sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]">
              <div class="relative h-[288px] shrink-0 lg:h-[328px]"><img :src="item.src" :alt="item.author" class="absolute inset-0 size-full object-cover object-top" /></div>
              <div class="flex flex-1 flex-col justify-between gap-10 p-6">
                <blockquote class="!text-lg !leading-none !font-medium md:!text-xl lg:!text-2xl">{{ item.quote }}</blockquote>
                <div class="space-y-0.5">
                  <div class="text-primary font-semibold">{{ item.author }}, {{ item.role }}</div>
                  <div class="text-muted-foreground text-sm">{{ item.company }}</div>
                </div>
              </div>
            </article>
          </div>
          <div class="mt-8 flex gap-3">
            <button class="bg-muted hover:bg-muted/80 static size-14 rounded-full transition-colors" aria-label="Previous testimonials" @click="scroll(-1)"><svg class="mx-auto size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button>
            <button class="bg-muted hover:bg-muted/80 static size-14 rounded-full transition-colors" aria-label="Next testimonials" @click="scroll(1)"><svg class="mx-auto size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div>
      </div>
    </section>
    <div class="mx-auto h-px max-w-[80%] border-t border-dashed border-border"></div>
</template>
