<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  description: string
  actionLabel: string
  plans: Array<{ name: string; monthlyPrice: string; yearlyPrice: string; description?: string; features: string[] }>
}>()
const isAnnual = ref(true)
</script>

<template>
  <section class="py-28 lg:py-32">
    <div class="container max-w-5xl">
      <div class="space-y-4 text-center">
        <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
        <p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">{{ description }}</p>
      </div>
      <div class="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
        <article v-for="plan in plans" :key="plan.name" class="bg-card text-card-foreground rounded-xl border shadow-sm" :class="plan.name === 'Startup' ? 'outline-primary origin-top outline-4' : ''">
          <div class="flex flex-col gap-7 px-6 py-5">
            <div class="space-y-2">
              <h3 class="text-foreground !text-base !leading-6 !font-semibold">{{ plan.name }}</h3>
              <div class="text-muted-foreground text-lg font-medium">{{ isAnnual ? plan.yearlyPrice : plan.monthlyPrice }} <span v-if="plan.name !== 'Free'" class="text-muted-foreground">per user/{{ isAnnual ? 'year' : 'month' }}</span></div>
            </div>
            <label v-if="plan.name !== 'Free'" class="flex cursor-pointer items-center gap-2">
              <input v-model="isAnnual" type="checkbox" class="size-4 accent-primary" aria-label="Toggle annual billing" />
              <span class="text-sm font-medium">Billed annually</span>
            </label>
            <span v-else class="text-muted-foreground text-sm">{{ plan.description }}</span>
            <div class="space-y-3">
              <div v-for="feature in plan.features" :key="feature" class="text-muted-foreground flex items-center gap-1.5">
                <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                <span class="text-sm">{{ feature }}</span>
              </div>
            </div>
            <a href="#" class="inline-flex h-9 w-fit items-center justify-center rounded-md border px-4 py-2 text-sm font-medium !text-foreground !no-underline" :class="plan.name === 'Startup' ? 'bg-primary !text-primary-foreground' : 'bg-background'">{{ actionLabel }}</a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
