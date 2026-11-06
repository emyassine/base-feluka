<template>
  <section :id="id" class="nm-brand-type-section" :class="`nm-brand-type-section--${kind}`">
    <header class="nm-brand-type-section__heading">
      <p>{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <div>{{ description }}</div>
    </header>

    <div v-if="kind === 'typeface'" class="nm-brand-typeface">
      <div class="nm-brand-typeface__sample">
        <span>BrandKit®</span>
        <p>Uncut Sans is yet another slightly quirky sans serif.</p>
        <small>Typeface</small>
        <strong>Uncut Sans®</strong>
      </div>
      <div class="nm-brand-typeface__alphabet">{{ alphabet }}<br />{{ numerals }}</div>
    </div>

    <div v-else-if="kind === 'scale'" class="nm-brand-scale">
      <article v-for="item in items" :key="item.name" class="nm-brand-scale__item">
        <div><span>Font: Uncut Sans</span><span>Style: {{ item.name }}</span></div>
        <p :style="{ fontSize: `clamp(${item.minSize || '1rem'}, ${item.size}cqw, ${item.maxSize || '8rem'})` }">{{ item.sample || 'Hell Neue' }}</p>
      </article>
    </div>

    <div v-else class="nm-brand-use">
      <div class="nm-brand-use__poster">
        <p class="nm-brand-use__brand">BrandKit®</p>
        <div class="nm-brand-use__headline">Uncut Sans is yet another slightly quirky sans serif.</div>
        <div class="nm-brand-use__meta"><span>Typeface</span><span>Uncut Sans</span><span>540</span></div>
        <div class="nm-brand-use__lockup"><span>NeueCraft®</span><span>Updated<br />Design System</span><strong>Brand<br />Standards<br />Manual</strong></div>
      </div>
      <div class="nm-brand-use__cities">
        <div v-for="(item, index) in cities" :key="item.name"><span>{{ item.name }}</span><span>{{ item.code }}</span><span>{{ item.time }}</span><b>0{{ index + 1 }}</b></div>
      </div>
      <div class="nm-brand-use__editorial">
        <p class="nm-brand-use__editorial-title">Uncut Sans — Our Typeface In Use</p>
        <p class="nm-brand-use__date">Johann Sebastian Bach<br />March 31, 1685</p>
        <h3>Typographic Is Our CORE Brand Element — A Cornerstone Of Our Design.</h3>
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  eyebrow: string
  title: string
  description: string
  kind: 'typeface' | 'scale' | 'use'
  items?: Array<{ name: string; size: number; minSize?: string; maxSize?: string; sample?: string }>
  alphabet?: string
  numerals?: string
  cities?: Array<{ name: string; code: string; time: string }>
  paragraphs?: string[]
}>(), {
  items: () => [],
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz',
  numerals: '0123456789   !@#$%&*()_+-=[]{},.?!',
  cities: () => [],
  paragraphs: () => [],
})
</script>

