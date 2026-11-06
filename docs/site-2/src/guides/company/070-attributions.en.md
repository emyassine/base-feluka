---
title: "Attributions"
sidebarTitle: "Attributions"
icon: "@spmpst::icon::images"
layout: home
---


<div style="margin-top: 2rem">
    <NmBrandHero
      eyebrow="Brandkit // Attributions"
      title="Attributions"
      tagline="The image credits behind our brand"
      cta-label="Explore Attributions"
      cta-href="#nm-brand-index"
    />
  </div>

  <NmBrandOverview :sections="[{ columns: [{ label: 'BrandKit®', title: 'Image Credits' }, { tagline: 'Every image has a source and a story', description: 'Explore the visual resources used across our brand and website. Each image links to its full-size file and lists its creator and license where applicable.' }] }]" />

  <NmBrandIndex
    title="Attributions Index"
    :columns="1"
    :groups="[
      { number: '1', title: 'Images', href: '#attributions', items: [
        { number: '1', title: 'Image Credits', href: '#attributions' }
      ] }
    ]"
  />

  <NmBrandAttributions
    eyebrow="Attributions // Images"
    title="Image Credits"
    description="Images used in our legal and policy pages, with their source and license credits. Select an image to view its full-size file."
  />

  <NmBrandFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
