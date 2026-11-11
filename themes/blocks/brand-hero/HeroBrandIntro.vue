<script setup lang="ts">
import BrandHero from './BrandHero.vue'

defineProps<{
  eyebrow: string
  eyebrowStyle?: string
  eyebrowClass?: string
  title: string
  titleStyle?: string
  titleClass?: string
  tagline: string
  taglineStyle?: string
  taglineClass?: string
  ctaLabel: string
  ctaLabelStyle?: string
  ctaLabelClass?: string
  ctaHref: string
  backgroundImage?: string
  backgroundImageAlt?: string
}>()
</script>

<template>
  <BrandHero
    :eyebrow="eyebrow"
    :eyebrow-style="eyebrowStyle"
    :eyebrow-class="eyebrowClass"
    :title="title"
    :title-style="titleStyle"
    :title-class="titleClass"
    :tagline="tagline"
    :tagline-style="taglineStyle"
    :tagline-class="taglineClass"
    :cta-label="ctaLabel"
    :cta-label-style="ctaLabelStyle"
    :cta-label-class="ctaLabelClass"
    :cta-href="ctaHref"
    :background-image="backgroundImage"
    :background-image-alt="backgroundImageAlt"
  />
</template>
