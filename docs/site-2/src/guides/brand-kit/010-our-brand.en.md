---
title: "Our Brand"
sidebarTitle: "Our Brand"
icon: "@spmpst::icon::sparkles"
---

<script setup lang="ts">
import '@docs/resources/components/brand-kit/brandkitpro.css'
import hero from '@docs/resources/components/brand-kit/BrandKitOurBrandHero.html?raw'
import intro from '@docs/resources/components/brand-kit/BrandKitOurBrandIntro.html?raw'
import index from '@docs/resources/components/brand-kit/BrandKitOurBrandIndex.html?raw'
import footer from '@docs/resources/components/brand-kit/BrandKitOurBrandFooter.html?raw'
import overlay from '@docs/resources/components/brand-kit/BrandKitOurBrandNavigation-overlay.html?raw'
import cursor from '@docs/resources/components/brand-kit/BrandKitOurBrandNavigation-cursor.html?raw'
import desktopNavigation from '@docs/resources/components/brand-kit/BrandKitOurBrandNavigation-desktop.html?raw'
import mobileNavigation from '@docs/resources/components/brand-kit/BrandKitOurBrandNavigation-mobile.html?raw'
import templateOverlay from '@docs/resources/components/brand-kit/BrandKitOurBrandDecorations-templateOverlay.html?raw'
import badge from '@docs/resources/components/brand-kit/BrandKitOurBrandDecorations-badge.html?raw'
import svgTemplates from '@docs/resources/components/brand-kit/BrandKitOurBrandDecorations-svgTemplates.html?raw'

const navigationRoots = [
  { key: 'overlay', tag: 'div', attributes: { id: 'overlay' }, html: overlay },
  { key: 'cursor', tag: 'div', attributes: { class: 'framer-1v0out2' }, html: cursor },
  { key: 'desktop', tag: 'div', attributes: { class: 'ssr-variant hidden-1aar4va' }, html: desktopNavigation },
  { key: 'mobile', tag: 'div', attributes: { class: 'ssr-variant hidden-2hs8f4 hidden-17c4u4b' }, html: mobileNavigation },
]
const decorationRoots = [
  { key: 'template-overlay', tag: 'div', attributes: { id: 'template-overlay' }, html: templateOverlay },
  { key: 'badge', tag: 'div', attributes: { id: '__framer-badge-container' }, html: badge },
  { key: 'svg-templates', tag: 'div', attributes: { id: 'svg-templates', style: 'position:absolute;overflow:hidden;bottom:0;left:0;width:0;height:0;z-index:0;contain:strict', 'aria-hidden': 'true' }, html: svgTemplates },
]
</script>

<div id="brandkit-root">
  <div id="main">
    <div class="framer-TF3L3 framer-17c4u4b" data-framer-cursor="195i719" data-layout-template="true" style="min-height:100vh;width:auto">
      <div data-framer-root class="framer-3mu7C framer-yemt7z" style="min-height:100vh;width:auto;display:contents">
        <BrandKitOurBrandHero :fragment="hero" :attributes="{ class: 'framer-1ayg0jc-container', id: 'homehero', style: 'will-change:transform;opacity:1;transform:none' }" />
        <BrandKitOurBrandIntro :fragment="intro" :attributes="{ class: 'framer-131mnw7-container', id: 'homeintro' }" />
        <BrandKitOurBrandIndex :fragment="index" :attributes="{ class: 'framer-auh6qw-container', id: 'index' }" />
        <BrandKitOurBrandFooter :fragment="footer" :attributes="{ class: 'framer-yxidvy-container' }" />
      </div>
      <BrandKitOurBrandNavigation :roots="navigationRoots" />
    </div>
    <BrandKitOurBrandDecorations :roots="decorationRoots" />
  </div>
</div>
