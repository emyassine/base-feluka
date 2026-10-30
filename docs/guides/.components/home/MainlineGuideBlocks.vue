<script setup lang="ts">
const sections = [
  {
    title: 'Start building',
    description: 'Set up the toolchain, learn the application structure, and follow the implementation guides.',
    links: [
      { label: 'Get started', href: '/get-started/' },
      { label: 'Learn by building', href: '/learn/' },
    ],
  },
  {
    title: 'Understand the platform',
    description: 'Read the product direction, runtime model, compilation approach, and workspace architecture.',
    links: [
      { label: 'Product guide', href: '/get-started/introduction/' },
      { label: 'Internals', href: '/feluqa-internals/' },
    ],
  },
  {
    title: 'Contribute',
    description: 'Find the contributor guidance and current implementation status before changing the framework.',
    links: [
      { label: 'Agent guidance', href: '/agents/' },
      { label: 'Contribution guide', href: '/prologue/contribution-guide' },
    ],
  },
]
</script>

<template>
  <section class="overflow-hidden pb-28 lg:pb-32">
    <div class="container">
      <div class="relative flex items-center justify-center">
        <div class="text-muted-foreground relative h-px w-full" aria-hidden="true">
          <div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"></div>
        </div>
      </div>

      <div class="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-0 lg:mt-24 lg:grid-cols-2">
        <h2 class="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Find your way through the guides
        </h2>
        <p class="text-muted-foreground leading-snug">
          Practical entry points for building with the framework, understanding its design, and contributing to its development.
        </p>
      </div>

      <div class="bg-card text-card-foreground mt-8 grid overflow-hidden rounded-3xl border shadow-sm md:mt-12 lg:mt-20 lg:grid-cols-3">
        <article v-for="(section, sectionIndex) in sections" :key="section.title" class="relative flex min-w-0 flex-col p-5 md:p-6">
          <div class="mb-5 md:mb-8">
            <h3 class="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">{{ section.title }}</h3>
            <p class="text-muted-foreground mt-3 text-sm leading-relaxed">{{ section.description }}</p>
          </div>
          <ul class="mt-auto list-none space-y-3 p-0">
            <li v-for="link in section.links" :key="link.href">
              <a class="group flex items-center justify-between gap-4 border-b border-border py-3 text-sm font-medium !text-foreground !no-underline transition-colors hover:!text-primary" style="color: var(--vp-c-text-1)" :href="link.href">
                <span>{{ link.label }}</span>
                <span class="rounded-full border p-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </span>
              </a>
            </li>
          </ul>
          <div v-if="sectionIndex < sections.length - 1" class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground lg:block" aria-hidden="true"></div>
          <div v-if="sectionIndex < sections.length - 1" class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground lg:hidden" aria-hidden="true"></div>
        </article>
      </div>
    </div>
  </section>
</template>
