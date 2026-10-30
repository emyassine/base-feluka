<script setup lang="ts">
defineProps<{
  title: string
  lead: string
  contactLabel: string
  contactHref: string
  closingPunctuation: string
  categories: Array<{ title: string; questions: Array<{ question: string; answer: string }> }>
}>()
</script>

<template>
  <section class="py-28 lg:py-32">
    <div class="container max-w-5xl">
      <div class="mx-auto grid gap-16 lg:grid-cols-2">
        <div class="space-y-4">
          <h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">{{ title }}</h2>
          <p class="text-muted-foreground max-w-md leading-snug lg:mx-auto">{{ lead }} <a :href="contactHref" class="underline underline-offset-4">{{ contactLabel }}</a>{{ closingPunctuation }}</p>
        </div>
        <div class="grid gap-6 text-start">
          <section v-for="category in categories" :key="category.title">
            <h3 class="text-muted-foreground !text-base !leading-6 !font-normal border-b py-4">{{ category.title }}</h3>
            <details v-for="item in category.questions" :key="item.question" class="group w-full border-b border-border">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden">
                {{ item.question }}
                <span class="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p class="text-muted-foreground pb-4 leading-relaxed">{{ item.answer }}</p>
            </details>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
