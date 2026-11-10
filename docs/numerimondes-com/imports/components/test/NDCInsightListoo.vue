<template>
  <section
    :class="['insight-cards', `layout-${layout}`, rootClass]"
    :style="{
      ...rootStyle,
      margin: '3.2rem 0',
      width: '100%',
      containerType: 'inline-size',
    }"
    v-bind="rootAttrs"
  >
    <!-- Header -->
    <div
      v-if="eyebrow || title || filters.length || hasActions"
      :style="{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '1.2rem',
        marginBottom: '1.6rem',
      }"
    >
      <div :style="{ flex: '1 1 320px', minWidth: 0 }">
        <p
          v-if="eyebrow"
          :style="{
            margin: '0 0 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--vp-c-brand-1)',
            opacity: 0.95,
          }"
        >
          {{ eyebrow }}
        </p>

        <h2
          v-if="title"
          :style="{
            margin: 0,
            fontSize: 'clamp(1.5rem, 3vw, 2.35rem)',
            fontWeight: 450,
            lineHeight: 1.14,
            letterSpacing: '-0.02em',
            color: 'var(--vp-c-text-1)',
            maxWidth: '34ch',
          }"
        >
          {{ title }}
        </h2>
      </div>

      <div v-if="hasActions" :style="{ display: 'flex', gap: '0.75rem', alignItems: 'center' }">
        <NDCButton
          v-if="viewAllHref"
          :href="viewAllHref"
          variant="pure-gray"
          :size="buttonSize"
          pill
          icon="ArrowRight"
          iconPosition="right"
        >
          {{ viewAllText }}
        </NDCButton>
      </div>
    </div>

    <!-- Filters -->

    <div
      v-if="filters.length"
      :style="{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.55rem',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.35rem',
        marginBottom: '1.6rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '999px',
        border: '1px solid color-mix(in srgb, var(--vp-c-divider) 65%, transparent)',
        background: 'color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent)',

        width: 'fit-content',
      }"
    >
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
    <!-- Cards Grid -->
    <div v-if="filteredItems.length" :style="gridStyle" :class="['insight-cards__grid', `grid-${layout}`]">
      <!-- Featured Card -->
      <article
        v-if="layout === 'featured' && filteredItems[0]"
        :class="['insight-card', 'insight-card--featured', { 'is-flipped': flippedCards.has(filteredItems[0].id) }]"
        :style="{
          position: 'relative',
          perspective: '1100px',
          minHeight: '320px',
          borderRadius: '18px',
          gridColumn: featuredGridCol,
          gridRow: featuredGridRow,
        }"
      >
        <div
          class="insight-card__flipper"
          :style="{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 640ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flippedCards.has(filteredItems[0].id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }"
        >
          <!-- Front -->
          <div class="insight-card__front" :style="frontBaseStyle(true)">
            <component
              :is="filteredItems[0].href ? 'a' : 'div'"
              :href="filteredItems[0].href"
              :style="{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                color: 'inherit',
                textDecoration: 'none',
                cursor: filteredItems[0].href ? 'pointer' : 'default',
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
              }"
              :class="['insight-card__link', { 'is-clickable': !!filteredItems[0].href }]"
            >
              <div
                v-if="filteredItems[0].thumbnail"
                :style="{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  background: 'color-mix(in srgb, var(--vp-c-bg-alt) 55%, transparent)',
                }"
              >
                <img
                  :src="filteredItems[0].thumbnail"
                  :alt="filteredItems[0].title"
                  loading="lazy"
                  :style="{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.02)',
                    filter: 'saturate(1.05) contrast(1.05)',
                  }"
                />

                <!-- STRONG OVERLAY (the missing darkening) -->
                <div
                  :style="{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(1200px 600px at 10% 0%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.78) 100%)',
                    opacity: 1,
                  }"
                />

                <!-- Bottom gradient to keep text ultra readable -->
                <div
                  :style="{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.08) 72%, rgba(0,0,0,0) 100%)',
                    opacity: 1,
                  }"
                />
              </div>

              <!-- Content -->
              <div
                :style="{
                  position: 'relative',
                  zIndex: 1,
                  marginTop: 'auto',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  color: '#fff',
                }"
              >
                <div
                  v-if="filteredItems[0].category || filteredItems[0].date"
                  :style="{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.70rem',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    letterSpacing: '0.10em',
                    color: 'rgba(255,255,255,0.92)',
                  }"
                >
                  <span
                    v-if="filteredItems[0].category"
                    :style="{
                      padding: '0.28rem 0.55rem',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.16)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }"
                  >
                    {{ filteredItems[0].category }}
                  </span>

                  <span v-if="filteredItems[0].date" :style="{ opacity: 0.95 }">
                    {{ filteredItems[0].date }}
                  </span>
                </div>

                <h3
                  :style="{
                    margin: 0,
                    fontSize: 'clamp(1.3rem, 2.25vw, 1.95rem)',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    fontWeight: 720,
                    textWrap: 'balance',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }"
                >
                  {{ filteredItems[0].title }}
                </h3>

                <p
                  v-if="filteredItems[0].excerpt"
                  :style="{
                    margin: 0,
                    fontSize: '1.02rem',
                    lineHeight: 1.62,
                    color: 'rgba(255,255,255,0.86)',
                    maxWidth: '64ch',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }"
                >
                  {{ filteredItems[0].excerpt }}
                </p>
              </div>
            </component>

            <!-- Flip Button -->
            <NDCButton
              v-if="filteredItems[0].summary"
              class="insight-card__flip-btn"
              variant="blackwhite"
              size="sm"
              iconOnly
              pill
              icon="FileText"
              aria-label="View summary"
              @click.prevent="toggleFlip(filteredItems[0].id)"
              :style="{
                position: 'absolute',
                top: '0.9rem',
                right: '0.9rem',
                zIndex: 3,
                boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
              }"
            />

            <!-- Open Button -->
            <NDCButton
              v-if="filteredItems[0].href"
              class="insight-card__open-btn"
              variant="primary"
              size="sm"
              pill
              icon="ExternalLink"
              iconPosition="right"
              :href="filteredItems[0].href"
              :style="{
                position: 'absolute',
                bottom: '0.95rem',
                right: '0.95rem',
                zIndex: 3,
                boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
              }"
            >
              Open
            </NDCButton>
          </div>

          <!-- Back -->
          <div v-if="filteredItems[0].summary" class="insight-card__back" :style="backBaseStyle">
            <div :style="{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }">
              <h4
                :style="{
                  margin: '0 0 0.9rem',
                  fontSize: '1.05rem',
                  fontWeight: 750,
                  letterSpacing: '-0.01em',
                  color: 'var(--vp-c-brand-1)',
                }"
              >
                Summary
              </h4>
              <p
                :style="{
                  margin: 0,
                  fontSize: '0.98rem',
                  lineHeight: 1.75,
                  color: 'var(--vp-c-text-1)',
                }"
              >
                {{ filteredItems[0].summary }}
              </p>
            </div>

            <NDCButton
              class="insight-card__flip-back-btn"
              variant="ghost"
              size="sm"
              iconOnly
              pill
              icon="X"
              aria-label="Back to card"
              @click.prevent="toggleFlip(filteredItems[0].id)"
              :style="{
                position: 'absolute',
                top: '0.85rem',
                right: '0.85rem',
              }"
            />
          </div>
        </div>
      </article>

      <!-- Regular Cards -->
      <article
        v-for="item in regularCards"
        :key="item.id"
        :class="['insight-card', { 'is-flipped': flippedCards.has(item.id) }]"
        :style="{
          position: 'relative',
          perspective: '1100px',
          minHeight: layout === 'compact' ? '180px' : '220px',
          borderRadius: '16px',
        }"
      >
        <div
          class="insight-card__flipper"
          :style="{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 640ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flippedCards.has(item.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }"
        >
          <!-- Front -->
          <div class="insight-card__front" :style="frontBaseStyle(false)">
            <component
              :is="item.href ? 'a' : 'div'"
              :href="item.href"
              :style="{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                cursor: item.href ? 'pointer' : 'default',
                borderRadius: '16px',
                overflow: 'hidden',
              }"
              :class="['insight-card__link', { 'is-clickable': !!item.href }]"
            >
              <div
                v-if="showThumbnails && item.thumbnail"
                :style="{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  background: 'color-mix(in srgb, var(--vp-c-bg-alt) 55%, transparent)',
                }"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  loading="lazy"
                  :style="{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 520ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1.01)',
                    filter: 'saturate(1.02) contrast(1.03)',
                  }"
                />
                <!-- subtle overlay for ALL cards to improve readability -->
                <div
                  :style="{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 60%)',
                    opacity: 0.75,
                    pointerEvents: 'none',
                  }"
                />
              </div>

              <div
                :style="{
                  flex: 1,
                  padding: layout === 'compact' ? '0.95rem' : '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }"
              >
                <div
                  v-if="showMeta && (item.category || item.date)"
                  :style="{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.68rem',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    letterSpacing: '0.10em',
                    color: 'var(--vp-c-text-2)',
                  }"
                >
                  <span
                    v-if="item.category"
                    :style="{
                      padding: '0.24rem 0.5rem',
                      borderRadius: '999px',
                      background: 'color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent)',
                      color: 'var(--vp-c-brand-1)',
                      border: '1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent)',
                    }"
                  >
                    {{ item.category }}
                  </span>

                  <span v-if="item.date" :style="{ opacity: 0.9 }">{{ item.date }}</span>
                </div>

                <h3
                  :style="{
                    margin: 0,
                    fontSize: layout === 'compact' ? '0.98rem' : '1.06rem',
                    fontWeight: 720,
                    lineHeight: 1.28,
                    letterSpacing: '-0.01em',
                    color: 'var(--vp-c-text-1)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }"
                >
                  {{ item.title }}
                </h3>

                <p
                  v-if="showExcerpt && item.excerpt"
                  :style="{
                    margin: 0,
                    fontSize: '0.90rem',
                    lineHeight: 1.62,
                    color: 'var(--vp-c-text-2)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }"
                >
                  {{ item.excerpt }}
                </p>
              </div>
            </component>

            <!-- Action Buttons -->
            <div
              class="insight-card__actions"
              :style="{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                opacity: 1,
                zIndex: 3,
              }"
            >
              <NDCButton
                v-if="item.summary"
                variant="blackwhite"
                size="xs"
                iconOnly
                pill
                icon="FileText"
                aria-label="View summary"
                @click.prevent="toggleFlip(item.id)"
                :style="{ boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }"
              />
              <NDCButton
                v-if="item.href"
                variant="ghost"
                size="xs"
                iconOnly
                pill
                icon="ExternalLink"
                aria-label="Open article"
                :href="item.href"
                :style="{ boxShadow: '0 8px 18px rgba(0,0,0,0.12)' }"
              />
            </div>
          </div>

          <!-- Back -->
          <div v-if="item.summary" class="insight-card__back" :style="backBaseStyle">
            <div :style="{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }">
              <h4
                :style="{
                  margin: '0 0 0.9rem',
                  fontSize: '1.02rem',
                  fontWeight: 750,
                  letterSpacing: '-0.01em',
                  color: 'var(--vp-c-brand-1)',
                }"
              >
                Summary
              </h4>
              <p
                :style="{
                  margin: 0,
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  color: 'var(--vp-c-text-1)',
                }"
              >
                {{ item.summary }}
              </p>
            </div>

            <NDCButton
              class="insight-card__flip-back-btn"
              variant="ghost"
              size="sm"
              iconOnly
              pill
              icon="X"
              aria-label="Back to card"
              @click.prevent="toggleFlip(item.id)"
              :style="{
                position: 'absolute',
                top: '0.85rem',
                right: '0.85rem',
              }"
            />
          </div>
        </div>
      </article>
    </div>

    <p
      v-else
      :style="{
        margin: 0,
        padding: '3.5rem 1.75rem',
        textAlign: 'center',
        fontSize: '0.98rem',
        color: 'var(--vp-c-text-2)',
        background: 'var(--vp-c-bg-soft)',
        border: '1px dashed color-mix(in srgb, var(--vp-c-divider) 70%, transparent)',
        borderRadius: '14px',
      }"
    >
      {{ emptyText }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';

defineOptions({ inheritAttrs: false });

type RawQuery = (pathLike: unknown, fallback?: unknown) => unknown;
type ItemRecord = Record<string, unknown>;

type InsightItem = {
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

type Filter = {
  label: string;
  value: string;
};

type Layout = 'grid' | 'featured' | 'compact' | 'masonry';

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

const internalQuery = () => {
  if (Array.isArray(props.items)) return props.items;
  return [];
};
const locale = computed(() => (props.locale || 'en').toLowerCase());
const profile = computed(() => props.profile || '');

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1568394696869-8f44d26d11bc?q=80&w=1470&auto=format&fit=crop';

// State
const activeFilter = ref(props.defaultFilter);
const flippedCards = ref(new Set<string>());

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
        thumbnail: resolveThumbUrl(String(item.thumbnail || '').trim()),
      };
    })
    .filter((entry): entry is InsightItem => entry !== null);
}

