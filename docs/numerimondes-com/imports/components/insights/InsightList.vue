<template>
  <section
    :class="['nds-insights', `layout-${layout}`, rootClass]"
    :style="{
      ...rootStyle,
      '--nds-insights-cols': String(columns),
    }"
    v-bind="rootAttrs"
  >
    <header v-if="eyebrow || title || subtitle || hasActions" class="nds-insights__header">
      <div class="nds-insights__title">
        <p v-if="eyebrow" class="nds-insights__eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="nds-insights__title-text">{{ title }}</h2>
        <p v-if="subtitle" class="nds-insights__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="hasActions" class="nds-insights__actions">
        <NDCButton
          v-if="viewAllHref"
          :href="viewAllHref"
          variant="pure-gray"
          :size="buttonSize"
          pill
          icon="ArrowRight"
          iconPosition="right"
          @click="$emit('viewAll')"
        >
          {{ viewAllText }}
        </NDCButton>
      </div>
    </header>

    <div v-if="filters.length" class="nds-insights__filters">
      <NDCButton
        v-for="filter in filters"
        :key="filter.value"
        :variant="activeFilter === filter.value ? 'primary' : 'ghost'"
        size="sm"
        pill
        @click="handleFilterChange(filter.value)"
      >
        {{ filter.label }}
      </NDCButton>
    </div>

    <div v-if="filteredItems.length" class="nds-insights__grid">
      <NDSSection v-for="item in filteredItems" :key="item.id" class="" :custom-styles="{}">
        <article class="nds-insight__card">
          <component :is="item.href ? 'a' : 'div'" :href="item.href" class="nds-insight__link">
            <div v-if="showThumbnails && item.thumbnail" class="nds-insight__media">
              <img :src="item.thumbnail" :alt="item.title" loading="lazy" />
            </div>

            <div class="nds-insight__body">
              <div v-if="showMeta && (item.category || item.date)" class="nds-insight__meta">
                <span v-if="item.category" class="nds-insight__pill">{{ item.category }}</span>
                <span v-if="item.date" class="nds-insight__date">{{ item.date }}</span>
              </div>

              <h3 class="nds-insight__title">{{ item.title }}</h3>

              <p v-if="showExcerpt && item.excerpt" class="nds-insight__excerpt">
                {{ item.excerpt }}
              </p>
            </div>
          </component>

          <div v-if="item.href" class="nds-insight__cta">
            <NDCButton
              variant="ghost"
              size="xs"
              iconOnly
              pill
              icon="ExternalLink"
              aria-label="Open article"
              :href="item.href"
            />
          </div>
        </article>
      </NDSSection>
    </div>

    <p v-else class="nds-insights__empty">{{ emptyText }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';

defineOptions({ inheritAttrs: false });

type RawQuery = (pathLike: unknown, fallback?: unknown) => unknown;
type ItemRecord = Record<string, unknown>;

export type InsightItem = {
  id: string;
  title: string;
  excerpt?: string;
  summary?: string;
  tag?: string;
  category?: string;
  date?: string;
  href?: string;
  thumbnail?: string;
};

export type Filter = {
  label: string;
  value: string;
};

export type Layout = 'grid' | 'featured' | 'compact' | 'masonry';

const props = withDefaults(
  defineProps<{
    type?: unknown;
    items?: unknown;
    query?: RawQuery;
    limit?: number;
    locale?: string;
    profile?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    emptyText?: string;
    viewAllText?: string;
    viewAllHref?: string;
    showThumbnails?: boolean;
    showMeta?: boolean;
    showExcerpt?: boolean;
    columns?: number;
    buttonSize?: 'sm' | 'md' | 'lg';
    layout?: Layout;
    filters?: Filter[];
    defaultFilter?: string;
    rootClass?: string;
    rootStyle?: Record<string, any>;
    rootAttrs?: Record<string, any>;
  }>(),
  {
    limit: 12,
    eyebrow: '',
    title: '',
    subtitle: '',
    emptyText: 'No articles found.',
    viewAllText: 'View all',
    viewAllHref: '',
    showThumbnails: true,
    showMeta: true,
    showExcerpt: true,
    columns: 3,
    buttonSize: 'md',
    layout: 'grid',
    filters: () => [],
    defaultFilter: 'all',
    rootClass: '',
    rootStyle: () => ({}),
    rootAttrs: () => ({}),
  }
);

const emit = defineEmits<{
  viewAll: [];
  filterChange: [value: string];
}>();

const internalQuery = () => (Array.isArray(props.items) ? props.items : []);

const locale = computed(() => (props.locale || 'en').toLowerCase());
const profile = computed(() => props.profile || '');

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1568394696869-8f44d26d11bc?q=80&w=1470&auto=format&fit=crop';

const activeFilter = ref(props.defaultFilter);

function stringValue(input: unknown): string {
  return input == null ? '' : String(input).trim();
}

function isExternalLink(href: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href) || href.startsWith('#');
}

