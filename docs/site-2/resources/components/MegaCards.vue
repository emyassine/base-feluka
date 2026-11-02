<script setup lang="ts">
const cards = [
  {
    title: 'Feluqa — Coming soon',
    description: 'A Rust-based, cross-platform application framework under development, exploring efficient application systems across different deployment environments.',
    href: '/initiatives/feluqa',
  },
  {
    title: 'The Best Recruit — Coming soon',
    description: 'A recruitment and talent initiative being prepared to help employers discover and evaluate relevant profiles through a structured qualification process.',
    href: '/initiatives/the-best-recruit',
  },
  {
    title: 'SPMPST — Specification in development',
    description: 'A proposed standard for portable, structured Markdown content trees and site-building workflows. Currently an internal specification and research initiative.',
    href: '/initiatives/spmpst',
  },
]
</script>

<template>
  <div class="mega-cards">
    <article v-for="card in cards" :key="card.href" class="mega-cards__card">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
      <FeluqaButton tag="a" :href="card.href" label="Get Started" />
    </article>
  </div>
</template>

<style scoped>
.mega-cards {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}

.mega-cards__card {
  display: flex;
  min-width: 0;
  min-height: 190px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow-wrap: anywhere;
  transition: border-color .2s ease, transform .36s cubic-bezier(.22, 1, .36, 1);
}

.mega-cards__card:hover { border-color: var(--vp-c-brand-1); }
.mega-cards__card:nth-child(1) { animation-delay: .16s; }
.mega-cards__card:nth-child(2) { animation-delay: .1s; }
.mega-cards__card:nth-child(3) { animation-delay: .04s; }
.mega-cards__card { animation: mega-card-in .36s cubic-bezier(.22, 1, .36, 1) both; }
.mega-cards__card h3 { margin: 0; font-size: 1.05rem; }
.mega-cards__card p { flex: 1; margin: 0; color: var(--vp-c-text-2); font-size: .88rem; }

@media (max-width: 768px) {
  .mega-cards { grid-template-columns: minmax(0, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .mega-cards__card { animation: none; transition: none; }
}

@keyframes mega-card-in {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
