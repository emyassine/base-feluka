<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import siteContent from '../../generated-site-content.json'

const { lang } = useData()
const discovery = computed(() => {
  const locales = (siteContent as any).seo?.locales ?? {}
  const language = lang.value.toLowerCase().split('-')[0]
  return locales[language] ?? locales.root ?? null
})
</script>

<template>
  <section v-if="discovery" class="FeluqaDiscovery" aria-label="Documentation shortcuts and answers">
    <div class="FeluqaDiscovery__inner">
      <section v-if="discovery.quickLinks?.length" class="FeluqaDiscovery__links">
        <h2>{{ discovery.quickLinksTitle }}</h2>
        <nav :aria-label="discovery.quickLinksTitle">
          <a v-for="link in discovery.quickLinks" :key="link.url" :href="link.url" class="FeluqaDiscovery__link">
            <span class="FeluqaDiscovery__link-label">{{ link.label }}</span>
            <span class="FeluqaDiscovery__link-description">{{ link.description }}</span>
            <span class="FeluqaDiscovery__arrow" aria-hidden="true">›</span>
          </a>
        </nav>
      </section>

      <section v-if="discovery.faq?.length" class="FeluqaDiscovery__faq">
        <h2>{{ discovery.faqTitle }}</h2>
        <details v-for="item in discovery.faq" :key="item.question">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </section>
    </div>
  </section>
</template>
