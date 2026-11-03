---
title: "Our Ambition | Numerimondes"
sidebarTitle: "Our Ambition"
icon: "@spmpst::icon::target"
description: "The team and partner network Numerimondes aims to build."
lang: en
status: "ready-for-review"
js-events:
  - uncollapse-sidebar
---
<NmEffectHero
  :full-bleed="false"
  :effect="['silk', { inject: { lightColor: '#0043e0', darkColor: '#141D2A', lightNoise: 1.5, noiseIntensity: 0.3, speed: 12 } }]"
  :hero-style="{ minHeight: '48vh' }"
  :eyebrow='{ text: "OUR AMBITION · NUMERIMONDES", color: { light: "#e2e8f0", dark: "#e2e8f0" } }'
  :title='{ text: "Small team. <span class=&#39;silky-bbi&#39;>High capability</span>.", color: { light: "#e2e8f0", dark: "#e2e8f0" } }'
  :description='{ text: "We aim to build a focused, highly technical team that can make good decisions close to the work and move with care and speed.", color: { light: "#e2e8f0", dark: "#e2e8f0" } }'
  :buttons="[{ label: 'Our business strategy', href: '/company/about-us/business-strategy' }, { label: 'Work with us', href: '/company/about-us/working-with-us', color: 'gray' }]"
/>
<Acomponent
  title="A team built for <span class='silky-bbi'>focused execution</span>"
  introduction="Our intended model is a small, technically capable, low-hierarchy team with strong individual ownership. We believe a focused team can keep communication direct, reduce handoffs and spend more time solving the problem."
  section-title="A strong core, supported by <span class='silky-bbi+115'>trusted partners</span>."
  :paragraphs="[
    { before: 'We want to create the conditions for a durable network of independent specialists and partner organizations.', after: 'Partners can contribute where their experience fits the work, with scope, responsibilities and commercial terms agreed up front.' },
    { before: 'This is an ambition for how Numerimondes can grow.', after: 'The current company remains founder-led and project-based; our present delivery model is described in <a href="/company/about-us/delivery-model">How We Work</a>.' }
  ]"
/>
<Timeline
  label="What this ambition means in practice"
  :start-margin="false"
  :items="[
    { title: 'Keep the core focused', status: [{ icon: '01', markerColor: '#3977c8' }], time: 'Build a small team with complementary, technically strong skills.' },
    { title: 'Keep decisions close to the work', status: [{ icon: '02', markerColor: '#3977c8' }], time: 'Use a flat structure with clear ownership and direct communication.' },
    { title: 'Bring in the right expertise', status: [{ icon: '03', markerColor: '#3977c8' }], time: 'Work with trusted partners when a project needs additional specialist capability.' },
    { title: 'Build for sustainable delivery', status: [{ icon: '04', markerColor: '#3977c8' }], time: 'Grow through useful offerings and partnerships that create lasting value.' }
  ]"
/>
<div style="width: min(100% - 40px, 720px) !important; margin-inline: auto !important;">
<h2>Work with us</h2
<p>We are interested in meeting people who bring strong technical or domain expertise and enjoy taking responsibility for meaningful work. Collaboration depends on a clear opportunity, a good fit and agreed terms.</p>
<FeluqaButton tag="a" href="/company/prologue/contact?topic=partnership" label="Start a conversation"/>
</div>
