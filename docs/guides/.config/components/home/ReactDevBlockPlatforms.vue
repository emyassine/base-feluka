<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
withDefaults(defineProps<{ title?: string; lead?: string; detail?: string; ctaLabel?: string; ctaHref?: string; ctaIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news' }>(), {
  ctaLabel: 'Build for native platforms', ctaHref: 'https://reactnative.dev/', ctaIcon: 'native',
})
</script>
<template>
  <ReactDevMarkup block="platforms" :title="title" :lead="lead" :detail="detail"
    :actions="[{ sourceLabel: 'Build for native platforms', label: ctaLabel, href: ctaHref, icon: ctaIcon, style: 'cta' }]" />
</template>
