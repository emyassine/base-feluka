<script setup>
defineOptions({ name: 'SimpleMiniCard' })

defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: [Number, String],
    default: 2
  },
  stacked: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="simple-mini-card-wrapper" style="width: 100%; container: simple-mini-card / inline-size;">
    <div
      v-for="(cat, catIndex) in categories"
      :key="catIndex"
      class="simple-mini-card-section"
    >
      <h3 class="simple-mini-card-title">
        {{ cat.title }}
      </h3>

      <div
        class="simple-mini-card-grid"
        :style="{ '--grid-cols': columns }"
      >
        <component
          :is="item.url ? 'a' : 'div'"
          v-for="(item, itemIndex) in cat.items"
          :key="itemIndex"
          :href="item.url || undefined"
          class="simple-mini-card"
          @click="item.url ? null : emit('click', { item, category: cat.title })"
          :style="{
            '--card-bg': '#ffffff',
            '--card-bg-hover': '#f8fafc',
            '--card-bg-dark': '#1e293b',
            '--card-bg-dark-hover': '#334155',
            '--card-radius': 'var(--radius-md)',
            '--card-shadow': '0 4px 16px rgba(0, 0, 0, 0.08)',
            '--card-shadow-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
            '--card-shadow-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
            '--card-shadow-dark-hover': '0 8px 24px rgba(0, 0, 0, 0.6)',
            '--card-border': '1px solid #e2e8f0',
            '--card-border-hover': '#cbd5e1',
            '--card-border-dark': '1px solid #334155',
            '--card-border-dark-hover': '#475569',
            '--card-text': '#0f172a',
            '--card-text-dark': '#f8fafc',
            '--icon-color': '#2563eb',
            '--icon-color-dark': '#60a5fa',

            background: 'var(--card-bg)',
            color: 'var(--card-text)',
            borderRadius: 'var(--card-radius)',
            boxShadow: 'var(--card-shadow)',
            border: 'var(--card-border)',
            display: 'flex',
            flexDirection: stacked ? 'column' : 'row',
            alignItems: stacked ? 'flex-start' : 'center',
            textDecoration: 'none',
            cursor: (clickable || item.url) ? 'pointer' : 'default',
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
            boxSizing: 'border-box'
          }"
        >
          <div
            class="simple-mini-card-icon"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
            />
          </div>

          <p class="simple-mini-card-label">
            {{ item.title }}
          </p>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Small available width: one column */
.simple-mini-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(8px, 2.2cqi, 12px);
  width: 100%;
}

.simple-mini-card-section {
  margin-bottom: clamp(20px, 6cqi, 32px);
}

.simple-mini-card-title {
  margin: 0 0 clamp(8px, 3cqi, 16px);
  color: inherit;
  font-size: clamp(.95rem, 3.3cqi, 1.1rem);
  font-weight: 600;
  line-height: 1.3;
}

.simple-mini-card {
  min-width: 0;
  gap: clamp(8px, 2.5cqi, 12px);
  padding: clamp(10px, 3cqi, 16px);
  font-size: clamp(.82rem, 2.8cqi, 1rem);
  line-height: 1.4;
}

.simple-mini-card-icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: var(--icon-color);
}

.simple-mini-card-icon img {
  display: block;
  width: clamp(16px, 4cqi, 20px);
  height: clamp(16px, 4cqi, 20px);
}

.simple-mini-card-label {
  min-width: 0;
  margin: 0;
  color: inherit;
  font-weight: 500;
}

/* Switch as soon as the component itself has enough room for its columns. */
@container simple-mini-card (min-width: 480px) {
  .simple-mini-card-grid {
    grid-template-columns: repeat(var(--grid-cols, 2), minmax(0, 1fr));
  }
}

.simple-mini-card:hover {
  background: var(--card-bg-hover) !important;
  box-shadow: var(--card-shadow-hover) !important;
  border-color: var(--card-border-hover) !important;
  transform: translateY(-2px);
}

@media (prefers-color-scheme: dark) {
  .simple-mini-card {
    background: var(--card-bg-dark) !important;
    color: var(--card-text-dark) !important;
    box-shadow: var(--card-shadow-dark) !important;
    border: var(--card-border-dark) !important;
  }
  .simple-mini-card:hover {
    background: var(--card-bg-dark-hover) !important;
    box-shadow: var(--card-shadow-dark-hover) !important;
    border-color: var(--card-border-dark-hover) !important;
  }
  .simple-mini-card .simple-mini-card-icon {
    color: var(--icon-color-dark) !important;
  }
}

:global(html.dark) .simple-mini-card {
  border-color: #334155 !important;
  background: var(--card-bg-dark) !important;
  color: var(--card-text-dark) !important;
  box-shadow: var(--card-shadow-dark) !important;
}
:global(html.dark) .simple-mini-card:hover {
  border-color: var(--card-border-dark-hover) !important;
  background: var(--card-bg-dark-hover) !important;
  box-shadow: var(--card-shadow-dark-hover) !important;
}
:global(html.dark) .simple-mini-card-icon { color: var(--icon-color-dark) !important; }
.simple-mini-card-icon { gap: 12px; }
.simple-mini-card-icon img { width: 24px; height: 24px; }
</style>
