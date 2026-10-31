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

  <section v-if="quickLinks && quickLinks.length" class="faq-section faq-links">
    <div class="faq-section-heading">
      <p class="faq-eyebrow">Explore the documentation</p>
      <h2>{{ quickLinksTitle }}</h2>
    </div>
    <div class="faq-link-grid">
    <a
      v-for="link in quickLinks"
      :key="link.url"
      :href="link.url"
      class="faq-link-card"
    >
      <div>
        <strong>{{ link.label }}</strong>
        <p>{{ link.description }}</p>
      </div>
      <svg class="faq-link-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </a>
    </div>
  </section>

  <section class="faq-section faq-answers">
    <div class="faq-section-heading">
      <p class="faq-eyebrow">Need a hand?</p>
      <h2>{{ faqTitle }}</h2>
    </div>
    <div class="faq-accordion">
    <details
      v-for="(item, index) in questions"
      :key="index"
      class="faq-item"
    >
      <summary>
        <span>{{ item.question }}</span>
        <svg class="faq-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div class="faq-answer">
        {{ item.answer }}
      </div>
    </details>
    </div>
  </section>
</div>

<style>
.faq-page {
  box-sizing: border-box;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem) clamp(6rem, 12vw, 10rem);
}

.faq-header {
  max-width: 46rem;
  margin: 0 auto;
  text-align: center;
}

.faq-header h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.faq-header p {
  max-width: 38rem;
  margin: 1.5rem auto 0;
  color: var(--vp-c-text-2);
  font-size: 1.125rem;
  line-height: 1.75;
}

.faq-section {
  max-width: 60rem;
  margin: clamp(5rem, 10vw, 8rem) auto 0;
}

.faq-section-heading {
  margin-bottom: 1.75rem;
  text-align: center;
}

.faq-section-heading h2 {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-1);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.faq-eyebrow {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.25;
  text-transform: uppercase;
}

.faq-link-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.faq-link-card {
  display: flex;
  min-height: 7.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.faq-link-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.faq-link-card strong {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 650;
}

.faq-link-card p {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.55;
}

.faq-link-icon,
.faq-chevron {
  width: 1.125rem;
  height: 1.125rem;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.faq-link-icon {
  color: var(--vp-c-text-3);
}

.faq-accordion {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: var(--vp-c-bg-soft);
}

.faq-item {
  margin: 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.faq-item:last-child {
  border-bottom: 0;
}

.faq-item summary {
  display: flex;
  min-height: 4.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
  list-style: none;
  transition: background-color 160ms ease;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary:hover {
  background: var(--vp-c-bg-mute);
}

.faq-chevron {
  color: var(--vp-c-text-3);
  transition: transform 160ms ease;
}

.faq-item[open] .faq-chevron {
  transform: rotate(180deg);
}

.faq-answer {
  max-width: 48rem;
  padding: 0 1.5rem 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.75;
}

@media (max-width: 640px) {
  .faq-page {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .faq-link-grid {
    grid-template-columns: 1fr;
  }

  .faq-link-card,
  .faq-item summary,
  .faq-answer {
    padding-right: 1.125rem;
    padding-left: 1.125rem;
  }
}
</style>
