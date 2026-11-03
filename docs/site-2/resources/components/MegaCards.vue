<script setup lang="ts">
import { computed } from 'vue'

export interface MegaCardItem {
  title: string
  description?: string
  href: string
  image: string
  icon?: string
}

export interface MegaCardColumn {
  items: Array<number | 'more'>
  width?: string
  gap?: number
}

interface MegaCardsProps {
  items: MegaCardItem[]
  composition?: MegaCardColumn[]
  rows?: number[][]
  cardHeight?: number
  more?: {
    title: string
    description?: string
    href: string
    image: string
  }
}

const props = withDefaults(defineProps<MegaCardsProps>(), {
  composition: undefined,
  cardHeight: 220,
  more: undefined,
})

const columns = computed(() => (props.composition ?? [
  ...props.items.map((_, index) => ({ items: [index] })),
]).map((column) => ({
  width: column.width ?? '1fr',
  gap: column.gap ?? 12,
  cards: column.items.flatMap((entry) => {
    if (entry === 'more') return props.more ? [{ kind: 'more' as const, item: props.more }] : []
    const item = props.items[entry]
    return item ? [{ kind: 'card' as const, item }] : []
  }),
})))

const rows = computed(() => props.rows?.map((indices) => indices.flatMap((index) => {
  const item = props.items[index]
  return item ? [{ kind: 'card' as const, item }] : []
})))

const gridStyle = computed(() => ({
  '--mega-card-height': `${props.cardHeight}px`,
  gridTemplateColumns: props.rows ? 'minmax(0, 1fr)' : columns.value.map((column) => column.width).join(' ') || '1fr',
}))
</script>

<template>
  <div class="mega-cards" :class="{ 'mega-cards--rows': rows }" :style="gridStyle">
    <div
      v-if="rows"
      v-for="(row, rowIndex) in rows"
      :key="`row-${rowIndex}`"
      class="mega-cards__row"
      :class="{ 'mega-cards__row--single': row.length === 1 }"
    >
      <a
        v-for="(card, cardIndex) in row"
        :key="`${card.item.href}-${cardIndex}`"
        class="mega-cards__card"
        :href="card.item.href"
      >
        <img class="mega-cards__image" :src="card.item.image" alt="">
        <img v-if="card.item.icon" class="mega-cards__icon" :src="card.item.icon" alt="">
        <span class="mega-cards__content">
          <strong v-html="card.item.title" />
          <small v-html="card.item.description" />
        </span>
      </a>
    </div>
    <template v-else>
      <div
      v-for="(column, columnIndex) in columns"
      :key="`column-${columnIndex}`"
      class="mega-cards__column"
      :style="{
        gap: `${column.gap}px`,
        gridTemplateRows: `repeat(${column.cards.length}, minmax(0, 1fr))`,
      }"
    >
      <a
        v-for="(card, cardIndex) in column.cards"
        :key="`${card.item.href}-${cardIndex}`"
        class="mega-cards__card"
        :class="{ 'mega-cards__card--more': card.kind === 'more' }"
        :href="card.item.href"
      >
        <img class="mega-cards__image" :src="card.item.image" alt="">
        <img
          v-if="card.kind === 'card' && card.item.icon"
          class="mega-cards__icon"
          :src="card.item.icon"
          alt=""
        >
        <span class="mega-cards__content">
          <strong v-html="card.item.title" />
          <small v-if="card.kind === 'more' && card.item.description" class="mega-cards__more-hint">
            <span v-html="card.item.description" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </small>
          <small v-else-if="card.kind === 'card'" v-html="card.item.description" />
        </span>
      </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mega-cards {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 12px;
}

.mega-cards__column {
  display: grid;
  min-width: 0;
  min-height: 0;
}

.mega-cards--rows { grid-template-columns: minmax(0, 1fr); }
.mega-cards__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.mega-cards__row--single > .mega-cards__card { grid-column: 1 / -1; width: 100%; }

.mega-cards__card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: var(--mega-card-height, 220px);
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  border-radius: var(--radius-md);
  color: #fff !important;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition: box-shadow .4s cubic-bezier(.22, 1, .36, 1);
}

.mega-cards__card::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 0 0 / .06), rgb(0 0 0 / .82));
  content: '';
}

.mega-cards__card:hover { box-shadow: 0 12px 28px rgb(0 0 0 / .2); }

.mega-cards__image {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s cubic-bezier(.22, 1, .36, 1);
}

.mega-cards__card:hover .mega-cards__image { transform: scale(1.08); }

.mega-cards__icon {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.mega-cards__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 6px;
  min-width: 0;
}

.mega-cards__content strong { overflow-wrap: anywhere; font-size: 1.05rem; }
.mega-cards__content small {
  display: -webkit-box;
  overflow: hidden;
  color: rgb(255 255 255 / .84);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow-wrap: anywhere;
}

.mega-cards__more-hint { display: inline-flex !important; align-items: center; gap: 6px; }
.mega-cards__more-hint svg { width: 14px; height: 14px; flex: none; }

@media (max-width: 768px) {
  .mega-cards { grid-template-columns: minmax(0, 1fr) !important; }
  .mega-cards__card { min-height: 220px; }
  .mega-cards__row { grid-template-columns: minmax(0, 1fr); }
  .mega-cards__row--single > .mega-cards__card { grid-column: auto; width: 100%; }
}
</style>
