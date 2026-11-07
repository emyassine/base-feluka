<template>
  <section :id="id" class="nm-brand-icon-library">
    <header><p>{{ eyebrow }}</p><h2>{{ title }}</h2><div>{{ description }}</div></header>
    <div class="nm-brand-icon-library__panel">
      <div class="nm-brand-icon-library__meta"><strong>{{ title }}</strong><span>{{ stroke }}px</span></div>
      <div class="nm-brand-icon-library__grid">
        <div v-for="(icon, index) in paths" :key="index" class="nm-brand-icon-library__tile">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path v-for="(path, pathIndex) in asPaths(icon)" :key="pathIndex" :d="path.d" :transform="path.transform" fill="none" stroke="currentColor" :stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type IconPath = string | { d: string; transform?: string }
type IconPaths = IconPath | IconPath[]
withDefaults(defineProps<{
  paths: IconPaths[]
  id: string
  eyebrow: string
  title: string
  description: string
  stroke?: number
}>(), { stroke: 1.5 })

function asPaths(icon: IconPaths): Array<{ d: string; transform?: string }> {
  const paths = Array.isArray(icon) ? icon : [icon]
  return paths.map((path) => typeof path === 'string' ? { d: path } : path)
}
</script>

<style scoped>
.nm-brand-icon-library { padding: clamp(3rem, 8cqw, 7rem) 0; border-top: 1px solid var(--nm-brand-line); }
.nm-brand-icon-library header { display: grid; grid-template-columns: 1fr 1.35fr; gap: .7rem 3rem; margin-bottom: clamp(2rem, 5cqw, 4rem); }
.nm-brand-icon-library header > p { grid-column: 1 / -1; margin: 0; color: var(--nm-brand-muted); font: .7rem var(--vp-font-family-mono); letter-spacing: .14em; text-transform: uppercase; }
.nm-brand-icon-library h2 { margin: 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.065em; line-height: .95; }
.nm-brand-icon-library header > div { align-self: end; max-width: 54ch; color: var(--nm-brand-muted); line-height: 1.6; }
.nm-brand-icon-library__panel { padding: clamp(1rem, 3cqw, 2.5rem); border: 1px solid var(--nm-brand-line); border-radius: .65rem; background: linear-gradient(180deg, #1208cc 26.4569%, #d689b0 100%); color: #fff; }
.nm-brand-icon-library__meta { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; font: .72rem var(--vp-font-family-mono); }
.nm-brand-icon-library__grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: .5rem; }
.nm-brand-icon-library__tile { display: grid; aspect-ratio: 1; place-items: center; border: 1px solid rgb(255 255 255 / 72%); border-radius: .4rem; }
.nm-brand-icon-library svg { width: 54%; height: 54%; }
@container (max-width: 680px) { .nm-brand-icon-library header { grid-template-columns: 1fr; } .nm-brand-icon-library__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>
