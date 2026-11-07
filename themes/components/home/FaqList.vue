<script setup lang="ts">
defineProps<{
  title: string
  lead: string
  items: Array<{ question: string; answer: string }>
}>()
</script>

<template>
  <section class="py-28 lg:py-32">
    <div class="container max-w-5xl">
      <div class="mx-auto grid gap-16 lg:grid-cols-2">
        <div class="space-y-4">
          <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
          <p class="text-muted-foreground max-w-md leading-snug lg:mx-auto">{{ lead }}</p>
        </div>
        <div class="grid gap-6 text-start">
          <details v-for="item in items" :key="item.question" class="group w-full border-b border-border">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden">
              {{ item.question }}
              <span class="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="text-muted-foreground pb-4 leading-relaxed">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>