const rawType = computed(() => resolveInput(props.type, null));
const rawItems = computed(() => {
  const resolved = resolveInput(props.items, null);
  if (Array.isArray(resolved)) return resolved;
  if (resolved && typeof resolved === 'object' && Array.isArray((resolved as any).items))
    return (resolved as any).items;
  if (rawType.value && typeof rawType.value === 'object' && Array.isArray((rawType.value as any).items))
    return (rawType.value as any).items;
  return [];
});

const allItems = computed(() => normalizeItems(rawItems.value));

const filteredItems = computed(() => {
  let items = allItems.value;

  if (activeFilter.value !== 'all') {
    const f = activeFilter.value.toLowerCase();
    items = items.filter(it => it.category?.toLowerCase() === f || it.tag?.toLowerCase() === f);
  }

  return items.slice(0, props.limit);
});

const regularCards = computed(() => (props.layout === 'featured' ? filteredItems.value.slice(1) : filteredItems.value));

const hasActions = computed(() => !!props.viewAllHref);

function toggleFlip(id: string) {
  const next = new Set(flippedCards.value);
  next.has(id) ? next.delete(id) : next.add(id);
  flippedCards.value = next;
}

function handleFilterChange(value: string) {
  activeFilter.value = value;
  emit('filterChange', value);
}