function normalizeInternalPath(input: string): string {
  if (!input) return '';
  let p = input.replace(/\\/g, '/').trim();
  if (!p.startsWith('/')) p = `/${p}`;
  p = p
    .replace(/\.md$/i, '')
    .replace(/\/index$/i, '')
    .replace(/\/{2,}/g, '/');
  return p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p || '/';
}

function removeNumericPrefix(s: string): string {
  return s.replace(/^\d+-/, '');
}

function derivePathFromSource(source: string): string {
  if (!source) return '';
  const parts = source.replace(/\\/g, '/').split('/').filter(Boolean).map(removeNumericPrefix);
  if (!parts.length) return '';
  const fileName = parts.pop() || '';
  const stem = fileName.replace(/\.md$/i, '').replace(/-([a-z]{2})$/i, '');
  if (!stem || stem.toLowerCase() === 'index') return parts.length ? `/${parts.join('/')}` : '/';
  return `/${[...parts, stem].join('/')}`;
}

function derivePathFromDotted(pathValue: string): string {
  if (!pathValue) return '';
  const parts = pathValue
    .split('.')
    .map(s => removeNumericPrefix(s.trim()))
    .filter(Boolean);
  return parts.length ? `/${parts.join('/')}` : '';
}

function derivePathFromHierarchy(item: ItemRecord): string {
  const family = removeNumericPrefix(stringValue(item.family));
  const category = removeNumericPrefix(stringValue(item.category));
  const subcategory = stringValue(item.subcategory)
    .split('/')
    .map(s => removeNumericPrefix(s.trim()))
    .filter(Boolean);
  const slug = removeNumericPrefix(stringValue(item.slug || item.id));
  const parts = [family, category, ...subcategory, slug].filter(Boolean);
  return parts.length ? `/${parts.join('/')}` : '';
}

function localizePath(pathValue: string): string {
  const normalized = normalizeInternalPath(pathValue);
  if (!normalized) return '';
  const localeValue = stringValue(locale.value || 'en').toLowerCase();
  const profileValue = stringValue(profile.value);
  const segments = normalized.split('/').filter(Boolean);
  if (segments[0] === localeValue) return withBase(normalized);
  if (profileValue && segments[0] === profileValue && segments[1] === localeValue) return withBase(normalized);
  const prefix = profileValue ? `/${profileValue}/${localeValue}` : `/${localeValue}`;
  return withBase(`${prefix}${normalized === '/' ? '' : normalized}`.replace(/\/{2,}/g, '/'));
}

function pickTag(item: ItemRecord): string {
  const direct = stringValue(item.tag);
  if (direct) return direct;
  if (Array.isArray(item.tags) && item.tags.length) return stringValue(item.tags[0]);
  return '';
}

function resolveItemHref(item: ItemRecord): string {
  const explicitHref = stringValue(item.href || item.link);
  const sourcePath = derivePathFromSource(stringValue(item.source));
  const dottedPath = derivePathFromDotted(stringValue(item.path));
  const hierarchicalPath = derivePathFromHierarchy(item);
  const contentPath = sourcePath || dottedPath || hierarchicalPath;
  if (contentPath) return localizePath(contentPath);
  if (!explicitHref) return '';
  return isExternalLink(explicitHref) ? explicitHref : localizePath(explicitHref);
}

function resolveThumbUrl(input: string): string {
  if (!input) return FALLBACK_THUMBNAIL;
  if (isExternalLink(input)) return input;
  return withBase(input.startsWith('/') ? input : `/${input}`);
}

function resolveInput(input: unknown, fallback: unknown = null): unknown {
  const queryFn = props.query || internalQuery;
  return typeof queryFn === 'function' ? queryFn(input, fallback) : (input ?? fallback);
}

