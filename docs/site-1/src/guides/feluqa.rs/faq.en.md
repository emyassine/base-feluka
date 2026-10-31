---
sidebarTitle: "FAQ"
icon: "@spmpst::icon::circle-help"
title: "Feluqa FAQ"
description: "Frequently asked questions and links to the Feluqa documentation guides."
layout: home
---

<script setup lang="ts">
import { computed } from 'vue'
import { useSpmpstConfig } from '@spmpst/config'

type QuickLink = { label: string; description: string; url: string }
type FaqItem = { question: string; answer: string }

const title = useSpmpstConfig<string>('seo.pageTitle')
const description = useSpmpstConfig<string>('seo.description')
const quickLinksTitle = useSpmpstConfig<string>('seo.quickLinksTitle')
const faqTitle = useSpmpstConfig<string>('seo.faqTitle')
const quickLinks = useSpmpstConfig<QuickLink[]>('seo.quickLinks')
const faqItems = useSpmpstConfig<FaqItem[]>('seo.faq')

const lead = computed(() => `${description.value}`)
const questions = computed(() => faqItems.value)
</script>

<template>
  <MainlineHomeLayout>
    <section class="container pt-24 text-center lg:pt-32">
      <h1 class="!text-4xl !tracking-tight md:!text-6xl">{{ title }}</h1>
      <p class="text-muted-foreground mx-auto mt-5 max-w-2xl text-xl leading-relaxed">{{ lead }}</p>
    </section>
    <section v-if="quickLinks.length" class="container py-16">
      <h2 class="!text-2xl !tracking-tight md:!text-4xl">{{ quickLinksTitle }}</h2>
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <a v-for="link in quickLinks" :key="link.url" :href="link.url" class="rounded-xl border border-border p-5 !no-underline transition-colors hover:border-primary">
          <strong class="text-foreground">{{ link.label }}</strong>
          <p class="text-muted-foreground mt-2 text-sm">{{ link.description }}</p>
        </a>
      </div>
    </section>
    <MainlineFaq :title="faqTitle" :lead="lead" :items="questions" />
  </MainlineHomeLayout>
</template>
