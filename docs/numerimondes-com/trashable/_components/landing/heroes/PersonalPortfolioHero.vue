<template>
  <section class="portfolio-hero">
    <div class="portfolio-content">
      <div class="profile-image">
        <slot name="image">
          <div class="image-placeholder">Profile</div>
        </slot>
      </div>

      <h1 class="name">{{ name }}</h1>
      <p class="role">{{ role }}</p>
      <p v-if="bio" class="bio">{{ bio }}</p>

      <div class="cta-group">
        <a v-if="primaryCtaHref" :href="primaryCtaHref" class="cta-primary">
          {{ primaryCtaText }}
        </a>
        <a v-if="secondaryCtaHref" :href="secondaryCtaHref" class="cta-secondary">
          {{ secondaryCtaText }}
        </a>
      </div>

      <div v-if="stats && stats.length" class="stats">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'PersonalPortfolioHero' });
type Stat = { value: string; label: string };
type Props = {
  name?: string;
  role?: string;
  bio?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  stats?: Stat[];
};
withDefaults(defineProps<Props>(), {
  name: 'Alex Designer',
  role: 'Product Designer & Creative Director',
  bio: 'Crafting digital experiences that convert.',
  primaryCtaText: 'View work',
  primaryCtaHref: '#work',
  secondaryCtaText: 'Get in touch',
  secondaryCtaHref: '#contact',
  stats: () => [
    { value: '8+', label: 'Years' },
    { value: '120+', label: 'Projects' },
    { value: '4.9', label: 'Rating' },
  ],
});
</script>

<style scoped>
.portfolio-hero {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 80px;
}

.profile-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--vp-c-border);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.name {
  font-size: 40px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.role {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
}

.bio {
  font-size: 16px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

.cta-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.cta-primary,
.cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.cta-primary {
  color: #fff;
  background: var(--vp-c-brand-1);
}

.cta-primary:hover {
  background: var(--vp-c-brand-2);
}

.cta-secondary {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
}

.cta-secondary:hover {
  border-color: var(--vp-c-brand-1);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-border);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .stats {
    gap: 24px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
