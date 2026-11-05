<template>
  <section :id="id" class="brand-kit-color-section" :aria-labelledby="`${id}-title`">
    <header class="brand-kit-color-section__header">
      <p class="brand-kit-color-section__eyebrow" v-html="eyebrow"></p>
      <div>
        <h2 :id="`${id}-title`" :style="titleStyle" :class="titleClass" v-html="title"></h2>
        <p class="brand-kit-color-section__description" :style="descriptionStyle" :class="descriptionClass" v-html="description"></p>
      </div>
    </header>

    <div v-if="kind === 'palette'" class="brand-kit-color-section__palette" :style="{ '--color-columns': columns }">
      <article
        v-for="item in items"
        :key="item.token"
        class="brand-kit-color-section__palette-item"
        :style="{ background: item.background || item.hex, color: item.textColor || 'var(--swatch-text, #fff)' }"
      >
        <div class="brand-kit-color-section__palette-label">
          <span v-html="item.name"></span>
          <span v-html="item.token"></span>
        </div>
        <span class="brand-kit-color-section__palette-value" v-html="item.hex"></span>
      </article>
    </div>

    <div v-else-if="kind === 'gradients'" class="brand-kit-color-section__gradients">
      <article
        v-for="item in items"
        :key="item.name"
        class="brand-kit-color-section__gradient"
        :style="{ background: item.background, color: item.textColor || '#fff' }"
      >
        <span v-html="item.name"></span>
        <div>
          <span v-html="item.start"></span>
          <span v-html="item.end"></span>
        </div>
      </article>
    </div>

    <div v-else-if="kind === 'combinations'" class="brand-kit-color-section__combinations">
      <article
        v-for="item in items"
        :key="item.name"
        class="brand-kit-color-section__combination"
        :style="{ background: item.background, color: item.textColor }"
      >
        <strong>Aa</strong>
        <div>
          <span v-html="item.name"></span>
          <span v-html="item.value"></span>
        </div>
      </article>
    </div>

    <div v-else class="brand-kit-color-section__groups">
      <section v-for="group in groups" :key="group.name" class="brand-kit-color-section__group">
        <header>
          <h3 v-html="group.name"></h3>
          <span v-if="group.token" v-html="group.token"></span>
        </header>
        <div class="brand-kit-color-section__shades">
          <article
            v-for="item in group.items"
            :key="item.token"
            class="brand-kit-color-section__shade"
            :style="{ background: item.hex, color: item.textColor || 'var(--swatch-text, #fff)' }"
          >
            <span v-html="item.name"></span>
            <span v-html="item.hex"></span>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ColorItem {
  name: string
  token?: string
  hex?: string
  value?: string
  background?: string
  start?: string
  end?: string
  textColor?: string
}

interface ColorGroup {
  name: string
  token?: string
  items: ColorItem[]
}

withDefaults(defineProps<{
  id: string
  eyebrow: string
  title: string
  titleStyle?: string
  titleClass?: string
  description: string
  descriptionStyle?: string
  descriptionClass?: string
  kind: 'palette' | 'gradients' | 'shades' | 'spectrum' | 'combinations'
  items?: ColorItem[]
  groups?: ColorGroup[]
  columns?: number
}>(), {
  items: () => [],
  groups: () => [],
  columns: 5,
})

</script>

<style scoped>
.brand-kit-color-section {
  display: grid;
  gap: clamp(2rem, 5cqw, 4rem);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  scroll-margin-top: 6rem;
}

.brand-kit-color-section__header {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  align-items: start;
  gap: clamp(1.5rem, 5cqw, 5rem);
  width: 100%;
  padding-top: 0.9rem;
  border-top: 1px solid var(--brand-kit-line);
}

.brand-kit-color-section__eyebrow {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.brand-kit-color-section h2 {
  margin: 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.brand-kit-color-section__description {
  max-width: 65ch;
  margin: 1rem 0 0;
  color: var(--brand-kit-muted);
  font-size: clamp(0.95rem, 1.25cqw, 1.15rem);
  line-height: 1.65;
}

.brand-kit-color-section__palette,
.brand-kit-color-section__gradients,
.brand-kit-color-section__combinations {
  display: grid;
  grid-template-columns: repeat(var(--color-columns), minmax(0, 1fr));
  gap: 0.65rem;
}

.brand-kit-color-section__palette-item,
.brand-kit-color-section__gradient,
.brand-kit-color-section__combination {
  display: flex;
  min-width: 0;
  min-height: clamp(15rem, 28vw, 28rem);
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid #222;
  border-radius: 0.65rem;
  animation: brand-kit-color-scroll linear both;
  animation-duration: auto;
  animation-timeline: view(block);
  animation-range: cover 0% cover 50%;
}

.brand-kit-color-section__palette-label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  line-height: 1.4;
  text-transform: uppercase;
}

.brand-kit-color-section__palette-value {
  font-size: clamp(1rem, 1.6cqw, 1.35rem);
  letter-spacing: -0.03em;
}

.brand-kit-color-section__gradients {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.brand-kit-color-section__gradient {
  min-height: clamp(16rem, 30vw, 30rem);
}

.brand-kit-color-section__gradient > span,
.brand-kit-color-section__gradient > div,
.brand-kit-color-section__combination > div {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.brand-kit-color-section__combination {
  min-height: clamp(16rem, 30vw, 30rem);
}

.brand-kit-color-section__combination strong {
  font-size: clamp(4rem, 10cqw, 9rem);
  font-weight: 500;
  letter-spacing: -0.08em;
  line-height: 0.85;
}

.brand-kit-color-section__groups {
  display: grid;
  gap: clamp(2rem, 4cqw, 3.5rem);
}

.brand-kit-color-section__group > header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.brand-kit-color-section__group h3 {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.brand-kit-color-section__group > header > span {
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
}

.brand-kit-color-section__shades {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 0.4rem;
}

.brand-kit-color-section__shade {
  display: flex;
  min-width: 0;
  min-height: clamp(5.5rem, 9cqw, 8rem);
  flex-direction: column;
  justify-content: space-between;
  padding: 0.55rem;
  border-radius: 0.4rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.62rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
  animation: brand-kit-color-scroll linear both;
  animation-duration: auto;
  animation-timeline: view(block);
  animation-range: cover 0% cover 50%;
}

@keyframes brand-kit-color-scroll {
  from { transform: scale(0.75); }
  to { transform: scale(1); }
}

@media (max-width: 850px) {
  .brand-kit-color-section__palette {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .brand-kit-color-section__palette-item:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }

  .brand-kit-color-section__shades {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .brand-kit-color-section__header {
    grid-template-columns: 1fr;
  }

  .brand-kit-color-section__gradients,
  .brand-kit-color-section__combinations {
    grid-template-columns: 1fr;
  }

  .brand-kit-color-section__palette-item,
  .brand-kit-color-section__gradient,
  .brand-kit-color-section__combination {
    min-height: 14rem;
  }

  .brand-kit-color-section__shades {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-kit-color-section__palette-item,
  .brand-kit-color-section__gradient,
  .brand-kit-color-section__combination,
  .brand-kit-color-section__shade {
    animation: none;
  }
}
</style>
