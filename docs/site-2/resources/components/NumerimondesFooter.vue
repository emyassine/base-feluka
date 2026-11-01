<script setup lang="ts">
import { useSpmpstConfig } from '@spmpst/config'

interface FooterLink {
  name: string
  href: string
  external?: boolean
}

interface FooterContent {
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: FooterLink[]
  subNavigation: FooterLink[]
  logoImg?: string
  logoAlt: string
}

const content = useSpmpstConfig<FooterContent>('footer.content')
</script>

<template>
  <footer class="nm-footer">
    <div class="nm-footer__intro">
      <h2>{{ content.title }}</h2>
      <p>{{ content.description }}</p>
      <a class="nm-footer__action" :href="content.actionHref">{{ content.actionLabel }}</a>
    </div>

    <nav class="nm-footer__links" aria-label="Footer">
      <a v-for="item in content.navigation" :key="item.href" :href="item.href"
        :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined">
        {{ item.name }}
      </a>
    </nav>

    <div class="nm-footer__base">
      <a class="nm-footer__brand" href="/" :aria-label="content.logoAlt">
        <img v-if="content.logoImg" :src="content.logoImg" :alt="content.logoAlt" />
        <span v-else>{{ content.logoAlt }}</span>
      </a>
      <nav class="nm-footer__legal" aria-label="Legal and contact">
        <a v-for="item in content.subNavigation" :key="item.href" :href="item.href"
          :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined">
          {{ item.name }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.nm-footer { max-width: 1184px; margin: 5rem auto 0; padding: 3rem 1.5rem 1.5rem; border-top: 1px solid var(--vp-c-divider); }
.nm-footer__intro { max-width: 42rem; margin: 0 auto; text-align: center; }
.nm-footer__intro h2 { margin: 0; font-size: clamp(1.6rem, 3vw, 2.4rem); letter-spacing: -.035em; }
.nm-footer__intro p { margin: .9rem auto 1.25rem; color: var(--vp-c-text-2); line-height: 1.7; }
.nm-footer a { color: var(--vp-c-text-2); text-decoration: none; transition: color .18s ease; }
.nm-footer a:hover { color: var(--vp-c-brand-1); }
.nm-footer__intro .nm-footer__action { display: inline-flex; padding: .65rem 1rem; border-radius: 999px; background: var(--vp-c-brand-1); color: var(--vp-c-white); font-weight: 650; }
.nm-footer__links, .nm-footer__base, .nm-footer__legal { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .75rem 1.5rem; }
.nm-footer__links { margin: 2.5rem 0; }
.nm-footer__base { justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider); font-size: .85rem; }
.nm-footer__brand img { display: block; width: auto; max-width: 11rem; height: 2rem; }
@media (max-width: 640px) { .nm-footer__base { flex-direction: column; } }
</style>
