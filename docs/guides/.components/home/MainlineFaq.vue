<script setup lang="ts">
defineProps<{ content: {
  title: string
  copy: string
  items: Array<{ question: string; answer: string }>
} }>()
</script>

<template>
  <section class="py-28 lg:py-32">
    <div class="container max-w-5xl">
      <div class="mx-auto grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-4">
          <h2 class="text-2xl tracking-tight md:text-4xl lg:text-5xl">{{ content.title }}</h2>
          <p class="text-muted-foreground max-w-md leading-snug">{{ content.copy }}</p>
        </div>
        <div class="grid gap-4 text-start">
          <details v-for="item in content.items" :key="item.question" class="group border-b border-border py-4">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:hidden">
              {{ item.question }}
              <span class="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="text-muted-foreground mb-0 mt-4 leading-relaxed">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>
