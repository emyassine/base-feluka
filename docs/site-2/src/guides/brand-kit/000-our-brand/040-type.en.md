---
title: "Type"
sidebarTitle: "Type"
icon: "@spmpst::icon::type"
layout: home
---

<BrandKitWrapper>
  <BrandKitTopBar brand="Numerimondes' Brand Kit" :show-border="false" :groups="[
    { title: 'Logo', href: '/brand-kit/our-brand/logo' },
    { title: 'Colors', href: '/brand-kit/our-brand/colors' },
    { title: 'Type', href: '/brand-kit/our-brand/type' },
    { title: 'Photos', href: '/brand-kit/our-brand/photos' },
    { title: 'Icons', href: '/brand-kit/our-brand/icons' }
  ]" />

  <div style="margin-top: 2rem">
    <BrandKitHero eyebrow="Brandkit // Type" title="Type" tagline="Our typography is the structure for our brand voice" cta-label="Explore Type" cta-href="#brand-kit-index" />
  </div>

  <BrandKitOverview label="BrandKit®" title="Typography" tagline="Typography is the brand’s voice in written form" description="Typography is the brand’s voice in written form—it shapes how confident, modern, and trustworthy we feel before anyone reads the message. Our type system is built for clarity and character: strong hierarchy, generous spacing, and a calm rhythm that works across product UI, marketing, and long-form content. This section defines our fonts, sizing, and usage rules so every headline and paragraph feels unmistakably on-brand." />
  <BrandKitIndex title="Type Index" :columns="1" :groups="[
    { number: '1', title: 'Type', href: '#typeface', items: [
      { number: '1', title: 'Our Typeface', href: '#typeface' },
      { number: '2', title: 'Type Scale', href: '#type-scale' },
      { number: '3', title: 'Type In Use', href: '#type-in-use' }
    ] }
  ]" />

  <BrandKitTypeSection id="typeface" eyebrow="Type // Typeface" title="Our Typeface" kind="typeface"
    description="Uncut Sans is yet another slightly quirky sans serif, designed with absolutely no investigation or research into any other typefaces from any specific time period."
  />

  <BrandKitTypeSection id="type-scale" eyebrow="Type // Scale" title="Type Scale" kind="scale"
    description="Our typographic scale creates consistent hierarchy across every surface—product UI, marketing pages, docs, and decks."
    :items="[
      { name: 'Scale 1', size: 15 }, { name: 'Scale 2', size: 12 },
      { name: 'Scale 3', size: 9 }, { name: 'Scale 4', size: 7 },
      { name: 'Scale 5', size: 5.5 }, { name: 'Scale 6', size: 4.5 },
      { name: 'Scale 7', size: 3.7 }, { name: 'Scale 8', size: 3 },
      { name: 'Scale 9', size: 2.5 }, { name: 'Scale 10', size: 2 },
      { name: 'Scale 11', size: 1.6 }, { name: 'Scale 12', size: 1.3 }
    ]"
  />

  <BrandKitTypeSection id="type-in-use" eyebrow="Type // In Use" title="Type In Use" kind="use"
    description="Our type lockups are pre-built combinations of headline, subhead, and supporting text for consistent hierarchy."
    :cities="[
      { name: 'Montreal', code: 'A192', time: '11.50.00' }, { name: 'Tokyo', code: 'B432', time: '10.12.00' },
      { name: 'Toronto', code: 'B547', time: '12.12.00' }, { name: 'Chicago', code: 'Y783', time: '13.45.00' },
      { name: 'Berlin', code: 'S327', time: '19.01.00' }, { name: 'Hong Kong', code: 'K540', time: '14.30.00' },
      { name: 'Dublin', code: 'L341', time: '20.10.00' }, { name: 'Bangkok', code: 'U783', time: '17.20.00' },
      { name: 'Lisbon', code: 'A439', time: '22.00.00' }, { name: 'Prague', code: 'H633', time: '19.23.00' },
      { name: 'Rome', code: 'N948', time: '23.13.00' }, { name: 'Hanoi', code: 'J786', time: '19.46.00' }
    ]"
    :paragraphs="[
      'Typography is our core brand element—a cornerstone of our design. We use type to create clear hierarchy and a distinct voice across every format.',
      'Our typographic system balances craft and clarity. Consistent sizing, spacing, and alignment help every message feel considered and recognizable.',
      'From product interfaces to editorial layouts, our type choices build atmosphere while keeping information easy to read.',
      'Use the approved typefaces and scales together with our logo, colors, and icons to keep every expression cohesive.'
    ]"
  />

  <BrandKitFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
</BrandKitWrapper>
