<script setup lang="ts">
import { useId } from 'vue'

const heroId = `q7m4x9-${useId()}`

withDefaults(defineProps<{
  title: string
  description: string
  minHeight?: string
  pattern?: boolean
}>(), {
  minHeight: '60vh',
  pattern: true,
})
</script>

<template>
  <section :id="heroId" class="q7m4x9" :style="{ '--q7m4x9-min-height': minHeight }">
    <div v-if="pattern" class="q7m4x9__pattern q7m4x9__pattern--left" aria-hidden="true"></div>
    <div v-if="pattern" class="q7m4x9__pattern q7m4x9__pattern--right" aria-hidden="true"></div>
    <div class="q7m4x9__content">
      <div v-if="$slots.badge" class="q7m4x9__badge"><slot name="badge" /></div>
      <div v-if="$slots.media" class="q7m4x9__media"><slot name="media" /></div>
      <h1 class="q7m4x9__title">{{ title }}</h1>
      <p class="q7m4x9__description">{{ description }}</p>
      <div v-if="$slots.actions" class="q7m4x9__actions"><slot name="actions" /></div>
      <div v-if="$slots.default" class="q7m4x9__extra"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.q7m4x9 {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  width: 100vw;
  min-height: var(--q7m4x9-min-height);
  margin-inline: calc(50% - 50vw);
  padding: clamp(4rem, 9vw, 7rem) max(1.25rem, calc((100vw - 1200px) / 2));
  box-sizing: border-box;
  overflow: hidden;
  color: var(--text-primary, #172033);
}

.q7m4x9__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.q7m4x9__media { margin-bottom: clamp(1.5rem, 4vw, 2.5rem); }
.q7m4x9__media :deep(img) { display: block; width: min(100%, 400px); height: auto; margin-inline: auto; }
.q7m4x9__badge { margin-bottom: 1rem; }
.q7m4x9__title {
  max-width: 18ch;
  margin: 0 0 1.5rem;
  font-size: clamp(2.25rem, 7vw, 3.75rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -.035em;
  text-wrap: balance;
}
.q7m4x9__description {
  max-width: 600px;
  margin: 0;
  color: var(--text-secondary, #526078);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  text-wrap: pretty;
}
.q7m4x9__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 2rem; }
.q7m4x9__extra { margin-top: 1.5rem; }
.q7m4x9__pattern {
  position: absolute;
  z-index: 0;
  top: 50%;
  width: 246px;
  height: 364px;
  background: radial-gradient(50% 100% at 0% 50%, var(--color-neutral-300, #ccc) 0%, transparent 250%);
  -webkit-mask: radial-gradient(ellipse at center, #000 10%, transparent 72%);
  mask: radial-gradient(ellipse at center, #000 10%, transparent 72%);
  pointer-events: none;
}
.q7m4x9__pattern--left {
  left: max(-3.125rem, calc((100vw - 1200px) / 2 - 296px));
  transform: translateY(-50%);
}
.q7m4x9__pattern--right {
  right: max(-3.125rem, calc((100vw - 1200px) / 2 - 296px));
  transform: translateY(-50%) rotate(180deg);
}
@media (max-width: 700px) {
  .q7m4x9__pattern { opacity: .55; }
  .q7m4x9__pattern--left { left: -130px; }
  .q7m4x9__pattern--right { right: -130px; }
}
</style>
