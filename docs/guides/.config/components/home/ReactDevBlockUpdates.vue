<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
withDefaults(defineProps<{ title?: string; lead?: string; detail?: string; ctaLabel?: string; ctaHref?: string; ctaIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news' }>(), {
  ctaLabel: 'Read more React news', ctaHref: 'https://react.dev/blog', ctaIcon: 'news',
})
</script>
<template>
  <ReactDevMarkup block="updates" :title="title" :lead="lead" :detail="detail"
    :actions="[{ sourceLabel: 'Read more React news', label: ctaLabel, href: ctaHref, icon: ctaIcon, style: 'cta' }]" />
</template>
