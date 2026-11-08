<script setup lang="ts">
import HeroEffect from '../hero-effect/HeroEffect.vue'

const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  description?: string
  buttons?: { label: string; href: string; color?: string }[]
  height?: string
  isDark?: boolean
}>(), { isDark: false, height: '40vh', buttons: () => [] })

const effect = [
  'silk',
  { inject: { lightColor: '#0043e0', darkColor: '#141D2A', lightNoise: 1.5, noiseIntensity: 0.3, speed: 12 } }
]
</script>

<template>
  <HeroEffect
    :full-bleed="false"
    :effect="effect"
    :is-dark="props.isDark"
    :hero-style="{ minHeight: props.height }"
    :eyebrow="props.eyebrow"
    :title="props.title"
    :description="props.description"
    :title-style="{ color: '#e2e8f0' }"
    :description-style="{ color: '#e2e8f0' }"
    :buttons="props.buttons"
  >
    <template v-if="$slots.background" #background><slot name="background" /></template>
    <template v-if="$slots.content || $slots.default" #content><slot name="content"><slot /></slot></template>
    <template v-if="$slots.dock" #dock><slot name="dock" /></template>
  </HeroEffect>
</template>
