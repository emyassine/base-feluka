<script setup lang="ts">
defineProps<{ content: {
  title: string
  items: Array<{ title: string; description: string; href: string; linkLabel: string }>
} }>()
</script>

<template>
  <section class="overflow-hidden pb-28 lg:pb-32">
    <div>
      <h2 class="container text-balance text-center text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {{ content.title }}
      </h2>

      <div class="mt-8 md:mt-12 lg:mt-20">
        <div class="text-muted-foreground container relative h-px w-full" aria-hidden="true">
          <div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"></div>
        </div>

        <div class="relative container flex max-md:flex-col">
          <article v-for="(item, index) in content.items.slice(0, 2)" :key="item.title" class="relative flex flex-1 flex-col justify-between px-0 py-6 md:px-6 md:py-8">
            <div class="text-balance">
              <h3 class="inline font-semibold">{{ item.title }}&nbsp;</h3>
              <span class="text-muted-foreground">{{ item.description }}</span>
            </div>
            <a class="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline" :href="item.href">
              {{ item.linkLabel }}
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
            <div v-if="index === 0" class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block" aria-hidden="true"></div>
            <div v-if="index === 0" class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden" aria-hidden="true"></div>
          </article>
        </div>

        <div class="text-muted-foreground container relative h-px w-full" aria-hidden="true">
          <div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"></div>
        </div>

        <div class="relative container grid max-w-7xl md:grid-cols-3">
          <article v-for="(item, index) in content.items.slice(2, 5)" :key="item.title" class="relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8">
            <div class="text-balance">
              <h3 class="inline font-semibold">{{ item.title }}&nbsp;</h3>
              <span class="text-muted-foreground">{{ item.description }}</span>
            </div>
            <a class="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline" :href="item.href">
              {{ item.linkLabel }}
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
            <div v-if="index < 2" class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block" aria-hidden="true"></div>
            <div v-if="index < 2" class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden" aria-hidden="true"></div>
          </article>
        </div>

        <div class="text-muted-foreground container relative h-px w-full" aria-hidden="true">
          <div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"></div>
        </div>
      </div>
    </div>
  </section>
</template>
