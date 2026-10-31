<script setup lang="ts">
import MainlineCta from '../home/MainlineCta.vue'
import { useSpmpstConfig } from '@spmpst/config'

interface FooterContent {
  title: string
  description: string
  actionLabel: string
  actionHref: string
  navigation: Array<{ name: string; href: string; external?: boolean }>
  legalLabel: string
  legalHref: string
  logoAlt: string
}

const content = useSpmpstConfig<FooterContent>('footer.content')
</script>

<template>
  <div class="footer-deluqa-docs">
    <MainlineCta
      :title="content.title"
      :description="content.description"
      :action-label="content.actionLabel"
      :action-href="content.actionHref"
      :navigation="content.navigation"
      :legal-label="content.legalLabel"
      :legal-href="content.legalHref"
      :logo-alt="content.logoAlt"
    />
  </div>
</template>

<style>
.footer-deluqa-docs {
  width: 100%;
  max-width: 1220px;
  margin-inline: auto;
  text-align: center;
}
</style>
