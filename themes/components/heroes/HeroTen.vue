<script setup lang="ts">
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
  <section class="bleed-hero" :style="{ '--bleed-hero-min-height': minHeight }">
    <div v-if="pattern" class="bleed-hero__pattern bleed-hero__pattern--left" aria-hidden="true"></div>
    <div v-if="pattern" class="bleed-hero__pattern bleed-hero__pattern--right" aria-hidden="true"></div>
    <div class="bleed-hero__content">
      <div v-if="$slots.badge" class="bleed-hero__badge"><slot name="badge" /></div>
      <div v-if="$slots.media" class="bleed-hero__media"><slot name="media" /></div>
      <h1 class="bleed-hero__title">{{ title }}</h1>
      <p class="bleed-hero__description">{{ description }}</p>
      <div v-if="$slots.actions" class="bleed-hero__actions"><slot name="actions" /></div>
      <div v-if="$slots.default" class="bleed-hero__extra"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.bleed-hero {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  width: 100vw;
  min-height: var(--bleed-hero-min-height);
  margin-inline: calc(50% - 50vw);
  padding: clamp(4rem, 9vw, 7rem) max(1.25rem, calc((100vw - 1200px) / 2));
  box-sizing: border-box;
  overflow: hidden;
  color: var(--foreground, var(--vp-c-text-1));
}

.bleed-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.bleed-hero__media { margin-bottom: clamp(1.5rem, 4vw, 2.5rem); }
.bleed-hero__media :deep(img) { display: block; width: min(100%, 400px); height: auto; margin-inline: auto; }
.bleed-hero__badge { margin-bottom: 1rem; }
.bleed-hero__title {
  max-width: 18ch;
  margin: 0 0 1.5rem;
  font-size: clamp(2.25rem, 7vw, 3.75rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -.035em;
  text-wrap: balance;
}
.bleed-hero__description {
  max-width: 600px;
  margin: 0;
  color: var(--muted, var(--vp-c-text-2));
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  text-wrap: pretty;
}
.bleed-hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 2rem; }
.bleed-hero__extra { margin-top: 1.5rem; }
.bleed-hero__pattern {
  position: absolute;
  z-index: 0;
  top: 50%;
  width: 246px;
  height: 364px;
  background: radial-gradient(50% 100% at 0% 50%, var(--color-neutral-300, #ccc) 0%, transparent 250%);
  -webkit-mask: url('https://oxide.computer/img/solutions/vertical-hero-ascii-pattern.svg') center / contain no-repeat;
  mask: url('https://oxide.computer/img/solutions/vertical-hero-ascii-pattern.svg') center / contain no-repeat;
  pointer-events: none;
}
.bleed-hero__pattern--left {
  left: max(-3.125rem, calc((100vw - 1200px) / 2 - 296px));
  transform: translateY(-50%);
}
.bleed-hero__pattern--right {
  right: max(-3.125rem, calc((100vw - 1200px) / 2 - 296px));
  transform: translateY(-50%) rotate(180deg);
}
@media (max-width: 700px) {
  .bleed-hero__pattern { opacity: .55; }
  .bleed-hero__pattern--left { left: -130px; }
  .bleed-hero__pattern--right { right: -130px; }
}
</style>
