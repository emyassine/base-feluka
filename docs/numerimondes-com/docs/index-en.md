---


layout: home
footer: false
title: Numerimondes
sidebarTitle: Numerimondes
description: "Research and engineering for sovereign, durable digital systems."
date: 2026-02-11
titleTemplate: true
navbar: true
sidebar: false
aside: true
outline: 2
lastUpdated: true
editLink: true
pageClass: "page"
isHome: false
head:
  - - meta
    - name: "description"
      content: "index-en"
  - - meta
    - name: "keywords"
      content: "TODO, keywords"
docTitle: "index-en"
docSubTitle: "index-en"
thumbnail:
tags: []
audience: []
type:
icon:
image:
draft: false
order:
group:
---

<script setup>
  const partners = [
    { title: 'Government', icon: 'landmark' },
    { title: 'Law Enforcement', icon: 'shieldCheck' },
    { title: 'Military & Defense', icon: 'shield' },
    { title: 'Regulatory Bodies', icon: 'scale' },
    { title: 'Enterprise', icon: 'building2' },
    { title: 'Early-stage & Scale-up', icon: 'rocket' },
    { title: 'Automotive Industry', icon: 'carFront' },
    { title: 'Aviation & Aerospace', icon: 'plane' },
    { title: 'Consumer Packaged Goods', icon: 'package' },
    { title: 'Energy & Utilities', icon: 'zap' },
    { title: 'Finance', icon: 'banknote' },
    { title: 'Insurance', icon: 'lifeBuoy' },
    { title: 'Logistics & Supply Chain', icon: 'box' },
    { title: 'Manufacturing', icon: 'factory' },
    { title: 'Media & Entertainment', icon: 'clapperboard' },
    { title: 'Pharmaceuticals', icon: 'flaskConical' },
    { title: 'Retail', icon: 'shoppingCart' },
    { title: 'Shipping & Maritime', icon: 'ship' },
    { title: 'Technology', icon: 'cpu' },
    { title: 'Telecommunications', icon: 'antenna' },
    { title: 'Consulting & Advisory Services', icon: 'briefcase' },
    { title: 'Non-Governmental Organization', icon: 'globe' },
    { title: 'Humanitarian Aid', icon: 'heart' },
    { title: 'Research & University', icon: 'graduationCap' },
    { title: 'Healthcare & Medical Services', icon: 'stethoscope' },
    { title: 'Critical Infrastructure Operator', icon: 'hardHat' },
    { title: 'Cybersecurity', icon: 'lock' }
  ]
</script>
<NDCSimpleHero
eyebrow="<array-1></array-1>"
title="Own <array-2></array-2>"
:array-1-text="['RESEARCH & OPERATING MANUAL', 'ENTER THE ERA OF SOVEREIGN SOFTWARE']"
array-1-duration="2600"
array-1-effect="none"
:array-2-text="['your software', 'your databases', 'your infrastructure']"
array-2-duration="1000"
array-2-effect="typewriter"
  subtitle="Numerimondes is a research and engineering initiative focused on sovereignty, governance, and durable digital systems — built to be understood, controlled, and sustained over time."
  primary-text="Start with Resources"
  primary-href="/resources"
  primary-icon="FileText"
  secondary-text="Explore WebKernelPHP"
  secondary-href="/products"
  secondary-icon="ArrowUpRight"
  style=""
></NDCSimpleHero>

<NDCHeroCards>
</NDCHeroCards>

<UniversalMarquee
  id="industries-we-serve"
  eyebrow="Quick Overview"
  title="Industries we serve"
  subtitle="We create systems for critical operational continuity and sovereignty"
  header-align="left"
  class="no-scrollsee"
  actions-align="right"
  :root-style="{ marginTop: '3rem !important' }"
  :actions="[
    { label: 'Explore sectors', icon: 'ArrowUpRight', href: '/holding/overview/', variant: 'primary' },
    { label: 'Contact us', icon: 'Mail', href: '/contact/', variant: 'secondary' }
  ]"
  :items="partners"
  :rows="[
    { speed: 2, direction: 'left', skewMobile: 3, skewDesktop: 0, fade: true, fadeColor: '#000', class: 'row-premium' },
    { speed: 1, direction: 'right', skewMobile: -3, skewDesktop: 0, fade: true },
  ]"
/>


<div style="display: grid; place-items: center; margin-top: 2.25rem;">
  <div style="width: 100%; max-width: 920px;">
    <div style="margin-top: 16px; border: 1px solid color-mix(in srgb, var(--vp-c-border) 72%, transparent); background: color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent); border-radius: 16px; padding: 16px;">
      <div style="color: var(--vp-c-text-1); letter-spacing: -0.01em;">What this site is</div>
      <ul style="margin: 10px 0 0; padding-left: 18px; color: var(--vp-c-text-2); line-height: 1.6;">
        <li>Not a blog. Not marketing. Not a SaaS brochure.</li>
        <li>A growing body of research, operating doctrine, and engineering clarity.</li>
        <li>A foundation for tools like WebKernelPHP — built for long-lived systems.</li>
      </ul>
    </div>
  </div>
</div>

<div style="display: grid; place-items: center; margin-top: 1.9rem;">
  <div style="width: 100%; max-width: 920px;">
    <MeetAuthor
      name="El Moumen Yassine"
      title="Founder, Numerimondes"
      bio="Organizations are entering a period where they must own the systems they depend on. Numerimondes exists to build the knowledge, standards, and engineering foundations required to make this possible — with governance, clarity, and long-term durability at the core."
      avatar="/team/elmoumenyassine-002.jpeg"
      :links="[
        { label: 'About Numerimondes', href: '/about', icon: 'ArrowUpRight', iconPosition: 'after' },
        { label: 'Start with Resources', href: '/resources', icon: 'ArrowUpRight', iconPosition: 'after' }
      ]"
    ></MeetAuthor>
  </div>
</div>

<div style="text-align: center; margin: 2.25rem 0 0; color: var(--vp-c-text-3); font-size: 12px;">
  © Numerimondes. All rights reserved. Names and marks belong to their respective owners.
</div>

<br />
<br />
