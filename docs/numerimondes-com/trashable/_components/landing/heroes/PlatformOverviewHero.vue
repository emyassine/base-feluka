<template>
  <div class="VPHero">
    <section class="platform-hero">
      <div class="platform-content">
        <p v-if="eyebrow" class="eyebrow">
          {{ eyebrow }}
        </p>
        <h1 class="hero-title">
          <span class="text">
            <span v-html="title"></span>
          </span>
        </h1>
        <p v-if="subtitle" class="tagline">
          {{ subtitle }}
        </p>
        <div v-if="primaryCtaHref || secondaryCtaHref" class="actions">
          <div v-if="primaryCtaHref" class="action">
            <a class="VPButton medium brand" :href="primaryCtaHref">{{ primaryCtaText }}</a>
          </div>
          <div v-if="secondaryCtaHref" class="action">
            <a class="VPButton medium alt" :href="secondaryCtaHref">{{ secondaryCtaText }}</a>
          </div>
        </div>
        <div v-if="trialNote" class="trial-note">
          {{ trialNote }}
        </div>
      </div>
    </section>
  </div>
  <section class="platform-hero full-width">
    <CompactBrowser
      :radius="14"
      :inner-radius="12"
      :pad="10"
      :topbar-h="32"
      :border="`color-mix(in srgb, var(--vp-c-border) 80%, transparent)`"
      :bg="`color-mix(in srgb, var(--vp-c-bg-soft) 86%, transparent)`"
      :surface="`color-mix(in srgb, var(--vp-c-bg) 92%, transparent)`"
    />
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'PlatformOverviewHero' });

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  trialNote?: string;
  imageSrc?: string;
  imageAlt?: string;
  phoneImageSrc?: string;
  phoneImageAlt?: string;
  tabletImageSrc?: string;
  tabletImageAlt?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: 'All your tools in one platform',
  subtitle: 'Unified workflows, faster decisions, better outcomes.',
  primaryCtaText: 'Start free trial',
  primaryCtaHref: '#',
  secondaryCtaText: 'Watch demo',
  secondaryCtaHref: '#',
  trialNote: '14-day trial, no card required',
  imageAlt: 'Preview image',
  phoneImageAlt: 'Phone preview',
  tabletImageAlt: 'Tablet preview',
});
</script>

<style scoped>
.platform-hero {
  text-align: center;
  max-width: 1440px;
  margin: 0 auto;
}

.platform-hero.full-width {
  width: 100%;
  max-width: 1440px;
}

.eyebrow {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
}

.hero-title {
  display: block;
  margin-bottom: 24px;
}

.subtitle {
  font-size: 20px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0 auto 32px;
  max-width: 640px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.trial-note {
  font-size: 14px;
  color: var(--vp-c-text-3);
}
</style>
