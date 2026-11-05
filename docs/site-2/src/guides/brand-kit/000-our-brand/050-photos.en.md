---
title: "Photos"
sidebarTitle: "Photos"
icon: "@spmpst::icon::camera"
layout: home
---

<BrandKitWrapper>
  <div style="display:none;">
    <BrandKitTopBar brand="Numerimondes' Brand Kit" :show-border="false" :groups="[
      { title: 'Logo', href: '/brand-kit/our-brand/logo' },
      { title: 'Colors', href: '/brand-kit/our-brand/colors' },
      { title: 'Type', href: '/brand-kit/our-brand/type' },
      { title: 'Photos', href: '/brand-kit/our-brand/photos' },
      { title: 'Icons', href: '/brand-kit/our-brand/icons' }
    ]" />
  </div>

  <div style="margin-top: 2rem">
    <BrandKitHero eyebrow="Brandkit // Photo" title="Photos" tagline="Our photography is timeless but contemporary" cta-label="Explore Photo" cta-href="#brand-kit-index" background-image="/images/brand-kit/photos/main-photo.jpg" background-image-alt="BrandKit photographic direction"/>
  </div>

  <BrandKitOverview label="BrandKit®" title="Photography" tagline="Photography is where the brand feels most human" description="Photography is where the brand feels most human—it’s how we show mood, texture, and real-world credibility. Our visual style is grounded and intentional: natural light, honest moments, and compositions that feel calm but confident. This section defines the look and principles behind our imagery so every photo—product, people, or place—still feels like it came from the same world." />
  <BrandKitIndex title="Photo Index" :columns="1" :groups="[
    { number: '1', title: 'Photo', href: '#principles', items: [
      { number: '1', title: 'Principles', href: '#principles' }, { number: '2', title: 'Portraits', href: '#portraits' },
      { number: '3', title: 'Motion', href: '#motion' }, { number: '4', title: 'Textures', href: '#textures' }
    ] }
  ]" />

  <BrandKitPhotoSection id="principles" eyebrow="Photo // Principles" title="Principles"
    description="We chase atmosphere over perfection: rich shadows, selective light, textured environments, and moments that carry quiet tension or emotion."
    lead-image="/images/brand-kit/photos/principles.jpg" lead-alt="Atmospheric architectural photography" lead-background="#15191e" image-padding="0px" :columns="3"
    :items="[
      { src: '/images/brand-kit/photos/light.jpg', title: 'Light Creates the Story', description: 'We treat light as the main character. Prefer directional, imperfect light—window light, street lamps, overcast glow, late-afternoon sun.', background: '#d2c8bd', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/atmosphere.jpg', title: 'Atmosphere Over Clarity', description: 'Our images should feel textured and lived-in, not sterile. Embrace haze, rain, reflections, grain, motion blur, and environmental mess when it adds mood.', background: '#81756f', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/framing.jpg', title: 'Frame With Intention', description: 'Composition should be deliberate and cinematic: strong depth separation, controlled chaos, and negative space that creates calm tension.', background: '#b5aaa2', ratio: '1 / 1' }
    ]" />

  <BrandKitPhotoSection id="portraits" eyebrow="Photo // Portraits" title="Portraits"
    description="Capture presence over polish—natural expressions, intimate distance, and light that sculpts the face."
    :columns="3" :items="[
      { src: '/images/brand-kit/photos/main-photo.jpg', alt: 'Portrait in natural light', background: '#c5c1bd', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/portrait-2.jpg', alt: 'Portrait in an urban setting', background: '#8f8983', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/portrait-3.jpg', alt: 'Cinematic portrait', background: '#a59a92', ratio: '1 / 1' }
    ]" />

  <BrandKitPhotoSection id="motion" eyebrow="Photo // Motion" title="Motion"
    description="Use blur and movement intentionally to add energy, atmosphere, and a sense of time passing."
    :columns="3" :items="[
      { src: '/images/brand-kit/photos/motion-1.jpg', alt: 'Motion study one', background: '#847c76', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/motion-2.jpg', alt: 'Motion study two', background: '#34383b', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/motion-3.jpg', alt: 'Motion study three', background: '#b2a49a', ratio: '1 / 1' }
    ]" />

  <BrandKitPhotoSection id="textures" eyebrow="Photo // Textures" title="Textures"
    description="Seek surfaces that feel tactile—grain, fabric, skin, rain, dust—details that make the scene feel real."
    :columns="3" :items="[
      { src: '/images/brand-kit/photos/atmosphere.jpg', alt: 'Tactile atmosphere and surface', background: '#81756f', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/texture-2.jpg', alt: 'Textured surface study', background: '#a49b91', ratio: '1 / 1' },
      { src: '/images/brand-kit/photos/texture-3.jpg', alt: 'Material texture study', background: '#6c6862', ratio: '1 / 1' }
    ]" />

  <BrandKitFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
</BrandKitWrapper>
