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
  backgroundImage?: string
  backgroundImageLight?: string
  backgroundImageDark?: string
  buttons?: HeroButton[]
  titleStyle?: CSSProperties
  titleStyleLight?: CSSProperties
  titleStyleDark?: CSSProperties
  descriptionStyle?: CSSProperties
  descriptionStyleLight?: CSSProperties
  descriptionStyleDark?: CSSProperties
}>(), {
  backgroundImage: 'https://images.unsplash.com/photo-1739733901473-421dc1e2dc75?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  buttons: () => [],
})

const { isDark } = useData()
const activeBackgroundImage = computed(() =>
  (isDark.value ? props.backgroundImageDark : props.backgroundImageLight) || props.backgroundImage,
)
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
  <section
    class="nm-hero"
    :class="isDark ? 'nm-hero--dark' : 'nm-hero--light'"
    :style="{ '--nm-hero-image': `url('${activeBackgroundImage}')` }"
  >
    <div class="nm-hero__panel">
      <div class="nm-hero__content">
        <h1 :style="titleStyles">{{ props.title }}</h1>
        <p :style="descriptionStyles">{{ props.description }}</p>
        <div v-if="props.buttons.length" class="nm-hero__actions">
          <a
            v-for="(button, index) in props.buttons"
            :key="`${button.href}-${index}`"
            class="nm-hero__button"
            :class="`nm-hero__button--${button.style || (index === 0 ? 'primary' : 'secondary')}`"
            :href="button.href"
            :target="button.external ? '_blank' : undefined"
            :rel="button.external ? 'noopener noreferrer' : undefined"
          >{{ button.label }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-hero {
  position: relative;
  z-index: 0;
  display: grid;
  width: 100vw;
  min-height: clamp(32rem, 66vw, 48rem);
  place-items: center;
  margin: 0 calc(50% - 50vw) 3rem;
  padding: clamp(1.25rem, 4vw, 3rem) 0;
  background-image: var(--nm-hero-image);
  background-position: center;
  background-size: cover;
}

:global(.VPNav) {
  z-index: 100;
}

.nm-hero__panel {
  position: relative;
  display: grid;
  width: 100%;
  min-height: clamp(27rem, 49vw, 37rem);
  place-items: center;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.nm-hero__content {
  width: min(100% - 2rem, 740px);
  text-align: center;
}

.nm-hero--light { color: #111827; }
.nm-hero--dark { color: #fff; }

.nm-hero h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.nm-hero p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.nm-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.nm-hero__button {
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

.nm-hero__button:hover { transform: translateY(-2px); }
.nm-hero__button--primary { border-color: #1749dc; background: #1749dc; color: #fff; }
.nm-hero--light .nm-hero__button--secondary { background: rgb(255 255 255 / 84%); }
.nm-hero--dark .nm-hero__button--secondary { background: rgb(13 24 43 / 78%); }

@media (max-width: 640px) {
  .nm-hero { min-height: 34rem; margin-top: -20px; }
  .nm-hero__panel { min-height: 30rem; }
}
</style>
