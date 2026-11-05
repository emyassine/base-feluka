<template>
  <div class="brand-kit-wrapper">
    <BrandKitTopBar :brand="brand" :groups="groups" />

    <main>
      <section class="brand-kit-hero" aria-labelledby="brand-kit-title">
        <p class="brand-kit-eyebrow">{{ eyebrow }}</p>
        <div class="brand-kit-hero__content">
          <h1 id="brand-kit-title">{{ title }}</h1>
          <div class="brand-kit-hero__bottom">
            <p>{{ tagline }}</p>
            <a href="#brand-kit-index">{{ ctaLabel }}</a>
          </div>
        </div>
      </section>

      <section id="brand-kit-overview" class="brand-kit-overview">
        <div>
          <p class="brand-kit-kicker">Overview</p>
          <h2>{{ overviewTitle }}</h2>
        </div>
        <div class="brand-kit-overview__copy">
          <p class="brand-kit-overview__tagline">{{ overviewTagline }}</p>
          <p>{{ introduction }}</p>
        </div>
      </section>

      <section id="brand-kit-index" class="brand-kit-index" aria-labelledby="brand-kit-index-title">
        <header class="brand-kit-index__header">
          <h2 id="brand-kit-index-title">Index</h2>
          <span>({{ itemCount }})</span>
        </header>

        <div class="brand-kit-groups">
          <section v-for="group in groups" :key="group.title" class="brand-kit-group">
            <header class="brand-kit-group__header">
              <span>{{ group.number }}</span>
              <a :href="group.href">{{ group.title }}</a>
            </header>
            <ol>
              <li v-for="item in group.items" :key="item.number">
                <a :href="group.href">
                  <span>{{ item.number }}</span>
                  <span>{{ item.title }}</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
      </section>
    </main>

    <footer class="brand-kit-footer">
      <span>{{ brand }}</span>
      <span>{{ footerNote }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface BrandKitItem {
  number: string
  title: string
}

interface BrandKitGroup {
  number: string
  title: string
  href: string
  items: BrandKitItem[]
}

const props = withDefaults(defineProps<{
  brand: string
  eyebrow: string
  title: string
  tagline: string
  ctaLabel: string
  overviewTitle: string
  overviewTagline: string
  introduction: string
  groups: BrandKitGroup[]
  footerNote?: string
}>(), {
  footerNote: 'Brand identity system',
})

const { brand, eyebrow, title, tagline, ctaLabel, overviewTitle, overviewTagline, introduction, groups, footerNote } = props
const itemCount = groups.reduce((total, group) => total + group.items.length, 0)
</script>

<style scoped>
.brand-kit-wrapper {
  --brand-kit-surface: var(--vp-c-bg);
  --brand-kit-surface-soft: var(--vp-c-bg-soft);
  --brand-kit-text: var(--vp-c-text-1);
  --brand-kit-muted: var(--vp-c-text-2);
  --brand-kit-line: var(--vp-c-divider);

  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: clip;
  color: var(--brand-kit-text);
  background: var(--brand-kit-surface);
  container-type: inline-size;
}

.brand-kit-wrapper main {
  display: block;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
}

.brand-kit-hero {
  position: relative;
  display: flex;
  min-height: clamp(30rem, 66vh, 48rem);
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  margin: 0;
  padding: clamp(1.5rem, 4cqw, 3.5rem);
  overflow: hidden;
  border: 1px solid var(--brand-kit-line);
  border-radius: 0.75rem;
  background:
    radial-gradient(ellipse at 78% 90%, color-mix(in srgb, var(--vp-c-brand-1) 76%, transparent), transparent 34%),
    linear-gradient(125deg, var(--brand-kit-surface-soft), var(--brand-kit-surface) 58%, var(--vp-c-brand-soft));
}

.brand-kit-eyebrow,
.brand-kit-kicker {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-hero__content {
  display: grid;
  gap: clamp(1.5rem, 4cqw, 3rem);
}

.brand-kit-hero h1 {
  max-width: 100%;
  margin: 0;
  font-size: clamp(3.25rem, 15cqw, 11rem);
  font-weight: 500;
  letter-spacing: -0.085em;
  line-height: 0.84;
  overflow-wrap: anywhere;
}

.brand-kit-hero__bottom {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-kit-hero__bottom p {
  max-width: 18ch;
  margin: 0;
  font-size: clamp(1.15rem, 2.7cqw, 2.2rem);
  line-height: 1.05;
}

.brand-kit-hero__bottom a {
  flex: none;
  padding: 0.7rem 0;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-size: 0.85rem;
  text-decoration: none;
}

.brand-kit-overview,
.brand-kit-index {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(2rem, 7cqw, 7rem);
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  border-bottom: 1px solid var(--brand-kit-line);
}

.brand-kit-overview h2,
.brand-kit-index__header h2 {
  margin: 1rem 0 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.brand-kit-overview__copy {
  display: grid;
  align-content: end;
  gap: 1rem;
}

.brand-kit-overview__copy p {
  max-width: 60ch;
  margin: 0;
  color: var(--brand-kit-muted);
  font-size: clamp(0.95rem, 1.25cqw, 1.15rem);
  line-height: 1.7;
}

.brand-kit-overview__copy .brand-kit-overview__tagline {
  color: var(--brand-kit-text);
  font-size: clamp(1.35rem, 2.3cqw, 2rem);
  line-height: 1.15;
}

.brand-kit-index {
  display: block;
  border-bottom: 0;
}

.brand-kit-index__header {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: clamp(2rem, 4cqw, 3rem);
}

.brand-kit-index__header h2 {
  margin: 0;
}

.brand-kit-index__header span {
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}

.brand-kit-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(1.5rem, 5cqw, 5rem);
}

.brand-kit-group {
  min-width: 0;
  padding: 1.1rem 0 1.4rem;
  border-top: 1px solid var(--brand-kit-line);
}

.brand-kit-group__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.brand-kit-group__header > span {
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
}

.brand-kit-group__header a {
  color: var(--brand-kit-text);
  font-size: 1.05rem;
  text-decoration: none;
}

.brand-kit-group ol {
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-kit-group li a {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.4rem 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  line-height: 1.4;
  text-decoration: none;
  text-transform: uppercase;
}

.brand-kit-group li a:hover {
  color: var(--vp-c-brand-1);
}

.brand-kit-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  padding: 1.25rem 0;
  border-top: 1px solid var(--brand-kit-line);
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@container (max-width: 680px) {
  .brand-kit-hero {
    min-height: 29rem;
  }

  .brand-kit-hero__bottom {
    align-items: start;
    flex-direction: column;
  }

  .brand-kit-overview {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .brand-kit-groups {
    grid-template-columns: 1fr;
  }
}
</style>
