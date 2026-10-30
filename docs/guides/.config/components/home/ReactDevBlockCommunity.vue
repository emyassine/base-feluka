<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
withDefaults(defineProps<{ title?: string; lead?: string; detail?: string; ctaLabel?: string; ctaHref?: string; ctaIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news' }>(), {
  ctaLabel: 'Get Started', ctaHref: 'https://react.dev/learn',
})
</script>
<template>
  <ReactDevMarkup block="community" :title="title" :lead="lead" :detail="detail"
    :actions="[{ sourceLabel: 'Get Started', label: ctaLabel, href: ctaHref, icon: ctaIcon, style: 'primary' }]" />
</template>
