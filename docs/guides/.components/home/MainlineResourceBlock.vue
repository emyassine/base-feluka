<script setup lang="ts">
import templateImage from './assets/resource-allocation/templates.webp'
import graveyardImage from './assets/resource-allocation/graveyard.webp'
import discussionsImage from './assets/resource-allocation/discussions.webp'
import notificationsImage from './assets/resource-allocation/notifications.webp'
import jira from './assets/logos/jira.svg'
import excel from './assets/logos/excel.svg'
import notion from './assets/logos/notion.svg'
import word from './assets/logos/word.svg'
import monday from './assets/logos/monday.svg'
import drive from './assets/logos/drive.svg'
import asana from './assets/logos/asana.svg'

defineProps<{
  title: string
  items: Array<{ title: string; description: string; imageAlt?: string }>
}>()

const stackLogos = [jira, excel, notion, word, monday, drive, jira, asana]
const featureImages = [graveyardImage, discussionsImage, notificationsImage]
</script>

<template>
  <section id="resource-allocation" class="overflow-hidden pb-28 lg:pb-32">
    <div>
      <h2 class="container text-center !text-3xl !tracking-tight text-balance sm:!text-4xl md:!text-5xl lg:!text-6xl">{{ title }}</h2>
      <div class="mt-8 md:mt-12 lg:mt-20">
        <div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div>
        <div class="relative container flex max-md:flex-col">
          <article v-for="(item, index) in items.slice(0, 2)" :key="item.title" class="relative flex flex-1 flex-col justify-between px-0 py-6 md:px-6 md:py-8">
            <div class="mb-5 text-balance md:mb-8">
              <h3 class="inline !text-base !leading-6 !font-semibold">{{ item.title }}&nbsp;</h3><span class="text-muted-foreground">{{ item.description }}</span>
            </div>
            <div v-if="index === 0" class="grid grid-cols-1 gap-4">
              <img :src="templateImage" :alt="item.imageAlt" width="495" height="186" class="object-contain object-left-top" />
            </div>
            <div v-else class="relative overflow-hidden">
              <div class="flex flex-col gap-5">
                <div class="flex translate-x-4 justify-end gap-5">
                  <div v-for="logo in stackLogos.slice(0, 4)" :key="logo" class="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"><img :src="logo" alt="" class="size-12 object-contain" /></div>
                </div>
                <div class="flex -translate-x-4 gap-5">
                  <div v-for="(logo, logoIndex) in stackLogos.slice(4)" :key="logoIndex" class="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"><img :src="logo" alt="" class="size-12 object-contain" /></div>
                </div>
              </div>
              <div class="from-muted/80 absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent"></div>
              <div class="from-muted absolute inset-y-0 bottom-0 left-0 z-10 w-14 bg-gradient-to-r to-transparent"></div>
            </div>
            <div v-if="index === 0" class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block"></div>
            <div v-if="index === 0" class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden"></div>
          </article>
        </div>
        <div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div>
        <div class="relative container grid max-w-7xl md:grid-cols-3">
          <article v-for="(item, index) in items.slice(2, 5)" :key="item.title" class="relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8 md:pb-0">
            <div class="mb-5 text-balance md:mb-8"><h3 class="inline !text-base !leading-6 !font-semibold">{{ item.title }}&nbsp;</h3><span class="text-muted-foreground">{{ item.description }}</span></div>
            <div v-if="index !== 1" class="relative grid grid-cols-1 gap-4">
              <img :src="featureImages[index]" :alt="item.imageAlt" width="305" height="280" class="object-contain object-left-top" />
            </div>
            <div v-else class="image-container grid flex-1 place-items-center gap-4 md:-translate-y-3">
              <img :src="featureImages[index]" :alt="item.imageAlt" width="320" height="103" class="object-contain object-left-top" />
            </div>
            <div v-if="index < 2" class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block"></div>
            <div v-if="index < 2" class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden"></div>
          </article>
        </div>
        <div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div>
      </div>
    </div>
  </section>
</template>
