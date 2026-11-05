<template>
  <section :id="id" class="brand-kit-icon-library">
    <header><p>{{ eyebrow }}</p><h2>{{ title }}</h2><div>{{ description }}</div></header>
    <div class="brand-kit-icon-library__panel">
      <div class="brand-kit-icon-library__meta"><strong>{{ title }}</strong><span>{{ stroke }}px</span></div>
      <div class="brand-kit-icon-library__grid">
        <div v-for="(icon, index) in paths" :key="index" class="brand-kit-icon-library__tile">
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
.brand-kit-icon-library { padding: clamp(3rem, 8cqw, 7rem) 0; border-top: 1px solid var(--brand-kit-line); }
.brand-kit-icon-library header { display: grid; grid-template-columns: 1fr 1.35fr; gap: .7rem 3rem; margin-bottom: clamp(2rem, 5cqw, 4rem); }
.brand-kit-icon-library header > p { grid-column: 1 / -1; margin: 0; color: var(--brand-kit-muted); font: .7rem var(--vp-font-family-mono); letter-spacing: .14em; text-transform: uppercase; }
.brand-kit-icon-library h2 { margin: 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.065em; line-height: .95; }
.brand-kit-icon-library header > div { align-self: end; max-width: 54ch; color: var(--brand-kit-muted); line-height: 1.6; }
.brand-kit-icon-library__panel { padding: clamp(1rem, 3cqw, 2.5rem); border: 1px solid var(--brand-kit-line); border-radius: .65rem; background: linear-gradient(180deg, #1208cc 26.4569%, #d689b0 100%); color: #fff; }
.brand-kit-icon-library__meta { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; font: .72rem var(--vp-font-family-mono); }
.brand-kit-icon-library__grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: .5rem; }
.brand-kit-icon-library__tile { display: grid; aspect-ratio: 1; place-items: center; border: 1px solid rgb(255 255 255 / 72%); border-radius: .4rem; }
.brand-kit-icon-library svg { width: 54%; height: 54%; }
@container (max-width: 680px) { .brand-kit-icon-library header { grid-template-columns: 1fr; } .brand-kit-icon-library__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>
