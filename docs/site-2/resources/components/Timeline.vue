<script setup lang="ts">
interface TimelineItem {
  title: string
  status?: 'success' | 'failed' | 'pending'
  commit?: string
  branch?: string
  duration?: string
  time?: string
  href?: string
}

withDefaults(defineProps<{
  items: TimelineItem[]
  label?: string
}>(), {
  label: 'Activity timeline',
})
</script>

<template>
  <ol class="timeline" :aria-label="label">
    <li v-for="(item, index) in items" :key="`${item.commit}-${index}`" class="timeline__item">
      <span v-if="item.status" class="timeline__marker" :class="`timeline__marker--${item.status}`" aria-hidden="true">
        <svg v-if="item.status === 'success'" viewBox="0 0 24 24" fill="none">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
        <svg v-else-if="item.status === 'failed'" viewBox="0 0 24 24" fill="none">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
        <span v-else class="timeline__pending-dot" />
      </span>

      <div class="timeline__content">
        <div class="timeline__heading">
          <strong v-if="!item.href">{{ item.title }}</strong>
          <a v-else class="timeline__title-link" :href="item.href">
            {{ item.title }}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" /></svg>
          </a>
          <span v-if="item.status" class="timeline__badge" :class="`timeline__badge--${item.status}`">{{ item.status }}</span>
        </div>
        <div v-if="item.commit || item.branch || item.duration" class="timeline__metadata">
          <template v-if="item.commit"><code>{{ item.commit }}</code></template>
          <span v-if="item.commit && (item.branch || item.duration)" aria-hidden="true">·</span>
          <span v-if="item.branch">{{ item.branch }}</span>
          <span v-if="item.branch && item.duration" aria-hidden="true">·</span>
          <span v-if="item.duration">{{ item.duration }}</span>
        </div>
        <time v-if="item.time" class="timeline__time">{{ item.time }}</time>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  --timeline-line: color-mix(in srgb, currentColor 18%, transparent);
  --timeline-muted: color-mix(in srgb, currentColor 64%, transparent);
  --timeline-success: #00c58a;
  --timeline-failed: #f45b62;
  display: grid;
  width: min(100%, 560px);
  margin: 36px auto 0;
  padding: 0;
  color: inherit;
  list-style: none;
}

.timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  column-gap: 20px;
  min-height: 116px;
}

.timeline__item:not(:last-child)::before {
  position: absolute;
  top: 18px;
  bottom: -18px;
  left: 17px;
  width: 2px;
  background: var(--timeline-line);
  content: '';
}

.timeline__marker {
  z-index: 1;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  color: white;
}

.timeline__marker--success { background: var(--timeline-success); }
.timeline__marker--failed { background: var(--timeline-failed); }
.timeline__marker--pending { border: 2px solid color-mix(in srgb, currentColor 45%, transparent); }
.timeline__marker svg { width: 21px; height: 21px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.timeline__pending-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.timeline__content { min-width: 0; padding: 1px 0 24px; }
.timeline__heading { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; min-height: 25px; }
.timeline__heading strong { font-size: 1.1rem; font-weight: 600; line-height: 1.35; }
.timeline__title-link { display: inline-flex; align-items: center; gap: 6px; color: inherit; font-size: 1.1rem; font-weight: 600; line-height: 1.35; text-decoration: none; }
.timeline__title-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.timeline__title-link svg { width: 15px; height: 15px; flex: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; opacity: .72; }
.timeline__badge { padding: 2px 7px; border: 1px solid currentColor; border-radius: 8px; font-size: .82rem; line-height: 1.35; }
.timeline__badge--success { color: var(--timeline-success); background: color-mix(in srgb, var(--timeline-success) 10%, transparent); }
.timeline__badge--failed { color: var(--timeline-failed); background: color-mix(in srgb, var(--timeline-failed) 10%, transparent); }
.timeline__badge--pending { color: var(--timeline-muted); background: transparent; }
.timeline__metadata { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; margin-top: 4px; color: var(--timeline-muted); font-size: .98rem; line-height: 1.45; }
.timeline__metadata code { color: inherit; font: inherit; }
.timeline__time { display: block; margin-top: 3px; color: var(--timeline-muted); font-size: .98rem; line-height: 1.45; }

@media (max-width: 480px) {
  .timeline__item { grid-template-columns: 32px minmax(0, 1fr); column-gap: 14px; min-height: 112px; }
  .timeline__marker { width: 32px; height: 32px; }
  .timeline__item:not(:last-child)::before { top: 16px; left: 15px; }
  .timeline__metadata { gap: 6px; font-size: .9rem; }
}
</style>
