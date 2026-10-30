<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'

withDefaults(defineProps<{
  title?: string
  lead?: string
  primaryLabel?: string
  primaryHref?: string
  primaryIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news'
  secondaryLabel?: string
  secondaryHref?: string
  secondaryIcon?: 'arrow' | 'code' | 'framework' | 'native' | 'news'
}>(), {
  title: 'React',
  lead: 'The library for web and native user interfaces',
  primaryLabel: 'Learn React',
  primaryHref: 'https://react.dev/learn',
  secondaryLabel: 'API Reference',
  secondaryHref: 'https://react.dev/reference/react',
})
</script>

<template>
  <ReactDevMarkup
    block="hero"
    :title="title"
    :lead="lead"
    :actions="[
      { sourceLabel: 'Learn React', label: primaryLabel, href: primaryHref, icon: primaryIcon, style: 'primary' },
      { sourceLabel: 'API Reference', label: secondaryLabel, href: secondaryHref, icon: secondaryIcon, style: 'secondary' },
    ]"
  />
</template>
