<script setup lang="ts">
defineProps<{ content: {
  title: string
  copy: string
  action: { label: string; href: string }
} }>()
</script>

<template>
  <section class="flex flex-col items-center gap-14 border-t border-border py-28 lg:py-32">
    <div class="container space-y-3 text-center">
      <h2 class="text-2xl tracking-tight md:text-4xl lg:text-5xl">{{ content.title }}</h2>
      <p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">{{ content.copy }}</p>
      <div>
        <a class="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium !text-primary-foreground !no-underline transition-opacity hover:opacity-85" :href="content.action.href">
          {{ content.action.label }}
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
      </div>
    </div>
  </section>
</template>
