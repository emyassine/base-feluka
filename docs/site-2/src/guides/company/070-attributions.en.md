---
title: "Attributions"
sidebarTitle: "Attributions"
icon: "@spmpst::icon::images"
layout: home
---

<BrandKitWrapper>
  <FloatingTopBar logo="/media/favicon.png" logo-alt="Numerimondes" home-href="/company" title="Overview" :show-border="false" :links="[
        { title: 'Logo', href: '/company/logo' },
    { title: 'Colors', href: '/company/colors' },
    { title: 'Type', href: '/company/type' },
    { title: 'Photos', href: '/company/photos' },
    { title: 'Icons', href: '/company/icons' },
    { title: 'Attributions', href: '/company/attributions' }
  ]" />

  <div style="margin-top: 2rem">
    <BrandKitHero
      eyebrow="Brandkit // Attributions"
      title="Attributions"
      tagline="The image credits behind our brand"
      cta-label="Explore Attributions"
      cta-href="#brand-kit-index"
    />
  </div>

  <BrandKitOverview :sections="[{ columns: [{ label: 'BrandKit®', title: 'Image Credits' }, { tagline: 'Every image has a source and a story', description: 'Explore the visual resources used across our brand and website. Each image links to its full-size file and lists its creator and license where applicable.' }] }]" />

  <BrandKitIndex
    title="Attributions Index"
    :columns="1"
    :groups="[
      { number: '1', title: 'Images', href: '#attributions', items: [
        { number: '1', title: 'Image Credits', href: '#attributions' }
      ] }
    ]"
  />

  <BrandKitAttributions
    eyebrow="Attributions // Images"
    title="Image Credits"
    description="Images used in our legal and policy pages, with their source and license credits. Select an image to view its full-size file."
  />

  <BrandKitFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
</BrandKitWrapper>