/* =========================
   Inline-style helpers
   ========================= */

const gridStyle = computed(() => {
  const base: Record<string, any> = {
    display: 'grid',
    gap: '1.15rem',
    width: '100%',
  };

  if (props.layout === 'featured') {
    return {
      ...base,
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gridAutoRows: '200px',
    };
  }

  if (props.layout === 'compact') {
    return {
      ...base,
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
      gap: '1rem',
    };
  }

  if (props.layout === 'masonry') {
    return {
      ...base,
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
      gridAutoRows: '100px',
    };
  }

  // grid
  return {
    ...base,
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
  };
});

const featuredGridCol = computed(() => {
  // Works with your existing CSS containers too, but keeps the featured big on wide screens.
  return '1 / 3';
});

const featuredGridRow = computed(() => '1 / 3');

function frontBaseStyle(isFeatured: boolean): Record<string, any> {
  return {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: isFeatured ? '18px' : '16px',
    overflow: 'hidden',
    background: 'var(--vp-c-bg-soft)',
    border: `1px solid color-mix(in srgb, var(--vp-c-divider) ${isFeatured ? 55 : 65}%, transparent)`,
    boxShadow: isFeatured ? '0 22px 55px rgba(0,0,0,0.18)' : '0 14px 34px rgba(0,0,0,0.12)',
  };
}

