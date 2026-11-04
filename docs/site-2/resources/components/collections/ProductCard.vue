<script setup lang="ts">
withDefaults(defineProps<{
  href: string
  image: string
  imageAlt?: string
  title: string
  category?: string
  status?: string
  description?: string
  actionLabel?: string
}>(), {
  imageAlt: '',
  category: '',
  status: '',
  description: '',
  actionLabel: 'Read policy',
})
</script>

<template>
  <article class="product-card">
    <a class="product-card__image" :href="href" :aria-label="title">
      <img :src="image" :alt="imageAlt || title" loading="lazy" />
      <span v-if="status" class="product-card__badge" :class="{ 'product-card__badge--draft': status.toLowerCase() === 'draft' }">{{ status }}</span>
    </a>

    <div class="product-card__details">
      <p v-if="category" class="product-card__category">{{ category }}</p>
      <h2><a :href="href">{{ title }}</a></h2>
      <p v-if="description" class="product-card__description">{{ description }}</p>
      <a class="product-card__action" :href="href">
        {{ actionLabel }}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  border-radius: 14px;
  background: var(--vp-c-bg);
  box-shadow: 0 3px 12px color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent);
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
}
.product-card:hover,
.product-card:focus-within {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 48%, var(--vp-c-divider));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent);
}
.product-card__image {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.product-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .25s ease;
}
.product-card:hover .product-card__image img { transform: scale(1.035); }
.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  max-width: calc(100% - 24px);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 92%, transparent);
  color: #fff;
  font-size: 11px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-card__badge--draft { background: #d97706; }
.product-card__details {
  display: flex;
  min-height: 190px;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
}
.product-card__category {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: .045em;
  text-transform: uppercase;
}
.product-card h2 { margin: 0; font-size: 17px; line-height: 1.4; }
.product-card h2 a { color: var(--vp-c-text-1); text-decoration: none; }
.product-card__description { margin: 9px 0 16px; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.55; }
.product-card__action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
}
.product-card__action svg { width: 16px; height: 16px; }
</style>