<style scoped>
.nm-brand-type-section { padding: clamp(3rem, 8cqw, 7rem) 0; border-top: 1px solid var(--nm-brand-line); }
.nm-brand-type-section__heading { display: grid; grid-template-columns: 1fr 1.35fr; gap: .7rem 3rem; margin-bottom: clamp(2rem, 5cqw, 4rem); }
.nm-brand-type-section__heading > p { grid-column: 1 / -1; margin: 0; color: var(--nm-brand-muted); font: .7rem var(--vp-font-family-mono); letter-spacing: .14em; text-transform: uppercase; }
.nm-brand-type-section h2 { margin: 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.065em; line-height: .95; }
.nm-brand-type-section__heading > div { align-self: end; max-width: 54ch; color: var(--nm-brand-muted); line-height: 1.6; }
.nm-brand-typeface { overflow: hidden; padding: clamp(1.5rem, 4cqw, 4rem); border: 1px solid var(--nm-brand-line); border-radius: .65rem; background: var(--nm-brand-surface-soft); }
.nm-brand-typeface__sample { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end; }
.nm-brand-typeface__sample > span { grid-column: 1 / -1; font-size: .8rem; }
.nm-brand-typeface__sample p { margin: 0; font-size: clamp(2rem, 8cqw, 8rem); letter-spacing: -.075em; line-height: .9; }
.nm-brand-typeface__sample small { color: var(--nm-brand-muted); }
.nm-brand-typeface__sample strong { text-align: right; font-size: clamp(1rem, 2cqw, 2rem); font-weight: 500; }
.nm-brand-typeface__alphabet { margin-top: clamp(2rem, 6cqw, 6rem); padding-top: 1rem; border-top: 1px solid var(--nm-brand-line); font-size: clamp(1.3rem, 3.6cqw, 3.5rem); letter-spacing: -.04em; line-height: 1.3; overflow-wrap: anywhere; }
.nm-brand-scale { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.nm-brand-scale__item { min-width: 0; padding: 1rem; overflow: hidden; border: 1px solid var(--nm-brand-line); border-radius: .5rem; background: var(--nm-brand-surface-soft); }
.nm-brand-scale__item > div { display: flex; justify-content: space-between; gap: .5rem; color: var(--nm-brand-muted); font: .65rem var(--vp-font-family-mono); }
.nm-brand-scale__item p { margin: 1.5rem 0 .5rem; line-height: .95; letter-spacing: -.06em; overflow-wrap: anywhere; }
.nm-brand-use { overflow: hidden; border: 1px solid var(--nm-brand-line); border-radius: .65rem; background: #e8e7e1; color: #151515; }
.nm-brand-use__poster { display: grid; min-height: 38rem; padding: clamp(1.5rem, 5cqw, 5rem); background: linear-gradient(145deg, #f5f2ec 60%, #dedcd5); }
.nm-brand-use__brand { margin: 0; font-size: .8rem; }
.nm-brand-use__headline { align-self: center; max-width: 13ch; font-size: clamp(3rem, 12cqw, 12rem); letter-spacing: -.09em; line-height: .84; }
.nm-brand-use__meta, .nm-brand-use__lockup { display: flex; justify-content: space-between; gap: 1rem; align-items: end; }
.nm-brand-use__meta { align-self: end; padding-top: 1rem; border-top: 1px solid #999; font: .7rem var(--vp-font-family-mono); }
.nm-brand-use__lockup { margin-top: 3rem; align-items: start; font-size: clamp(.8rem, 2cqw, 1.8rem); }
.nm-brand-use__lockup strong { font-size: clamp(2rem, 7cqw, 6rem); letter-spacing: -.07em; line-height: .85; }
.nm-brand-use__cities { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); background: #171717; color: white; }
.nm-brand-use__cities > div { position: relative; display: flex; justify-content: space-between; gap: .4rem; padding: 1rem; border: 1px solid #444; font: .7rem var(--vp-font-family-mono); }
.nm-brand-use__cities b { position: absolute; right: .5rem; bottom: .35rem; color: #777; font-size: .55rem; }
.nm-brand-use__editorial { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem 4rem; padding: clamp(1.5rem, 5cqw, 5rem); }
.nm-brand-use__editorial-title, .nm-brand-use__date { margin: 0; font: .7rem var(--vp-font-family-mono); }
.nm-brand-use__date { text-align: right; }
.nm-brand-use__editorial h3, .nm-brand-use__editorial > p:not(:first-child):not(:nth-child(2)) { grid-column: 2; }
.nm-brand-use__editorial h3 { margin: 2rem 0 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.06em; line-height: .95; }
.nm-brand-use__editorial > p:not(:first-child):not(:nth-child(2)) { color: #555; line-height: 1.7; }
@container (max-width: 680px) { .nm-brand-type-section__heading { grid-template-columns: 1fr; } .nm-brand-scale { grid-template-columns: 1fr; } .nm-brand-use__cities { grid-template-columns: repeat(2, minmax(0, 1fr)); } .nm-brand-use__editorial { grid-template-columns: 1fr; } .nm-brand-use__date { text-align: left; } .nm-brand-use__editorial h3, .nm-brand-use__editorial > p:not(:first-child):not(:nth-child(2)) { grid-column: 1; } }
</style>
