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

  <section
    v-if="quickLinks && quickLinks.length"
    class="faq-section faq-links"
  >
    <div class="faq-section-heading">
      <h2>{{ quickLinksTitle }}</h2>
    </div>

    <div class="faq-link-grid">
      <SpotlightCard
        v-for="link in quickLinks"
        :key="link.url"
      >
        <a :href="link.url">
          <strong>{{ link.label }}</strong>
          <p>{{ link.description }}</p>
        </a>
      </SpotlightCard>
    </div>
  </section>

  <section class="faq-section faq-answers">
    <h2>{{ faqTitle }}</h2>

    <details
      v-for="item in questions"
      :key="item.question"
      class="custom-block details"
    >
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </section>

<style>
	.faq-page {
	  box-sizing: border-box;
	  width: 100%;
	  max-width: 760px;
	  min-height: 100%;
	  margin-inline: auto;
	  padding: clamp(3rem, 8vh, 6rem) 1.5rem 6rem;
	}

	.faq-header {
	  margin-bottom: 3rem;
	  text-align: center;
	}

	.faq-header h1 {
	  margin: 0 0 1rem;
	}

	.faq-header p {
	  max-width: 580px;
	  margin-inline: auto;
	  line-height: 1.7;
	}

	.faq-section {
	  width: 100%;
	  margin-bottom: 3rem;
	}

	.faq-section-heading {
	  margin-bottom: 1.25rem;
	}

	.faq-link-grid {
	  display: grid;
	  grid-template-columns: repeat(2, minmax(0, 1fr));
	  gap: 1rem;
	}

	.faq-link-grid a {
	  display: block;
	  height: 100%;
	  text-decoration: none;
	}

	.faq-link-grid p {
	  margin-bottom: 0;
	}

	.faq-answers h2 {
	  margin-bottom: 1.5rem;
	}

	.faq-answers details {
	  margin-bottom: 0.75rem;
	}

	@media (max-width: 640px) {
	  .faq-page {
	    padding: 3rem 1rem 4rem;
	  }

	  .faq-link-grid {
	    grid-template-columns: 1fr;
	  }

	  .faq-header {
	    margin-bottom: 2.5rem;
	  }
	}
</style>
</div>
