---
title: "Logo"
sidebarTitle: "Logo"
icon: "@spmpst::icon::image"
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
  <div style="margin-top: 2rem">
    <BrandKitHero
      eyebrow="Brandkit // Logo"
      title="Logo"
      tagline="Our brand logo is the cornerstone of our identity"
      cta-label="Explore Logo"
      cta-href="#logo-index"
    />
  </div>

  <BrandKitOverview
    label="BrandKit®"
    title="The logo is our most recognizable shortcut, our most valuable asset."
    tagline="A mark that carries our personality, credibility, and intent at a glance."
    description="Use the logo consistently across every touchpoint, from a tiny app icon to a product label or billboard."
  />

  <BrandKitIndex
    title="Logo Index"
    :columns="1"
    :groups="[
      { number: '1', title: 'Logo', href: '#logo-mark', items: [
        { number: '1.1', title: 'Logo Mark' },
        { number: '1.2', title: 'Construction' },
        { number: '1.3', title: 'Space & Placement' },
        { number: '1.4', title: 'Colors' }
      ] }
    ]"
  />

  <BrandKitLogoSection
    id="logo-mark"
    eyebrow="Logo // Mark"
    title="Logo Mark"
    description="The logo is constructed from a simple geometric grid, with consistent angles and curves that mirror our design system."
    :images="[
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Numerimondes logo mark', style: 'background: linear-gradient(180deg, rgb(0, 25, 255) 27%, rgb(171, 214, 202) 100%)' }
    ]"
    layout="stacked"
    image-padding="10px"
  />

  <BrandKitLogoSection
    id="construction"
    eyebrow="Logo // Construction"
    title="Construction"
    description="Clear spacing is built into the form, so the logo reads cleanly without relying on extra outlines or effects."
    :images="[
      { src: '/images/brand-kit/logo/construction.png', alt: 'Logo construction grid and proportions', style: 'background: linear-gradient(180deg, rgb(0, 25, 255) 27%, rgb(171, 214, 202) 100%)' }
    ]"
    layout="side"
    image-padding="10px"
  />

  <BrandKitLogoSection
    id="spacing-placement"
    eyebrow="Logo // Spacing"
    title="Spacing & Placement"
    description="Every element resolves to the same set of measurements, so the logo stays precise across print and digital. Always leave clear space around the mark equal to one icon height on every side."
    :images="[
      { src: '/images/brand-kit/logo/spacing-placement.png', alt: 'Logo spacing and placement guidance', style: 'background: linear-gradient(180deg, rgb(0, 25, 255) 27%, rgb(171, 214, 202) 100%)' }
    ]"
    layout="side"
    image-padding="10px"
  />

  <BrandKitLogoSection
    id="logo-colors"
    eyebrow="Logo // Color"
    title="Colors"
    description="Use the primary white logo whenever possible to preserve contrast and clarity. The color variations below show approved ways to place the mark."
    :images="[
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Logo on blue to lilac gradient', dimensions: 'square', style: 'background: linear-gradient(#0019ff 27%, #c6abd6 100%)' },
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Logo on orange gradient', dimensions: 'square', style: 'background: linear-gradient(#e88d4d 46.0005%, #f46d0f 100%)' },
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Logo on magenta to cyan gradient', dimensions: 'square', style: 'background: linear-gradient(#e210e6 30.2858%, #35d5de 100%)' },
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Logo on cyan to green gradient', dimensions: 'square', style: 'background: linear-gradient(#17c8e3 46.0005%, #0af25f 100%)' }
    ]"
    layout="grid"
    image-padding="10px"
    :show-border="false"
  />

  <BrandKitFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
</BrandKitWrapper>
