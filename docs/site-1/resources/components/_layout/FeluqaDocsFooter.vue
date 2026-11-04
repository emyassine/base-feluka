<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useSpmpstConfig } from '@spmpst/config'

interface FooterContent {
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: Array<{ name: string; href: string; external?: boolean }>
  subNavigation: Array<{ name: string; href: string; external?: boolean }>
  logoImg?: string
  logoImgDark?: string
  logoAlt: string
  logoStyles?: { dark?: string; light?: string }
  copyright?: string | Record<string, string>
}

const content = useSpmpstConfig<FooterContent>('footer.content')
const { lang } = useData()
const copyrightText = computed(() => {
  if (typeof content.copyright === 'string') return content.copyright
  if (!content.copyright) return ''
  return content.copyright[lang.value] ?? content.copyright.en ?? Object.values(content.copyright)[0] ?? ''
})
defineProps<{ homeLayout?: boolean }>()
</script>

<template>
  <div class="footer-deluqa-docs" :class="{ 'footer-deluqa-docs--home': homeLayout }">
    <div class="footer-deluqa-docs__container">
      <div class="footer-deluqa-docs__content">
        <MainlineCta
          :title="content.title"
          :description="content.description"
          :action-label="content.actionLabel"
          :action-href="content.actionHref"
          :navigation="content.navigation"
          :sub-navigation="content.subNavigation"
          :logo-img="content.logoImg"
          :logo-img-dark="content.logoImgDark"
          :logo-alt="content.logoAlt"
          :logo-styles="content.logoStyles"
        />
      </div>
      <div v-if="!homeLayout" class="footer-deluqa-docs__aside" aria-hidden="true" />
    </div>
    <small v-if="copyrightText" class="footer-deluqa-docs__copyright">{{ copyrightText }}</small>
  </div>
</template>

<style scoped>
.footer-deluqa-docs {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 1220px;
  margin-inline: auto;
  text-align: center;
}

.footer-deluqa-docs__copyright {
  display: block;
  margin: 1.5rem auto 0;
  padding: 0 1rem 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

@media (max-width: 959px) {
  .footer-deluqa-docs {
    max-width: 100%;
    overflow-x: clip;
  }
}
</style>
