<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import Button from '../../components/button/Button.vue'
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
  buttons: () => [],
})

const isDark = computed(() => props.isDark)
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
const isSecondaryButton = (button: HeroButton, index: number) =>
  (button.style ?? (index === 0 ? 'primary' : 'secondary')) === 'secondary'
</script>

<template>
  <section
    class="x4wuqs690"
    :class="isDark ? 'x4wuqs690--dark' : 'x4wuqs690--light'"
    :style="{ '--x4wuqs690-image': `url('${activeBackgroundImage}')` }"
  >
    <div class="x4wuqs690__panel">
      <div class="x4wuqs690__content">
        <h1 :style="titleStyles" v-html="props.title" />
        <p :style="descriptionStyles" v-html="props.description" />
        <div v-if="props.buttons.length" class="x4wuqs690__actions">
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
    </div>
  </section>
</template>

<style scoped>
.x4wuqs690 {
  position: relative;
  z-index: 0;
  display: grid;
  width: 100vw;
  min-height: clamp(32rem, 66vw, 48rem);
  place-items: center;
  margin: 0 calc(50% - 50vw) 3rem;
  padding: clamp(1.25rem, 4vw, 3rem) 0;
  background-image: var(--x4wuqs690-image);
  background-position: center;
  background-size: cover;
}

.x4wuqs690__panel {
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

.x4wuqs690__content {
  width: min(100% - 2rem, 740px);
  text-align: center;
}

.x4wuqs690--light { color: #111827; }
.x4wuqs690--dark { color: #fff; }

.x4wuqs690 h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.x4wuqs690 p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.x4wuqs690__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .x4wuqs690 { min-height: 34rem; margin-top: -20px; }
  .x4wuqs690__panel { min-height: 30rem; }
}
</style>
