<template>
  <section class="search-hero">
    <div class="search-content">
      <h1 class="title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <form class="search-form" @submit.prevent>
        <div class="search-input-group">
          <input type="text" :placeholder="searchPlaceholder" class="search-input" />
          <button type="submit" class="search-button">
            {{ searchButtonText }}
          </button>
        </div>
      </form>

      <div v-if="popularSearches && popularSearches.length" class="popular-searches">
        <span class="popular-label">Popular:</span>
        <a v-for="(search, index) in popularSearches" :key="index" :href="search.href" class="popular-link">
          {{ search.text }}
        </a>
      </div>

      <div v-if="trustIndicators && trustIndicators.length" class="trust-indicators">
        <div v-for="(indicator, index) in trustIndicators" :key="index" class="trust-item">
          {{ indicator }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'SearchDiscoveryHero' });
type PopularSearch = { text: string; href: string };
type Props = {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchButtonText?: string;
  popularSearches?: PopularSearch[];
  trustIndicators?: string[];
};
withDefaults(defineProps<Props>(), {
  title: 'Find what you need',
  subtitle: 'Search thousands of options, personalized for you.',
  searchPlaceholder: 'Where do you want to go?',
  searchButtonText: 'Search',
  popularSearches: () => [],
  trustIndicators: () => ['10M+ listings', '500K+ reviews', 'Best price guarantee'],
});
</script>

<style scoped>
.search-hero {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 80px;
  padding: 48px 0;
}

.title {
  font-size: 48px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .title {
    font-size: 56px;
  }
}

.subtitle {
  font-size: 18px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

.search-form {
  margin-bottom: 20px;
}

.search-input-group {
  display: flex;
  gap: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-button {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.search-button:hover {
  background: var(--vp-c-brand-2);
}

.popular-searches {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
  font-size: 14px;
}

.popular-label {
  color: var(--vp-c-text-3);
}

.popular-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
}

.popular-link:hover {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.trust-indicators {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-border);
}

.trust-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .search-input-group {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}
</style>
