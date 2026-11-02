---
title: "Initiatives | Numerimondes"
sidebarTitle: "Initiatives"
icon: "@spmpst::icon::rocket"
description: "Research and internal initiatives in development at Numerimondes."
lang: en
status: "ready-for-review"
---
<NmEffectHero
  :full-bleed="false"
  :effect="['silk', { inject: { color: '#141D2A' } }]"
  :hero-style="{ minHeight: '56vh' }"
  eyebrow="RESEARCH · PROTOTYPES · NEW VENTURES"
  title="Ideas taking shape."
  description="Our initiatives explore new tools, services and standards. Each is presented with its current status and the work still ahead."
  :title-style-light="{ color: '#ffffff' }"
  :title-style-dark="{ color: '#ffffff' }"
  :description-style-light="{ color: '#e2e8f0' }"
  :description-style-dark="{ color: '#e2e8f0' }"
  :buttons="[{ label: 'Discuss an idea', href: '/company/contact?topic=innovation' }, { label: 'How we innovate', href: '/company/innovation/', style: 'secondary' }]"
/>

<div class="nm-home-copy">

## Work in progress, shared clearly.

These internal initiatives are at different stages of development. Their pages describe the current direction without presenting planned capabilities as launched products.

<MegaCards
  :items="[
    { title: 'Feluqa', description: 'A Rust-based application framework in development.', href: '/company/innovation/initiatives/feluqa/', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', icon: '/images/home/initiatives/feluqa.svg' },
    { title: 'The Best Recruit', description: 'A recruitment and talent initiative being prepared for launch.', href: '/company/innovation/initiatives/the-best-recruit/', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80', icon: '/images/home/initiatives/the-best-recruit.svg' },
    { title: 'SPMPST', description: 'A draft specification for portable structured Markdown site trees.', href: '/company/innovation/initiatives/spmpst/', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', icon: '/images/home/initiatives/spmpst.svg' }
  ]"
  :composition="[{ items: [0, 1] }, { items: [2] }]"
  :card-height="220"
/>

<FeluqaButton tag="a" href="/company/contact?topic=innovation" label="Discuss a collaboration" />

</div>
