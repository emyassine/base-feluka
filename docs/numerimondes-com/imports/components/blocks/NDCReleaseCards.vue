<!-- NDCReleaseCards.vue
     Refactor: each "card" becomes an <NDSSection> **WITHOUT HEADER** (no eyebrow/title/subtitle/actions),
     so the section only renders the body shell + padding, and your content is inside the slot.
-->
<template>
  <div :class="['ndc-release', rootClass]" :style="[rootStyle, customStyles]" v-bind="rootAttrs">
    <div class="ndc-release__grid" :style="{ '--ndc-cols': String(cols) }">
      <NDSSection
        v-for="(item, i) in items"
        :key="item.id ?? i"
        :root-class="['ndc-release__item', item.sectionClass]"
        :root-style="[item.sectionStyle]"
        :custom-styles="item.sectionCustomStyles"
        :compact="sectionCompact"
        :secondary="sectionSecondary"
        :collapsible="item.collapsible ?? false"
        :collapsed="item.collapsed ?? false"
        :persist-collapsed="item.persistCollapsed ?? false"
        :id="item.sectionId ?? String(item.id ?? i)"
      >
        <div class="ndc-item">
          <div class="ndc-item__top">
            <h3 class="ndc-item__headline">{{ item.title }}</h3>

            <p v-if="item.description" class="ndc-item__desc">
              {{ item.description }}
            </p>

            <a v-if="item.topLink?.href && item.topLink?.label" class="ndc-item__link" :href="item.topLink.href">
              <span>{{ item.topLink.label }}</span>
              <span aria-hidden="true" class="ndc-item__arrow">→</span>
            </a>
          </div>

          <div class="ndc-item__divider" />

          <dl class="ndc-meta">
            <div v-for="(row, r) in item.meta" :key="r" class="ndc-meta__row">
              <dt class="ndc-meta__k">{{ row.label }}</dt>
              <dd class="ndc-meta__v">{{ row.value }}</dd>
            </div>
          </dl>

          <div class="ndc-item__cta">
            <NDCButton
              v-if="item.button?.label"
              :href="item.button.href"
              :variant="item.button.variant ?? 'secondary'"
              :size="item.button.size ?? 'md'"
              :rounded="item.button.rounded ?? true"
              :pill="item.button.pill ?? false"
              :disabled="item.button.disabled ?? false"
              :icon="item.button.icon ?? 'lucide:arrow-right'"
              icon-position="right"
            >
              {{ item.button.label }}
            </NDCButton>
          </div>
        </div>
      </NDSSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false, name: 'NDCReleaseCards' });

type MetaRow = { label: string; value: string };

type CardButton = {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'blackwhite';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  pill?: boolean;
  disabled?: boolean;
  icon?: string | any;
};

type CardTopLink = { label: string; href: string };

export type ReleaseCardItem = {
  id?: string | number;
  title: string;
  description?: string;
  topLink?: CardTopLink;
  meta: MetaRow[];
  button?: CardButton;

  // OPTIONAL: per-item section tuning
  sectionId?: string;
  sectionClass?: string;
  sectionStyle?: Record<string, any>;
  sectionCustomStyles?: Record<string, any>;

  // OPTIONAL: make an item collapsible (still "no header": NDSSection uses collapse bar, not header)
  collapsible?: boolean;
  collapsed?: boolean;
  persistCollapsed?: boolean;
};

const props = withDefaults(
  defineProps<{
    // Root
    rootClass?: string;
    rootStyle?: Record<string, any>;
    customStyles?: Record<string, any>;

    // Grid
    cols?: 2 | 3;

    // Sections (applied to every item)
    sectionCompact?: boolean;
    sectionSecondary?: boolean;

    // Data
    items: ReleaseCardItem[];
  }>(),
  {
    cols: 2,
    sectionCompact: false,
    sectionSecondary: false,
  }
);

const attrs = useAttrs();
const rootAttrs = computed(() => attrs);
</script>

<style scoped>
.ndc-release {
  margin: 28px 0;
}

/* Grid */
.ndc-release__grid {
  --ndc-gap: 22px;
  display: grid;
  grid-template-columns: repeat(var(--ndc-cols), minmax(0, 1fr));
  gap: var(--ndc-gap);
}

@media (max-width: 960px) {
  .ndc-release__grid {
    grid-template-columns: 1fr;
  }
}

/* IMPORTANT:
   NDSSection already provides:
   - background/border/radius/shadow
   - padding via .nds-section__slot
   So we only style the inner content, not the container shell.
*/
.ndc-item {
  display: flex;
  flex-direction: column;
  min-height: 320px;
}

.ndc-item__top {
  flex: 1 1 auto;
}

.ndc-item__headline {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 500 !important;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.ndc-item__desc {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
  max-width: 56ch;
}

.ndc-item__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.92;
}

.ndc-item__link:hover {
  text-decoration: underline;
}

.ndc-item__arrow {
  transform: translateY(1px);
}

.ndc-item__divider {
  height: 1px;
  background: color-mix(in srgb, var(--vp-c-border) 65%, transparent);
  margin: 18px 0 14px;
}

/* Meta */
.ndc-meta {
  margin: 0;
  padding: 0;
}

.ndc-meta__row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 10px 0;
}

.ndc-meta__k {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  font-weight: 700;
}

.ndc-meta__v {
  margin: 0;
  font-size: 15px;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.ndc-item__cta {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

@media (max-width: 420px) {
  .ndc-meta__row {
    grid-template-columns: 100px 1fr;
  }
}
</style>
