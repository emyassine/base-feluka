<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
withDefaults(defineProps<{ title?: string; lead?: string; detail?: string; ctaLabel?: string; ctaHref?: string; ctaIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news' }>(), {
  ctaLabel: 'Add React to your page', ctaHref: 'https://react.dev/learn/add-react-to-an-existing-project', ctaIcon: 'code',
})
</script>
<template>
  <ReactDevMarkup block="interactivity" :title="title" :lead="lead" :detail="detail"
    :actions="[{ sourceLabel: 'Add React to your page', label: ctaLabel, href: ctaHref, icon: ctaIcon, style: 'cta' }]" />
</template>
