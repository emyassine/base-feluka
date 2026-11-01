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
  <header class="faq-header" style="margin-top:4rem;margin-bottom:5rem;">
    <h1>Frequently Asked Questions</h1>
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

.faq-answers details {
  overflow: hidden;
}

.faq-answers details > summary {
  position: relative;
  display: block;
  padding: 1rem 1rem 1rem 2.2rem;
  cursor: pointer;
  user-select: none;
}

.custom-block.details summary {
    margin: 0;
    padding-top:0;
    padding-bottom:0;
    padding-left:2;
}
.faq-answers details > summary::before {
  position: absolute;
  top: 1.3rem;
  left: 1rem;
  border-width: 0.4rem;
  border-style: solid;
  border-color: transparent transparent transparent var(--vp-c-text-2);
  content: '';
  transform: rotate(0);
  transform-origin: 0.2rem 50%;
  transition: transform 0.25s ease;
}

.faq-answers details[open] > summary::before {
  transform: rotate(90deg);
}

.faq-answers details > summary::-webkit-details-marker {
  display: none;
}


@media (max-width: 640px) {
  .faq-page {
    padding: 3rem 1rem;
  }
}
</style>
