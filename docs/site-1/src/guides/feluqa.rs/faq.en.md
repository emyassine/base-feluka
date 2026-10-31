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

<section style="padding: 2rem 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
  <h1 style="font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em; color: var(--vp-c-text-1); line-height: 1.2; margin: 0;">
    {{ title }}
  </h1>
  <p style="margin: 0.875rem 0 0 0; max-width: 38rem; font-size: 1rem; line-height: 1.6; color: var(--vp-c-text-2); text-align: center;">
    {{ lead }}
  </p>
</section>

<section v-if="quickLinks && quickLinks.length" style="padding: 1.5rem 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
  <h2 style="font-size: 1.25rem; font-weight: 600; letter-spacing: -0.025em; color: var(--vp-c-text-1); margin: 0 0 1rem 0;">
    {{ quickLinksTitle }}
  </h2>
  <div style="display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); width: 100%;">
    <a
      v-for="link in quickLinks"
      :key="link.url"
      :href="link.url"
      style="border-radius: 0.5rem; border: 1px solid var(--vp-c-divider); padding: 1rem; text-decoration: none; background-color: var(--vp-c-bg-soft); transition: border-color 0.2s ease; display: flex; align-items: center; justify-content: space-between; text-align: left;"
    >
      <div>
        <strong style="color: var(--vp-c-text-1); font-size: 0.9rem; display: block; margin-bottom: 0.15rem;">
          {{ link.label }}
        </strong>
        <p style="color: var(--vp-c-text-2); font-size: 0.8rem; line-height: 1.4; margin: 0;">
          {{ link.description }}
        </p>
      </div>
      <img src="@spmpst::icon::arrow-right" style="width: 16px; height: 16px; opacity: 0.6; flex-shrink: 0; margin-left: 0.75rem;" alt="" />
    </a>
  </div>
</section>

<section style="padding: 1.5rem 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
  <h2 style="font-size: 1.25rem; font-weight: 600; letter-spacing: -0.025em; color: var(--vp-c-text-1); margin: 0 0 1rem 0;">
    {{ faqTitle }}
  </h2>
  <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
    <details
      v-for="(item, index) in questions"
      :key="index"
      style="border: 1px solid var(--vp-c-divider); border-radius: 0.5rem; background-color: var(--vp-c-bg-soft); overflow: hidden; text-align: left;"
    >
      <summary style="padding: 0.875rem 1rem; font-weight: 500; font-size: 0.95rem; color: var(--vp-c-text-1); cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
        <span>{{ item.question }}</span>
        <img src="@spmpst::icon::chevron-down" style="width: 16px; height: 16px; opacity: 0.6; flex-shrink: 0; margin-left: 0.5rem;" alt="" />
      </summary>
      <div style="padding: 0 1rem 1rem 1rem; color: var(--vp-c-text-2); font-size: 0.875rem; line-height: 1.5;">
        {{ item.answer }}
      </div>
    </details>
  </div>
</section>
