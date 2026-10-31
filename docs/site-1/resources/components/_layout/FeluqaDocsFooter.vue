<script setup lang="ts">
import MainlineCta from '../home/MainlineCta.vue'

const navigation = [
  { name: 'Product', href: '/#feature-modern-teams' },
  { name: 'About Us', href: 'https://numerimondes.com', external: true },
  { name: 'Pricing', href: 'https://numerimondes.com', external: true },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: 'https://numerimondes.com', external: true },
  { name: 'X.com', href: 'https://x.com/ausrobdev', external: true },
  { name: 'LinkedIn', href: '#', external: true },
]
</script>

<template>
  <div class="footer-deluqa-docs">
    <MainlineCta
      title="Build with the current foundations"
      description="Follow the guides, check what is implemented, and help move the framework forward."
      action-label="Read the contribution guide"
      action-href="/prologue/contribution-guide"
      :navigation="navigation"
      legal-label="Privacy Policy"
      legal-href="https://numerimondes.com"
      logo-alt="Feluqa"
    />
  </div>
</template>
