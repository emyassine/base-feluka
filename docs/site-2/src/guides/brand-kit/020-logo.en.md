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
      { src: '/images/brand-kit/logo/logo-mark.png', alt: 'Numerimondes logo mark' }
    ]"
    layout="stacked"
  />

  <BrandKitLogoSection
    id="construction"
    eyebrow="Logo // Construction"
    title="Construction"
    description="Clear spacing is built into the form, so the logo reads cleanly without relying on extra outlines or effects."
    :images="[
      { src: '/images/brand-kit/logo/construction.png', alt: 'Logo construction grid and proportions' }
    ]"
    layout="side"
  />

  <BrandKitLogoSection
    id="spacing-placement"
    eyebrow="Logo // Spacing"
    title="Spacing & Placement"
    description="Every element resolves to the same set of measurements, so the logo stays precise across print and digital. Always leave clear space around the mark equal to one icon height on every side."
    :images="[
      { src: '/images/brand-kit/logo/spacing-placement.png', alt: 'Logo spacing and placement guidance' }
    ]"
    layout="side"
  />

  <BrandKitLogoSection
    id="logo-colors"
    eyebrow="Logo // Color"
    title="Colors"
    description="Use the primary white logo whenever possible to preserve contrast and clarity. The color variations below show approved ways to place the mark."
    :images="[
      { src: '/images/brand-kit/logo/logo-color-1.png', alt: 'Logo color variation one' },
      { src: '/images/brand-kit/logo/logo-color-2.png', alt: 'Logo color variation two' },
      { src: '/images/brand-kit/logo/logo-color-3.png', alt: 'Logo color variation three' },
      { src: '/images/brand-kit/logo/logo-color-4.png', alt: 'Logo color variation four' }
    ]"
    layout="grid"
    :show-border="false"
  />

  <BrandKitFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
</BrandKitWrapper>
