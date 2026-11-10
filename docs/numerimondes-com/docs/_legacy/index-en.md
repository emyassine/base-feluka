---


layout: home
footer: false
title: Numerimondes
sidebarTitle: Numerimondes
description: "Technology holding focused on sovereignty, governance, and durable software systems."
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

<br />

<!--
First Video Content:
Visual: Cinematic shots of high-security environments (command centers, parliaments, grid control).
Narrative: "Power used to be about who has the data. Now, power is about who owns the logic. Stop renting your intelligence."
Closing: The Numerimondes logo appearing over a "Verified & Open" seal.

Pour illustrer cette "source d'opportunités", la vidéo ne doit pas montrer que du code, mais le résultat concret de la maîtrise technologique :
Ouverture : Un écran noir qui s'illumine d'un noyau (le Kernel) ultra-fluide.
Transition : Des images rapides de secteurs clés (logistique complexe, défense, smart cities, finance) qui s'activent grâce à cette technologie.
Focus Développeur : Un plan serré sur un développeur en interne qui modifie le code en temps réel pour créer un nouvel outil stratégique.
Message final : "Build without limits. Own without compromise."

C'est un positionnement fort : vous dites à vos clients que le logiciel n'est plus une dépense ou une contrainte, mais leur meilleur actif.
-->
<NDCSimpleHero
  eyebrow="ENTER THE ERA OF SOVEREIGN SOFTWARE"
  title="We design and build the tools that make your organization autonomous."
  subtitle="Numerimondes develops operational software, infrastructure, and data systems for organizations that cannot depend on external platforms to run their core operations."
  primary-text="Explore Our Approach"
  primary-href="/holding/overview/"
  primary-icon="FileText"
  secondary-text="Start a Conversation"
  secondary-href="/contact/"
  secondary-icon="ArrowUpRight"
  style="margin-top: 5.5rem !important; "
></NDCSimpleHero>




<ScrollSee
  src="https://images.unsplash.com/photo-1729179664930-f1bd3c9d97e3"
  youtube-url="https://youtube.com/watch?v=FdZikRU97CI"
  class="container no-display"
  id="hero-media"
  data-test="x"
  :scale-from="0.6"
  :scale-to="1.55"
/>

<div style="display: grid; place-items: center">
  <div style="width: 100%; max-width: 720px; text-align: initial">
    <MeetAuthor
      name="El Moumen Yassine"
      title="Founder, Numerimondes"
      bio="Organizations are entering a period where they must own the systems they depend on. I founded Numerimondes to design and build the software, infrastructure, and operational foundations that make this possible — with clarity, control, and long-term durability at the core."
      avatar="/team/elmoumenyassine-002.jpeg"
      :links="[
        { label: 'About Numerimondes', href: '/about', icon: 'ArrowUpRight', iconPosition: 'after' },
        { label: 'Our approach', href: '/holding/overview', icon: 'ArrowUpRight', iconPosition: 'after' }
      ]"
    />
  </div>

  <div style="width: 100%; max-width: 720px; display: flex; justify-content: center; margin-top: 10px">
    <span
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 500;
        user-select: none;
        color: var(--vp-code-lang-color);
        transition: color 0.4s, opacity 0.4s;
        text-align: center;
        line-height: 1.4;
      "
    >
      <span>Or learn more by visiting</span>
      <a
        href="https://webkernelphp.com/get-started"
        target="_blank"
        rel="noopener noreferrer"
        style="
          text-decoration: none;
          border: none;
          outline: none;
          color: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        "
      >
        <span style="color: var(--vp-c-text-1)">webkernelphp.com/get-started</span>
      </a>
    </span>
  </div>
</div>

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
    { speed: 2, direction: 'left', skewMobile: 3, skewDesktop: 0, fade: true, fadeColor: '#000', class: 'row-premium' },
    { speed: 1, direction: 'right', skewMobile: -3, skewDesktop: 0, fade: true }
  ]"
/>


<br />

<InsightList
  title="Read about our services"
  subtitle="All entries are resolved through a CMS query."
  type="cms"
  :items="useCms('en')
    .inPath('guides/')
    .onlyIndex()
    .depth('*')
    .sortByOrder()
    .transform(({ id, i18n, assets, taxonomy, _locale }) => ({
      id: i18n.href || i18n.url || id,
      title: i18n.title,
      excerpt: i18n.description ?? '',
      href: i18n.href || i18n.url,
      thumbnail: assets?.thumbnailByLocale?.[_locale] ?? null,
      tags: taxonomy?.tags,
      type: taxonomy?.type
    }))
    .get()"
  :limit="5"
  layout="grid"
  :showExcerpt="true"
  :showMeta="true"
  :root-style="{ marginBottom: '3rem !important' }"
  viewAllText="View all insights"
  viewAllHref="/insights">
</InsightList>


<NDCReleaseCards
  eyebrow="Quick Overview"
  title="Industries we serve"
  subtitle="We create systems for critical operational continuity and sovereignty"
  header-align="left"
  actions-align="right"
  :root-style="{ marginTop: '7rem !important' }"
  :actions="[]"
  :items="[
    {
      id: 'a',
      title: 'Webkernel pour les Entreprises',
      description: 'Créez des applications, expériences et opérations automatisées avec l’IA.',
      topLink: { label: 'Read announcement', href: '#' },
      meta: [
        { label: 'Date', value: 'February, 2026' },
        { label: 'Category', value: 'Announcements' }
      ],
      button: { label: 'Read the post', href: '#', variant: 'primary', icon: 'lucide:arrow-right' }
    },
    {
      id: 'b',
      title: 'Claude Opus 4.6',
      description: 'Introducing the world’s most powerful model for coding, agents, and professional work.',
      topLink: { label: 'Read announcement', href: '#' },
      meta: [
        { label: 'Date', value: 'February 5, 2026' },
        { label: 'Category', value: 'Announcements' }
      ],
      button: { label: 'Model details', href: '#', variant: 'secondary', icon: 'lucide:arrow-right' }
    }
  ]"
/>

<p>© Numerimondes. All rights reserved. Names and marks belong to their respective owners.</p>

<br />
<br />
