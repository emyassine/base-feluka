<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
import MicroSlats from './MicroSlats.vue'

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
</script>

<template>
  <section class="nm-slats-hero" :class="isDark ? 'nm-slats-hero--dark' : 'nm-slats-hero--light'">
    <div class="nm-slats-hero__background" aria-hidden="true">
      <MicroSlats
        preset="swell"
        color="#A855F7"
        glintColor="#ffffff"
        backgroundColor="#000000"
        :slatWidth="10"
        :slatHeight="25"
        :gap="3"
        :roundness="0.75"
        interactive
        :cursorStrength="1"
        :cursorSize="40"
        :swirl="0"
        :trail="1.4"
        :lean="0"
        intro
        :introDuration="1.5"
      />
    </div>
    <div class="nm-slats-hero__content">
      <h1 :style="titleStyles">{{ props.title }}</h1>
      <p :style="descriptionStyles">{{ props.description }}</p>
      <div v-if="props.buttons.length" class="nm-slats-hero__actions">
          <a
            v-for="(button, index) in props.buttons"
            :key="`${button.href}-${index}`"
            class="nm-slats-hero__button"
            :class="`nm-slats-hero__button--${button.style || (index === 0 ? 'primary' : 'secondary')}`"
            :href="button.href"
            :target="button.external ? '_blank' : undefined"
            :rel="button.external ? 'noopener noreferrer' : undefined"
          >{{ button.label }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-slats-hero {
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

.nm-slats-hero__background {
  position: absolute;
  inset: 0;
}

.nm-slats-hero__content {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 740px);
  margin-inline: auto;
  padding-block: 2rem;
  text-align: center;
}

.nm-slats-hero--light { color: #fff; }
.nm-slats-hero--dark { color: #fff; }

.nm-slats-hero h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.nm-slats-hero p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.nm-slats-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.nm-slats-hero__button {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.25rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  color: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 160ms ease, background-color 160ms ease;
}

.nm-slats-hero__button:hover { transform: translateY(-2px); }
.nm-slats-hero__button--primary { border-color: #1749dc; background: #1749dc; color: #fff; }
.nm-slats-hero--light .nm-slats-hero__button--secondary { background: rgb(255 255 255 / 84%); color: #111827; }
.nm-slats-hero--dark .nm-slats-hero__button--secondary { background: rgb(13 24 43 / 78%); color: #fff; }

@media (max-width: 640px) {
  .nm-slats-hero { min-height: 34rem; margin-top: -20px; }
}
</style>
