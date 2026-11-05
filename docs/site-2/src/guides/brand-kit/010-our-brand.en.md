---
title: "Our Brand"
sidebarTitle: "Our Brand"
icon: "@spmpst::icon::sparkles"
layout: home
---

<BrandKitWrapper>
	<div style="display:none;">
	  <BrandKitTopBar
	    brand="Numerimondes' Brand Kit"
	    :show-border="false"
	    :groups="[
	      { title: 'Logo', href: '/brand-kit/logo' },
	      { title: 'Colors', href: '/brand-kit/colors' },
	      { title: 'Type', href: '/brand-kit/type' },
	      { title: 'Photos', href: '/brand-kit/photos' },
	      { title: 'Icons', href: '/brand-kit/icons' }
	    ]"
	  />
	</div>
	<div style="margin-top:2rem;">
	  <BrandKitHero
	    eyebrow="By El Moumen Yassine"
	    title="<span style='font-family:DM Sans;'>Numerimondes</span>"
	    tagline="Our brand identity system"
	    cta-label="Explore"
	    cta-href="#brand-kit-index"
	  />
</div>

  <BrandKitOverview
    label="Overview"
    title="BrandKit®"
    tagline="A full scale brand design system"
    description="A complete system for keeping every element of a brand recognizable, consistent, and easy to manage."
  />

  <BrandKitIndex
    title="Index"
    :columns="2"
    :groups="[
      { number: '1', title: 'Logo', href: '/brand-kit/logo', items: [
        { number: '1.1', title: 'Logo Mark' },
        { number: '1.2', title: 'Construction' },
        { number: '1.3', title: 'Placement' },
        { number: '1.4', title: 'Color' }
      ] },
      { number: '2', title: 'Colors', href: '/brand-kit/colors', items: [
        { number: '2.1', title: 'Primary' },
        { number: '2.2', title: 'Secondary' },
        { number: '2.3', title: 'Shades' },
        { number: '2.4', title: 'Spectrum' },
        { number: '2.5', title: 'Combinations' }
      ] },
      { number: '3', title: 'Type', href: '/brand-kit/type', items: [
        { number: '3.1', title: 'Typeface' },
        { number: '3.2', title: 'Type Scale' },
        { number: '3.3', title: 'Type in Use' }
      ] },
      { number: '4', title: 'Photos', href: '/brand-kit/photos', items: [
        { number: '4.1', title: 'Principles' },
        { number: '4.2', title: 'Portraits' },
        { number: '4.3', title: 'Motion' },
        { number: '4.4', title: 'Texture' }
      ] },
      { number: '5', title: 'Icons', href: '/brand-kit/icons', items: [
        { number: '5.1', title: 'Library 1.5px' },
        { number: '5.2', title: 'Library 2px' }
      ] }
    ]"
  />

  <BrandKitFooter brand="BrandKit®" note="Brand identity system" />
</BrandKitWrapper>
