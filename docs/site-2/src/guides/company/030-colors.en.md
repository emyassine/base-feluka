---
title: "Colors"
sidebarTitle: "Colors"
icon: "@spmpst::icon::palette"
layout: home
---


<div style="margin-top: 2rem">
    <NmBrandHero
      eyebrow="Brandkit // Color"
      title="Color"
      tagline="Our brand colors showcase our voice"
      cta-label="Explore Color"
      cta-href="#color-index"
    />
  </div>

  <NmBrandOverview :sections="[{ columns: [{ label: 'BrandKit®', title: 'Color' }, { tagline: 'Color is one of the fastest ways our brand is recognized', description: 'Color sets the mood before a single word is read. Our palette is designed to feel confident and modern: bold enough to stand out, restrained enough to stay timeless. This section defines our core colors, supporting tones, and usage rules so every screen, slide, and surface looks unmistakably like us.' }] }]" />

  <NmBrandIndex
    title="Color Index"
    :columns="1"
    :groups="[
      { number: '1', title: 'Color', href: '#primary-palette', items: [
        { number: '1', title: 'Primary Palette', href: '#primary-palette' },
        { number: '2', title: 'Secondary Palette', href: '#secondary-palette' },
        { number: '3', title: 'Shades', href: '#shades' },
        { number: '4', title: 'Color Spectrum', href: '#spectrum' },
        { number: '5', title: 'Combinations', href: '#combinations' }
      ] }
    ]"
  />

  <NmBrandColorSection
    id="primary-palette"
    eyebrow="Color // Primary Palette"
    title="Primary Palette"
    description="Our primary palette is a tight set of core colors used to anchor the brand in high-contrast and instantly recognizable ways."
    kind="palette"
    :columns="5"
    :items="[
      { name: 'Deep Blue', token: 'P—001', hex: '#0019FF', textColor: '#fff' },
      { name: 'Black', token: 'P—002', hex: '#050505', textColor: '#fff' },
      { name: 'Off White', token: 'P—003', hex: '#F5F1E6', textColor: '#111' },
      { name: 'Orange', token: 'P—004', hex: '#FF8063', textColor: '#111' },
      { name: 'Teal', token: 'P—005', hex: '#BBFFF2', textColor: '#111' }
    ]"
  />

  <NmBrandColorSection
    id="secondary-palette"
    eyebrow="Color // Secondary Palette"
    title="Secondary Palette"
    description="Our primary palette is a tight set of core colors used to anchor the brand in high-contrast and instantly recognizable ways."
    kind="palette"
    :columns="3"
    :items="[
      { name: 'Yellow', token: 'S—001', hex: '#FDC187', textColor: '#111' },
      { name: 'Red', token: 'S—002', hex: '#F66485', textColor: '#111' },
      { name: 'Purple', token: 'S—003', hex: '#8250FF', textColor: '#fff' }
    ]"
  />

  <NmBrandColorSection
    id="gradient"
    eyebrow="Color // Spectrum"
    title="Gradients"
    description="Gradients are used as a subtle layer of depth and energy—always within approved color ranges."
    kind="gradients"
    :items="[
      { name: 'Pink → Blue', start: 'Pink #F50FE5', end: 'Blue #0518FF', background: 'linear-gradient(135deg, #F50FE5, #0518FF)' },
      { name: 'Teal → Purple', start: 'Teal #BAFAF2', end: 'Purple #845BFE', background: 'linear-gradient(135deg, #BAFAF2, #845BFE)', textColor: '#111' },
      { name: 'Cream → Pink', start: 'Cream #FBCEBB', end: 'Pink #F51FC5', background: 'linear-gradient(135deg, #FBCEBB, #F51FC5)', textColor: '#111' }
    ]"
  />

  <NmBrandColorSection
    id="shades"
    eyebrow="Color // Primary Shades"
    title="Primary Shades"
    description="Our primary shades are lighter and darker tonal steps of the core colors, used to create hierarchy, depth, and flexibility."
    kind="shades"
    :groups="[
      { name: 'Primary Blue Shades', token: 'P—001', items: [
        { name: 'P—001', token: '001', hex: '#0019FF' },
        { name: 'P—002', token: '002', hex: '#0C0E4B' },
        { name: 'P—003', token: '003', hex: '#151763' },
        { name: 'P—004', token: '004', hex: '#1B1D77' },
        { name: 'P—005', token: '005', hex: '#272CA6' },
        { name: 'P—006', token: '006', hex: '#353AD1' },
        { name: 'P—007', token: '007', hex: '#4348FF' },
        { name: 'P—008', token: '008', hex: '#6A6EFF' },
        { name: 'P—009', token: '009', hex: '#B6B6FF' }
      ] }
    ]"
  />

  <NmBrandColorSection
    id="greyscale"
    eyebrow="Color // Greyscale"
    title="Greyscale"
    description="Our greyscale palette provides neutral structure for typography, UI, and backgrounds—keeping layouts clean."
    kind="shades"
    :groups="[
      { name: 'Greyscale', token: 'GR—001', items: [
        { name: 'GR—001', token: '001', hex: '#96A4A5' },
        { name: 'GR—002', token: '002', hex: '#101A24' },
        { name: 'GR—003', token: '003', hex: '#1A2B3C' },
        { name: 'GR—004', token: '004', hex: '#23384D' },
        { name: 'GR—005', token: '005', hex: '#30485E' },
        { name: 'GR—006', token: '006', hex: '#516D85' },
        { name: 'GR—007', token: '007', hex: '#768FA6' },
        { name: 'GR—008', token: '008', hex: '#A7BACC' },
        { name: 'GR—009', token: '009', hex: '#DAE5ED' }
      ] }
    ]"
  />

  <NmBrandColorSection
    id="spectrum"
    eyebrow="Color // Spectrum"
    title="Spectrum"
    description="Our full color spectrum is an extended set of secondary and accent hues used sparingly for charts and highlights."
    kind="spectrum"
    :groups="[
      { name: 'Primary', items: [
        { name: '50', token: 'primary-50', hex: '#C7C7FF' }, { name: '100', token: 'primary-100', hex: '#B6B6FF' }, { name: '200', token: 'primary-200', hex: '#7377FA' }, { name: '300', token: 'primary-300', hex: '#595FFF' }, { name: '400', token: 'primary-400', hex: '#4348FF' }, { name: '500', token: 'primary-500', hex: '#0019FF' }, { name: '600', token: 'primary-600', hex: '#041AD9' }, { name: '700', token: 'primary-700', hex: '#0010A6' }, { name: '800', token: 'primary-800', hex: '#020E8A' }, { name: '900', token: 'primary-900', hex: '#000A69' }
      ] },
      { name: 'Orange', items: [
        { name: '50', token: 'orange-50', hex: '#FFE4E0' }, { name: '100', token: 'orange-100', hex: '#FFDAD2' }, { name: '200', token: 'orange-200', hex: '#FFCDC2' }, { name: '300', token: 'orange-300', hex: '#FFB2A3' }, { name: '400', token: 'orange-400', hex: '#FF9982' }, { name: '500', token: 'orange-500', hex: '#FF7F63' }, { name: '600', token: 'orange-600', hex: '#D86850' }, { name: '700', token: 'orange-700', hex: '#B3503E' }, { name: '800', token: 'orange-800', hex: '#8A3A29' }, { name: '900', token: 'orange-900', hex: '#642213' }
      ] },
      { name: 'Teal', items: [
        { name: '50', token: 'teal-50', hex: '#D8FBFD' }, { name: '100', token: 'teal-100', hex: '#C7F9F9' }, { name: '200', token: 'teal-200', hex: '#B5F8F6' }, { name: '300', token: 'teal-300', hex: '#8EF6F3' }, { name: '400', token: 'teal-400', hex: '#6AEEF0' }, { name: '500', token: 'teal-500', hex: '#47ECED' }, { name: '600', token: 'teal-600', hex: '#3ABFBF' }, { name: '700', token: 'teal-700', hex: '#2D9291' }, { name: '800', token: 'teal-800', hex: '#196463' }, { name: '900', token: 'teal-900', hex: '#0D3537' }
      ] },
      { name: 'Indigo', items: [
        { name: '50', token: 'indigo-50', hex: '#E7DCFF' }, { name: '100', token: 'indigo-100', hex: '#CDBBFF' }, { name: '200', token: 'indigo-200', hex: '#B897FF' }, { name: '300', token: 'indigo-300', hex: '#A076FD' }, { name: '400', token: 'indigo-400', hex: '#8953FD' }, { name: '500', token: 'indigo-500', hex: '#6F42D0' }, { name: '600', token: 'indigo-600', hex: '#5632A8' }, { name: '700', token: 'indigo-700', hex: '#3F217D' }, { name: '800', token: 'indigo-800', hex: '#321967' }, { name: '900', token: 'indigo-900', hex: '#261154' }
      ] },
      { name: 'Blue', items: [
        { name: '50', token: 'blue-50', hex: '#D1D6FA' }, { name: '100', token: 'blue-100', hex: '#A8AEF6' }, { name: '200', token: 'blue-200', hex: '#7D86F1' }, { name: '300', token: 'blue-300', hex: '#535FEC' }, { name: '400', token: 'blue-400', hex: '#2734E9' }, { name: '500', token: 'blue-500', hex: '#1D2AB9' }, { name: '600', token: 'blue-600', hex: '#18208D' }, { name: '700', token: 'blue-700', hex: '#10165C' }, { name: '800', token: 'blue-800', hex: '#0C1044' }, { name: '900', token: 'blue-900', hex: '#050A2D' }
      ] },
      { name: 'Red', items: [
        { name: '50', token: 'red-50', hex: '#FFD9E2' }, { name: '100', token: 'red-100', hex: '#FEC6D0' }, { name: '200', token: 'red-200', hex: '#FBB2C4' }, { name: '300', token: 'red-300', hex: '#FA8DA2' }, { name: '400', token: 'red-400', hex: '#F66485' }, { name: '500', token: 'red-500', hex: '#F73D68' }, { name: '600', token: 'red-600', hex: '#C83053' }, { name: '700', token: 'red-700', hex: '#992540' }, { name: '800', token: 'red-800', hex: '#6A1929' }, { name: '900', token: 'red-900', hex: '#53101F' }
      ] },
      { name: 'Green', items: [
        { name: '50', token: 'green-50', hex: '#E7FBF1' }, { name: '100', token: 'green-100', hex: '#D3F7E2' }, { name: '200', token: 'green-200', hex: '#A7EEC2' }, { name: '300', token: 'green-300', hex: '#7AE6A4' }, { name: '400', token: 'green-400', hex: '#4EDD84' }, { name: '500', token: 'green-500', hex: '#20D566' }, { name: '600', token: 'green-600', hex: '#17AA4F' }, { name: '700', token: 'green-700', hex: '#13803B' }, { name: '800', token: 'green-800', hex: '#055528' }, { name: '900', token: 'green-900', hex: '#08421E' }
      ] }
    ]"
  />

  <NmBrandColorSection
    id="combinations"
    eyebrow="Color // Combinations"
    title="Combinations"
    description="Our color combos are pre-approved pairings built for contrast and harmony—so backgrounds, text, and accents."
    kind="combinations"
    :items="[
      { name: 'Cream #F5F1E6', value: 'Blue #051BD7', background: '#F5F1E6', textColor: '#051BD7' },
      { name: 'Black #050505', value: 'Red #F63D68', background: '#050505', textColor: '#F63D68' },
      { name: 'Purple #6F42CF', value: 'Teal #48EBEC', background: '#6F42CF', textColor: '#48EBEC' }
    ]"
  />

  <NmBrandFooter brand="Numerimondes ®" note="Brand identity system" :show-border="false" />
