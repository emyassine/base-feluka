---
title: "Projects | Numerimondes"
sidebarTitle: "Projects"
icon: "@spmpst::icon::rocket"
layout: home
description: "Services, platforms and standards developed or operated by Numerimondes."
---

<Acomponent
title="<h1 style='display:none;'><span class='silky-bbi' style=''>Services, platforms and standards</span></h1><br><br><h2 style=''>Projects connect <span class='silky-bbi' style='color:var(--vp-c-brand-1);'>services,<br>infrastructure and ideas.</span></h2>"
  introduction="Some projects support organizations directly. Others develop the platforms and standards Numerimondes uses to build and operate digital systems."
  section-title="<h2>Work in practice.<br><span class='silky-bbi+115' style='color:var(--vp-c-brand-1);'>Systems in development.</span></h2>"
  :paragraphs="[
    {
      before: `Hiring does not always happen in one place.`,
      image: {
        thumb: '/images/products/TheBestRecruit.png',
        src: '/images/products/TheBestRecruit.png',
        alt: 'The Best Recruit',
        caption: 'Remote recruitment service'
      },
      after: `The Best Recruit is Numerimondes’ remote recruitment service for employers. Its work centers on candidate qualification and relevant information for hiring decisions.`
    },
    {
      before: `Digital services depend on infrastructure that someone must configure, maintain and back up.`,
      image: {
        thumb: '/images/home/showcase-capabilities/infrastructure-before.jpg',
        src: '/images/home/showcase-capabilities/infrastructure-after.jpg',
        alt: 'Infrastructure and server operations',
        caption: 'Numerimondes Cloud'
      },
      after: `Numerimondes Cloud is the server management service we use for our own systems and offer for client environments. Deployments may use managed webservers, client premises or a mixed setup.`
    },
    {
      before: `Building business software also means improving the tools and conventions used to create it.`,
      image: {
        thumb: '/images/products/feluqa.png',
        src: '/images/products/feluqa.png',
        alt: 'Feluqa platform identity',
        caption: 'Feluqa · in development'
      },
      after: `Feluqa and SPMPST are platform initiatives in development: one focuses on application software, the other on portable content and website-building workflows.`
    }
  ]"
/>

<div style="width: min(100% - 40px, 544px); margin: 4rem auto;">


<SimpleMiniCard
  :columns="1"
  :categories="[
    {
      title: 'Services',
      items: [
        { icon: '@spmpst::icon::users', title: 'Remote recruitment', href: '/projects/the-best-recruit' },
        { icon: '@spmpst::icon::server', title: 'Server management', href: '/projects/numerimondes-cloud' }
      ]
    },
    {
      title: 'Platforms and standards · in development',
      items: [
        { icon: '@spmpst::icon::rust', title: 'Application platform', href: '/projects/feluqa' },
        { icon: '@spmpst::icon::folder-tree', title: 'Portable content standard', href: '/projects/spmpst' }
      ]
    }
  ]"
/>
</div>
