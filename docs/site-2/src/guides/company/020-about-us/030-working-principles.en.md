---
title: "Working Principles | Numerimondes"
sidebarTitle: "Working Principles"
icon: "@spmpst::icon::list-checks"
description: "Working Principles at Numerimondes."
lang: en
status: "ready-for-review"
js-events:
  - uncollapse-sidebar
---

<NmEffectHero
  :full-bleed="false"
  :effect="['silk', { inject: { lightColor: '#0043e0', darkColor: '#141D2A', lightNoise: 1.5, noiseIntensity: 0.3, speed: 12 } }]"
  :hero-style="{ minHeight: '42vh' }"
  eyebrow="HOW WE WORK · NUMERIMONDES"
  title="Principles for <span class='silky-bbi'>useful work</span>."
  description="A few practical commitments guide how we explore opportunities, make decisions and deliver with others."
  :title-style="{ color: '#e2e8f0' }"
  :description-style="{ color: '#e2e8f0' }"
  :buttons="[{ label: 'How we work', href: '/company/about-us/delivery-model' }, { label: 'Our ambition', href: '/company/about-us/ambition', color: 'gray' }]"
/>

<Timeline
  label="Working principles"
  :start-margin="false"
  :items="[
    { title: 'Clarity', status: [{ icon: '01', markerColor: '#3977c8' }], time: 'Make business goals, constraints and decisions understandable.' },
    { title: 'Curiosity', status: [{ icon: '02', markerColor: '#3977c8' }], time: 'Research opportunities and consider thoughtful alternatives.' },
    { title: 'Practicality', status: [{ icon: '03', markerColor: '#3977c8' }], time: 'Design around the operating realities of people and organizations.' },
    { title: 'Accountability', status: [{ icon: '04', markerColor: '#3977c8' }], time: 'Agree on responsibility, scope and commercial conditions before execution.' },
    { title: 'Control', status: [{ icon: '05', markerColor: '#3977c8' }], time: 'Consider ownership, maintainability and operational autonomy in each solution.' }
  ]"
/>
