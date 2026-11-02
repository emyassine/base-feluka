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
  <div class="simple-mini-card-wrapper" style="width: 100%;">
    <div
      v-for="(cat, catIndex) in categories"
      :key="catIndex"
      class="simple-mini-card-section"
      style="margin-bottom: 32px;"
    >
      <h3 style="margin: 0 0 16px 0; font-size: inherit; font-weight: 600; color: inherit;">
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
            '--card-radius': '12px',
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
            padding: '14px 16px',
            display: 'flex',
            flexDirection: stacked ? 'column' : 'row',
            alignItems: stacked ? 'flex-start' : 'center',
            gap: '12px',
            textDecoration: 'none',
            cursor: (clickable || item.url) ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }"
        >
          <div
            class="simple-mini-card-icon"
            style="display: flex; align-items: center; justify-content: center; color: var(--icon-color); flex-shrink: 0;"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              style="width: 20px; height: 20px; display: block;"
            />
          </div>

          <p style="margin: 0; color: inherit; font-weight: 500;">
            {{ item.title }}
          </p>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile par défaut: 1 colonne */
.simple-mini-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
}

/* Desktop: bascule dynamiquement selon la prop columns */
@media (min-width: 768px) {
  .simple-mini-card-grid {
    grid-template-columns: repeat(var(--grid-cols, 2), 1fr);
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
</style>
