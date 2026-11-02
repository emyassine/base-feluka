<script setup lang="ts">
interface TimelineItem {
  title: string
  status?: TimelineStatus[]
  commit?: string
  branch?: string
  duration?: string
  time?: string
  href?: string
}

interface TimelineStatus {
  icon?: string
  markerColor?: string
  badge?: {
    text: string
    color?: string
  }
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
      <span
        v-if="item.status?.length"
        class="timeline__marker"
        :style="item.status[0].markerColor ? { backgroundColor: item.status[0].markerColor } : undefined"
        aria-hidden="true"
      >
        <img v-if="item.status[0].icon?.startsWith('/') || item.status[0].icon?.startsWith('http')" class="timeline__marker-image" :src="item.status[0].icon" alt="">
        <span v-else-if="item.status[0].icon" class="timeline__marker-icon">{{ item.status[0].icon }}</span>
      </span>

      <div class="timeline__content">
        <div class="timeline__heading">
          <strong v-if="!item.href">{{ item.title }}</strong>
          <a v-else class="timeline__title-link" :href="item.href">
            {{ item.title }}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" /></svg>
          </a>
          <template v-for="(status, statusIndex) in item.status || []" :key="statusIndex">
            <span
              v-if="status.badge"
              class="timeline__badge"
              :style="status.badge.color ? { '--timeline-badge-color': status.badge.color } : undefined"
            >{{ status.badge.text }}</span>
          </template>
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
  background: var(--vp-c-brand-1, #64748b);
  color: white;
}

.timeline__marker-image { width: 21px; height: 21px; object-fit: contain; }
.timeline__marker-icon { color: white; font-size: 1.2rem; font-weight: 600; line-height: 1; }
.timeline__content { min-width: 0; padding: 1px 0 24px; }
.timeline__heading { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; min-height: 25px; }
.timeline__heading strong { font-size: 1.1rem; font-weight: 600; line-height: 1.35; }
.timeline__title-link { display: inline-flex; align-items: center; gap: 6px; color: inherit; font-size: 1.1rem; font-weight: 600; line-height: 1.35; text-decoration: none; }
.timeline__title-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.timeline__title-link svg { width: 15px; height: 15px; flex: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; opacity: .72; }
.timeline__badge { padding: 2px 7px; border: 1px solid var(--timeline-badge-color, currentColor); border-radius: var(--radius-md); color: var(--timeline-badge-color, currentColor); background: color-mix(in srgb, var(--timeline-badge-color, currentColor) 10%, transparent); font-size: .82rem; line-height: 1.35; }
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
