<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
interface HeroButton {
  label: string
  href: string
  style?: 'primary' | 'secondary'
  external?: boolean
}

const props = withDefaults(defineProps<{
  title: string
  description: string
  buttons?: HeroButton[]
  titleStyle?: CSSProperties
  titleStyleLight?: CSSProperties
  titleStyleDark?: CSSProperties
  descriptionStyle?: CSSProperties
  descriptionStyleLight?: CSSProperties
  descriptionStyleDark?: CSSProperties
}>(), {
  buttons: () => [],
})

const { isDark } = useData()
const titleStyles = computed(() => ({
  ...props.titleStyle,
  ...(isDark.value ? props.titleStyleDark : props.titleStyleLight),
}))
const descriptionStyles = computed(() => ({
  ...props.descriptionStyle,
  ...(isDark.value ? props.descriptionStyleDark : props.descriptionStyleLight),
}))
const isSecondaryButton = (button: HeroButton, index: number) =>
  (button.style ?? (index === 0 ? 'primary' : 'secondary')) === 'secondary'
</script>

<template>
  <section class="nm-acid-hero" :class="isDark ? 'nm-acid-hero--dark' : 'nm-acid-hero--light'">
    <div class="nm-acid-hero__background" aria-hidden="true">
      <AcidSquares
        color1="#5227FF"
        color2="#A855F7"
        color3="#FFFFFF"
        detail="medium"
        :speed="0.7"
        :wave-depth="1"
        :zoom="1.3"
        :density="10.0"
        :glow="1.0"
        :exposure="2700"
        :spread="0.3"
        :step-size="0.002"
        :color-shift="0"
        :contrast="1"
        :brightness="1.0"
        :opacity="1.0"
        :mouse-interaction="true"
        :mouse-strength="0.1"
        :mouse-radius="0.35"
        :blur="0"
        :grain="true"
        :grain-intensity="0.05"
      />
    </div>
    <div class="nm-acid-hero__content">
      <h1 :style="titleStyles" v-html="props.title" />
      <p :style="descriptionStyles" v-html="props.description" />
      <div v-if="props.buttons.length" class="nm-acid-hero__actions">
          <FeluqaButton
            v-for="(button, index) in props.buttons"
            :key="`${button.href}-${index}`"
            tag="a"
            :href="button.href"
            size="md"
            :color="isSecondaryButton(button, index) ? 'gray' : 'primary'"
            :outlined="isSecondaryButton(button, index)"
            :target="button.external ? '_blank' : undefined"
            :rel="button.external ? 'noopener noreferrer' : undefined"
          >{{ button.label }}</FeluqaButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-acid-hero {
  position: relative;
  z-index: 0;
  display: grid;
  width: 100vw;
  min-height: 600px;
  place-items: center;
  margin: 0 calc(50% - 50vw) 3rem;
  padding: clamp(1.25rem, 4vw, 3rem) 0;
  overflow: hidden;
}

:global(.VPNav) {
  z-index: 100;
}

.nm-acid-hero__background {
  position: absolute;
  inset: 0;
}

.nm-acid-hero__content {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 740px);
  margin-inline: auto;
  padding-block: 2rem;
  text-align: center;
}

.nm-acid-hero--light { color: #fff; }
.nm-acid-hero--dark { color: #fff; }

.nm-acid-hero h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.nm-acid-hero p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.nm-acid-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .nm-acid-hero { min-height: 34rem; margin-top: -20px; }
}
</style>