function normalizeItems(value: unknown): InsightItem[] {
  const source = Array.isArray(value) ? value : [];
  return source
    .map<InsightItem | null>((entry, index) => {
      if (typeof entry === 'string') return { id: `item-${index}`, title: entry };
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as ItemRecord;
      const title = String(item.title || '').trim();
      if (!title) return null;
      return {
        id: String(item.id || item.slug || `item-${index}`),
        title,
        excerpt: item.excerpt ? String(item.excerpt) : '',
        summary: item.summary ? String(item.summary) : '',
        tag: pickTag(item),
        category: item.category ? String(item.category) : '',
        date: item.date ? String(item.date) : '',
        href: resolveItemHref(item),
        thumbnail: resolveThumbUrl(stringValue(item.thumbnail || item.image || item.cover)),
      };
    })
    .filter((item): item is InsightItem => !!item);
}

const resolvedItems = computed(() => normalizeItems(resolveInput(props.items)));

const filteredItems = computed(() => {
  let items = resolvedItems.value;
  if (activeFilter.value !== 'all') {
    const f = activeFilter.value.toLowerCase();
    items = items.filter(it => it.category?.toLowerCase() === f || it.tag?.toLowerCase() === f);
  }
  return items.slice(0, props.limit);
});

const hasActions = computed(() => !!props.viewAllHref);

function handleFilterChange(value: string) {
  activeFilter.value = value;
  emit('filterChange', value);
}
</script>

<style scoped>
.nds-insights {
  margin: 3.2rem 0;
  width: 100%;
  container-type: inline-size;
}

.nds-insights__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
}

.nds-insights__title {
  flex: 1 1 320px;
  min-width: 0;
}

.nds-insights__eyebrow {
  margin: 0 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--vp-c-brand-1);
  opacity: 0.95;
}

.nds-insights__title-text {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  line-height: 1.14;
  letter-spacing: -0.02em;
  color: var(--nds-section-title);
  max-width: 34ch;
}

.nds-insights__subtitle {
  margin: 0.55rem 0 0;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--nds-section-muted);
  max-width: 60ch;
}

.nds-insights__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.nds-insights__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  margin: 0 auto 1.6rem;
  border-radius: 999px;
  border: 1px solid var(--nds-section-border);
  background: color-mix(in srgb, var(--nds-section-bg) 80%, transparent);
  width: fit-content;
}

.nds-insights__grid {
  display: grid;
  gap: 1.15rem;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
}

.layout-compact .nds-insights__grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 1rem;
}

.layout-masonry .nds-insights__grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  grid-auto-rows: 100px;
}

.layout-featured .nds-insights__grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 240px;
}

.layout-masonry .nds-insight:nth-child(3n + 1) {
  grid-row: span 3;
}

.layout-masonry .nds-insight:nth-child(3n + 2) {
  grid-row: span 2;
}

.layout-masonry .nds-insight:nth-child(3n + 3) {
  grid-row: span 2;
}

.nds-insight {
  height: 100%;
}

.nds-insight__card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nds-insight__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.nds-insight__media {
  height: 180px;
  overflow: hidden;
  background: color-mix(in srgb, var(--nds-section-bg) 75%, transparent);
}

.layout-compact .nds-insight__media {
  height: 140px;
}

.nds-insight__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  filter: saturate(1.02) contrast(1.03);
  transition: transform 520ms cubic-bezier(0.4, 0, 0.2, 1);
}

.nds-insight__body {
  flex: 1;
  padding-top: var(--nds-section-pad);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.nds-insight__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.68rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--nds-section-muted);
}

.nds-insight__pill {
  padding: 0.24rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--nds-section-title) 16%, transparent);
  color: var(--nds-section-title);
  border: 1px solid color-mix(in srgb, var(--nds-section-title) 18%, transparent);
}

.nds-insight__date {
  opacity: 0.9;
}

.nds-insight__title {
  margin: 0;
  font-size: 1.06rem;
  line-height: 1.28;
  letter-spacing: -0.01em;
  color: var(--nds-section-title);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.layout-compact .nds-insight__title {
  font-size: 0.98rem;
}

.nds-insight__excerpt {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.62;
  color: var(--nds-section-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nds-insight__cta {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.nds-insights__empty {
  margin: 0;
  padding: 3.5rem 1.75rem;
  text-align: center;
  font-size: 0.98rem;
  color: var(--nds-section-muted);
  background: var(--nds-section-bg);
  border: 1px dashed var(--nds-section-border);
  border-radius: var(--nds-section-radius);
}

@container (max-width: 960px) {
  .layout-featured .nds-insights__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 240px;
  }
}

@container (max-width: 640px) {
  .layout-featured .nds-insights__grid,
  .layout-masonry .nds-insights__grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
}
</style>