const backBaseStyle = computed<Record<string, any>>(() => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '16px',
  overflow: 'hidden',
  transform: 'rotateY(180deg)',
  background: 'var(--vp-c-bg-soft)',
  border: '1px solid color-mix(in srgb, var(--vp-c-brand-1) 65%, transparent)',
  boxShadow: '0 18px 46px rgba(0,0,0,0.14)',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
}));
</script>

<style scoped>
/* Minimal CSS kept only for: responsive featured grid + masonry spans + reduced motion.
   Everything else is inline as requested. */

@container (max-width: 960px) {
  .grid-featured {
    grid-template-columns: repeat(2, 1fr) !important;
    grid-auto-rows: 220px !important;
  }
  .layout-featured .insight-card--featured {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
}

@container (max-width: 640px) {
  .grid-featured,
  .grid-masonry {
    grid-template-columns: 1fr !important;
    grid-auto-rows: auto !important;
  }
  .layout-featured .insight-card--featured {
    min-height: 340px !important;
  }
}

/* Masonry approximation (kept CSS, because inline can't target nth-child) */
.grid-masonry .insight-card:nth-child(3n + 1) {
  grid-row: span 3;
}
.grid-masonry .insight-card:nth-child(3n + 2) {
  grid-row: span 2;
}
.grid-masonry .insight-card:nth-child(3n + 3) {
  grid-row: span 2;
}

@media (prefers-reduced-motion: reduce) {
  .insight-card__flipper {
    transition: none !important;
  }
  .insight-card.is-flipped .insight-card__flipper {
    transform: none !important;
  }
}
</style>
