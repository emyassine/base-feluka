<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
withDefaults(defineProps<{ title?: string; lead?: string; detail?: string; ctaLabel?: string; ctaHref?: string; ctaIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news' }>(), {
  ctaLabel: 'Get started with a framework', ctaHref: 'https://react.dev/learn/creating-a-react-app', ctaIcon: 'framework',
})
</script>
<template>
  <ReactDevMarkup block="framework" :title="title" :lead="lead" :detail="detail"
    :actions="[{ sourceLabel: 'Get started with a framework', label: ctaLabel, href: ctaHref, icon: ctaIcon, style: 'cta' }]" />
</template>
