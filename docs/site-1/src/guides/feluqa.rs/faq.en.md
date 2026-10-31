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

<div class="faq-page">
  <header class="faq-header">
    <h1>{{ title }}</h1>
    <p>{{ lead }}</p>
  </header>



  <section class="faq-section faq-answers">
    <details
      v-for="item in questions"
      :key="item.question"
      class="custom-block details"
    >
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </section>
</div>



<style>
.faq-page {
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
  padding: clamp(3rem, 8vw, 6rem) 1.5rem;
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-header p {
  margin-inline: auto;
}

.faq-section {
  width: 100%;
  margin-bottom: 3rem;
}

.faq-section-heading {
  margin-bottom: 1.5rem;
}


@media (max-width: 640px) {
  .faq-page {
    padding: 3rem 1rem;
  }
}
</style>
