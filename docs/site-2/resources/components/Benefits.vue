<script setup lang="ts">
import { computed } from 'vue'

interface Benefit {
  title: string
  description?: string
  href?: string
  image: string
  foregroundImage?: string
  imageAlt?: string
}

const props = withDefaults(defineProps<{
  items: Benefit[]
  rows?: number[][]
  imageHeight?: number
}>(), {
  rows: undefined,
  imageHeight: 300,
})

const rows = computed(() => props.rows?.length
  ? props.rows.map((indices) => indices.flatMap((index) => {
    const item = props.items[index]
    return item ? [{ item, number: index + 1 }] : []
  }))
  : [props.items.map((item, index) => ({ item, number: index + 1 }))])
</script>

<template>
  <div class="benefits" :style="{ '--benefit-image-height': `${imageHeight}px` }">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="benefits__row" :class="{ 'benefits__row--single': row.length === 1 }">
      <component
        :is="benefit.item.href ? 'a' : 'article'"
        v-for="benefit in row"
        :key="benefit.item.title"
        class="benefits__item"
        :href="benefit.item.href"
      >
        <div class="benefits__visual">
          <img class="benefits__background" :src="benefit.item.image" alt="" aria-hidden="true">
          <img
            v-if="benefit.item.foregroundImage"
            class="benefits__foreground"
            :src="benefit.item.foregroundImage"
            :alt="benefit.item.imageAlt || ''"
          >
        </div>
        <div class="benefits__copy">
          <h3><span class="benefits__number">{{ String(benefit.number).padStart(2, '0') }}</span>{{ benefit.item.title }}</h3>
          <p v-if="benefit.item.description">{{ benefit.item.description }}</p>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped>
.benefits { display: grid; gap: 28px 16px; width: 100%; min-width: 0; }
.benefits__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.benefits__row--single { grid-template-columns: minmax(0, 1fr); }
.benefits__item { display: block; min-width: 0; color: inherit; text-decoration: none; }
.benefits__visual { position: relative; display: grid; place-items: center; height: var(--benefit-image-height); overflow: hidden; border-radius: 16px; background: #e8edf0; isolation: isolate; }
.benefits__background { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .45s cubic-bezier(.22, 1, .36, 1); }
.benefits__visual::after { position: absolute; z-index: -1; inset: 0; background: rgb(255 255 255 / .12); content: ''; }
.benefits__foreground { display: block; width: min(76%, 360px); max-height: 78%; object-fit: contain; border: 5px solid rgb(255 255 255 / .88); border-radius: 18px; box-shadow: 0 10px 32px rgb(24 35 48 / .2); }
.benefits__item:hover .benefits__background { transform: scale(1.045); }
.benefits__copy { padding-top: 16px; }
.benefits__copy h3 { display: flex; align-items: baseline; gap: 8px; margin: 0 0 8px; font-size: 1.15rem; font-weight: 500; line-height: 1.35; }
.benefits__number { flex: none; color: #3977c8; font-variant-numeric: tabular-nums; }
.benefits__copy p { margin: 0; color: var(--vp-c-text-2, #555); font-size: .92rem; line-height: 1.65; }
@media (max-width: 640px) {
  .benefits__row { grid-template-columns: minmax(0, 1fr); }
  .benefits__visual { height: min(var(--benefit-image-height), 68vw); min-height: 220px; }
}
</style>
