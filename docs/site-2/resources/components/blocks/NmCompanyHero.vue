<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description?: string
    buttons?: { label: string; href: string; color?: string }[]
    height?: string
  }>(),
  { height: '40vh', buttons: () => [] }
)

const effect = [
  'silk',
  { inject: { lightColor: '#0043e0', darkColor: '#141D2A', lightNoise: 1.5, noiseIntensity: 0.3, speed: 12 } }
]
</script>

<template>
  <NmEffectHero
    :full-bleed="false"
    :effect="effect"
    :hero-style="{ minHeight: height }"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :title-style="{ color: '#e2e8f0' }"
    :description-style="{ color: '#e2e8f0' }"
    :buttons="buttons"
  >
    <template #background><slot name="background" /></template>
    <template #content><slot name="content"><slot /></slot></template>
    <template #dock><slot name="dock" /></template>
  </NmEffectHero>
</template>
