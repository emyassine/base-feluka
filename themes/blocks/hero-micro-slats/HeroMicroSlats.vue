<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import Button from '../../components/button/Button.vue'
import MicroSlats from '../../components/micro-slats/MicroSlats.vue'
interface HeroButton {
  label: string
  href: string
  style?: 'primary' | 'secondary'
  external?: boolean
}

const props = withDefaults(defineProps<{
  isDark?: boolean
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

const isDark = computed(() => props.isDark)
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
  <section class="xbr7mplva" :class="isDark ? 'xbr7mplva--dark' : 'xbr7mplva--light'">
    <div class="xbr7mplva__background" aria-hidden="true">
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
    <div class="xbr7mplva__content">
      <h1 :style="titleStyles" v-html="props.title" />
      <p :style="descriptionStyles" v-html="props.description" />
      <div v-if="props.buttons.length" class="xbr7mplva__actions">
          <Button
            v-for="(button, index) in props.buttons"
            :key="`${button.href}-${index}`"
            tag="a"
            :href="button.href"
            size="md"
            :color="isSecondaryButton(button, index) ? 'gray' : 'primary'"
            :outlined="isSecondaryButton(button, index)"
            :target="button.external ? '_blank' : undefined"
            :rel="button.external ? 'noopener noreferrer' : undefined"
          >{{ button.label }}</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.xbr7mplva {
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

.xbr7mplva__background {
  position: absolute;
  inset: 0;
}

.xbr7mplva__content {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 740px);
  margin-inline: auto;
  padding-block: 2rem;
  text-align: center;
}

.xbr7mplva--light { color: #fff; }
.xbr7mplva--dark { color: #fff; }

.xbr7mplva h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.xbr7mplva p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.xbr7mplva__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .xbr7mplva { min-height: 34rem; margin-top: -20px; }
}
</style>
