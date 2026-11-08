<template>
  <section :id="id" class="nm-brand-color-section" :aria-labelledby="`${id}-title`">
    <header class="nm-brand-color-section__header">
      <p class="nm-brand-color-section__eyebrow" v-html="eyebrow"></p>
      <div>
        <h2 :id="`${id}-title`" :style="titleStyle" :class="titleClass" v-html="title"></h2>
        <p class="nm-brand-color-section__description" :style="descriptionStyle" :class="descriptionClass" v-html="description"></p>
      </div>
    </header>

    <div v-if="kind === 'palette'" class="nm-brand-color-section__palette" :style="{ '--color-columns': columns }">
      <article
        v-for="item in items"
        :key="item.token"
        class="nm-brand-color-section__palette-item"
        :style="{ background: item.background || item.hex, color: item.textColor || 'var(--swatch-text, #fff)' }"
      >
        <div class="nm-brand-color-section__palette-label">
          <span v-html="item.name"></span>
          <span v-html="item.token"></span>
        </div>
        <span class="nm-brand-color-section__palette-value" v-html="item.hex"></span>
      </article>
    </div>

    <div v-else-if="kind === 'gradients'" class="nm-brand-color-section__gradients">
      <article
        v-for="item in items"
        :key="item.name"
        class="nm-brand-color-section__gradient"
        :style="{ background: item.background, color: item.textColor || '#fff' }"
      >
        <span v-html="item.name"></span>
        <div>
          <span v-html="item.start"></span>
          <span v-html="item.end"></span>
        </div>
      </article>
    </div>

    <div v-else-if="kind === 'combinations'" class="nm-brand-color-section__combinations">
      <article
        v-for="item in items"
        :key="item.name"
        class="nm-brand-color-section__combination"
        :style="{ background: item.background, color: item.textColor }"
      >
        <strong>Aa</strong>
        <div>
          <span v-html="item.name"></span>
          <span v-html="item.value"></span>
        </div>
      </article>
    </div>

    <div v-else class="nm-brand-color-section__groups">
      <section v-for="group in groups" :key="group.name" class="nm-brand-color-section__group">
        <header>
          <h3 v-html="group.name"></h3>
          <span v-if="group.token" v-html="group.token"></span>
        </header>
        <div class="nm-brand-color-section__shades">
          <article
            v-for="item in group.items"
            :key="item.token"
            class="nm-brand-color-section__shade"
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
.nm-brand-color-section {
  display: grid;
  gap: clamp(2rem, 5cqw, 4rem);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  scroll-margin-top: 6rem;
}

.nm-brand-color-section__header {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  align-items: start;
  gap: clamp(1.5rem, 5cqw, 5rem);
  width: 100%;
  padding-top: 0.9rem;
  border-top: 1px solid var(--nm-brand-line);
}

.nm-brand-color-section__eyebrow {
  margin: 0;
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.nm-brand-color-section h2 {
  margin: 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.nm-brand-color-section__description {
  max-width: 65ch;
  margin: 1rem 0 0;
  color: var(--nm-brand-muted);
  font-size: clamp(0.95rem, 1.25cqw, 1.15rem);
  line-height: 1.65;
}

.nm-brand-color-section__palette,
.nm-brand-color-section__gradients,
.nm-brand-color-section__combinations {
  display: grid;
  grid-template-columns: repeat(var(--color-columns), minmax(0, 1fr));
  gap: 0.65rem;
}

.nm-brand-color-section__palette-item,
.nm-brand-color-section__gradient,
.nm-brand-color-section__combination {
  display: flex;
  min-width: 0;
  min-height: clamp(15rem, 28vw, 28rem);
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid #222;
  border-radius: 0.65rem;
  animation: nm-brand-color-scroll linear both;
  animation-duration: auto;
  animation-timeline: view(block);
  animation-range: cover 0% cover 50%;
}

.nm-brand-color-section__palette-label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  line-height: 1.4;
  text-transform: uppercase;
}

.nm-brand-color-section__palette-value {
  font-size: clamp(1rem, 1.6cqw, 1.35rem);
  letter-spacing: -0.03em;
}

.nm-brand-color-section__gradients {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.nm-brand-color-section__gradient {
  min-height: clamp(16rem, 30vw, 30rem);
}

.nm-brand-color-section__gradient > span,
.nm-brand-color-section__gradient > div,
.nm-brand-color-section__combination > div {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.nm-brand-color-section__combination {
  min-height: clamp(16rem, 30vw, 30rem);
}

.nm-brand-color-section__combination strong {
  font-size: clamp(4rem, 10cqw, 9rem);
  font-weight: 500;
  letter-spacing: -0.08em;
  line-height: 0.85;
}

.nm-brand-color-section__groups {
  display: grid;
  gap: clamp(2rem, 4cqw, 3.5rem);
}

.nm-brand-color-section__group > header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.nm-brand-color-section__group h3 {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.nm-brand-color-section__group > header > span {
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
}

.nm-brand-color-section__shades {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 0.4rem;
}

.nm-brand-color-section__shade {
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
  animation: nm-brand-color-scroll linear both;
  animation-duration: auto;
  animation-timeline: view(block);
  animation-range: cover 0% cover 50%;
}

@keyframes nm-brand-color-scroll {
  from { transform: scale(0.75); }
  to { transform: scale(1); }
}

@media (max-width: 850px) {
  .nm-brand-color-section__palette {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nm-brand-color-section__palette-item:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }

  .nm-brand-color-section__shades {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .nm-brand-color-section__header {
    grid-template-columns: 1fr;
  }

  .nm-brand-color-section__gradients,
  .nm-brand-color-section__combinations {
    grid-template-columns: 1fr;
  }

  .nm-brand-color-section__palette-item,
  .nm-brand-color-section__gradient,
  .nm-brand-color-section__combination {
    min-height: 14rem;
  }

  .nm-brand-color-section__shades {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .nm-brand-color-section__palette-item,
  .nm-brand-color-section__gradient,
  .nm-brand-color-section__combination,
  .nm-brand-color-section__shade {
    animation: none;
  }
}
</style>
