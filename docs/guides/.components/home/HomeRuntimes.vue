<script setup lang="ts">
import HomeStatus from './HomeStatus.vue'
import './home.css'

interface RuntimeItem {
  name: string
  tone: 'implemented' | 'partial' | 'target' | 'exploring'
  status: string
}

defineProps<{
  label: string
  items: RuntimeItem[]
  note?: string
}>()
</script>

<template>
  <section class="fh-runtimes" :aria-label="label">
    <div class="fh-container">
      <div class="fh-runtimes__grid">
        <p class="fh-runtimes__label">{{ label }}</p>
        <div v-for="(item, index) in items" :key="item.name" class="fh-runtimes__item">
          <span class="fh-runtimes__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="fh-runtimes__name">{{ item.name }}</span>
          <HomeStatus :tone="item.tone" :label="item.status" />
        </div>
      </div>
      <p v-if="note" class="fh-runtimes__note">{{ note }}</p>
    </div>
  </section>
</template>
