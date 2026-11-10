<template>
  <section aria-label="Client highlights">
    <div class="mini-cards__grid">
      <article v-for="card in cards" :key="card.id" class="mini-cards__card">
        <div class="mini-cards__media">
          <img v-if="card.logo" :src="card.logo" :alt="card.alt" loading="lazy" decoding="async" />
          <span v-else class="mini-cards__logo-text">{{ card.logoText }}</span>
        </div>

        <p class="mini-cards__copy">
          <strong>{{ card.strong }}</strong> {{ card.rest }}
        </p>

        <NDCButton
          class=""
          :href="card.href"
          :target="card.target"
          :rel="card.rel"
          :pill="false"
          variant="pure-blackwhite"
        >
          {{ card.cta }}
        </NDCButton>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import NDCButton from '../base/NDCButton.vue';

type MiniCard = {
  id: string;
  logo?: string;
  logoText?: string;
  alt?: string;
  strong: string;
  rest: string;
  cta: string;
  href: string;
  target?: string;
  rel?: string;
};

const props = withDefaults(
  defineProps<{
    items?: MiniCard[];
  }>(),
  {
    items: () => [
      {
        id: 'cartoon-network',
        logo: 'https://images.ctfassets.net/w8fc6tgspyjz/1rrj1tD4Wq3DQ9rAW7CO6P/727df59b72ef077b2ce62ac428aa4722/logo.svg',
        alt: 'Cartoon Network',
        strong: 'Increased output by 2x',
        rest: 'in half the time.',
        cta: 'Read story',
        href: 'https://clickup.com/customers/cartoon-network',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        id: 'vmware',
        logo: 'https://images.ctfassets.net/w8fc6tgspyjz/4dWKPZPy9BESbt8DhJkOqD/7c68f83a801af701117e9d11ea280d17/logo_container.svg',
        alt: 'VMware',
        strong: 'Reduced time to market',
        rest: 'with accelerated operations.',
        cta: 'Read story',
        href: 'https://clickup.com/customers/vmware',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        id: 'youtube',
        logo: 'https://images.ctfassets.net/w8fc6tgspyjz/1s1xw3K70C7VA7xMp58l5Z/3b48726d53b2e35a4b4a9b8cdbd35b98/youtube.svg',
        alt: 'YouTube',
        strong: 'Saved 6h a week',
        rest: 'with automated workflows.',
        cta: 'Watch story',
        href: 'https://www.youtube.com/watch?v=EP6XwQCqsAo',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ],
  }
);

const cards = props.items;
</script>

<style scoped>
.mini-cards {
  max-width: min(1100px, 100%);
  margin: 0 auto;
}

.mini-cards__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.mini-cards__card {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 85%, white);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: grid;
  gap: 0.75rem;
  align-content: start;
  min-height: 170px;
}

.mini-cards__media img {
  height: 40px;
  width: auto;
  max-width: 100%;
  display: block;
}

.mini-cards__logo-text {
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
}

.mini-cards__copy {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-cards__copy strong {
  color: var(--vp-c-text-1);
  font-weight: 650;
}

.mini-cards__action {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
