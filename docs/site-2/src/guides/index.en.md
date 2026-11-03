---
title: "Technology you can own, understand, and operate"
sidebarTitle: "Home"
icon: "@spmpst::icon::home"
layout: home
description: "Numerimondes helps organizations design, build, and operate dependable systems."
---
<div></div>
<NmEffectHero
  :effect="['silk', { inject: { lightColor: '#0043e0', darkColor: '#141D2A', lightNoise: 1.5, noiseIntensity: 0.3, speed: 12 } }]"
  :hero-style="{ minHeight: '90vh' }"
  :eyebrow="{ text: 'Insight. Innovation. Strategy. Execution.', color: { light: '#e2e8f0', dark: '#e2e8f0' } }"
  :title="{ text: `Ideas and operations that <span class='silky-bbi'>move</span> businesses forward <span class='silky-bbi+110'>smoothly</span>.`, color: { light: '#e2e8f0', dark: '#e2e8f0' } }"
  :description="{ text: 'Across business operations, technology and new ventures, our work is guided by the ambition to <strong>help organizations improve performance, gain control and create lasting value.</strong>', color: { light: '#e2e8f0', dark: '#e2e8f0' } }"
  :buttons="[
    { label: 'Discuss a project', href: 'https://wa.me/212620990692?text=Hello%20Numerimondes%2C%20I%27d%20like%20to%20discuss%20a%20project.', external: true, icon: 'whatsapp', color: 'primary' },
    { label: 'Explore our capabilities', href: '/capabilities/', color: 'gray' }
  ]"
>
	<template #dock>
  <NmSimpleHeroDock
    default-group="Our Products"
    :panel-height="68"
    :base-item-size="50"
    :magnification="70"
    :groups="[
      {
        label: 'Our Products',
        indicatorIndex: 0,
        items: [
          { id: 'feluqa', label: 'Feluqa', href: '/company/initiatives/feluqa', icon: '/images/products/feluqa.png' },
          { id: 'best-recruit', label: 'The Best Recruit', mobileLabel: 'Recruit', href: '/company/initiatives/the-best-recruit', icon: '/images/products/TheBestRecruit.png' },
        ],
      },
      {
        label: 'Quick Links',
        separators: [0],
        indicatorIndex: 0,
        items: [
          { label: 'Business Advisory', mobileLabel: 'Advisory', href: '/services/business-advisory/', icon: '@spmpst::icon::briefcase' },
          { label: 'Systems and Operations', mobileLabel: 'Systems', href: '/services/systems-and-operations/systems-overview', icon: '@spmpst::icon::server' },
          { label: 'Opportunities', mobileLabel: 'Ideas', href: '/opportunities/introduction/', icon: '@spmpst::icon::sparkles' },
          { label: 'About Numerimondes', mobileLabel: 'About', href: '/company/about-us/about-us', icon: '@spmpst::icon::building' },
        ],
      },
    ]"
  />
	</template>
</NmEffectHero>

<Acomponent
	title="<h1>Numerimondes <span class='silky-bbi' style='color:var(--vp-c-brand-1);'>is an <span style='text-decoration: underline !important; text-decoration-color: var(--vp-c-text-1) !important;'>independent</span> consulting and solutions <span style='text-decoration: underline !important; text-decoration-color: var(--vp-c-text-1) !important;'>company</span></span></h1>"
  introduction="We explore <span class='silky-i+115'>opportunities</span>, develop ideas, design practical solutions and bring together the expertise needed to make projects happen."
  :gallery="[
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
      alt: 'A team collaborating around a table'
    },
    {
      src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      alt: 'A bright workspace prepared for focused work'
    },
    {
      src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
      alt: 'Colleagues discussing a project together'
    },
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
      alt: 'Electronic components on a circuit board'
    },
    {
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
      alt: 'A team working together in a bright office'
    },
    {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
      alt: 'A team planning together around a table'
    },
    {
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      alt: 'A collaborative modern office'
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
      alt: 'Colleagues collaborating around a laptop'
    },
    {
      src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85',
      alt: 'A team sharing ideas at a meeting'
    },
    {
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85',
      alt: 'A project team working through ideas'
    },
    {
      src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
      alt: 'A collaborative business meeting'
    },
    {
      src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85',
      alt: 'Colleagues planning at a whiteboard'
    },
    {
      src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
      alt: 'A team collaborating in a workshop'
    },
    {
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      alt: 'A shared workspace with a long table'
    }
  ]"
  section-title="<h1 style=''>Possibility<br><span class='silky-bbi+115' style='color:var(--vp-c-brand-1);'>becomes valuable</span><br>through execution.</h1><br><br>"
  :paragraphs="[
    {
      before: `Every organization has opportunities waiting to be explored:`,
      image: {
        thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=96&h=72&q=80',
        src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&h=420&q=85',
        alt: 'A team collaborating around a table',
        caption: 'People working through opportunities together'
      },
      after: `processes that could run better, information that could support <span style='color:var(--vp-c-brand-1);text-decoration: underline !important;'class='silky-bbi'>faster decisions</span>, new services worth developing, and ways to connect people, systems and markets.`
    },
    {
      before: `We combine research, <span style='color:var(--vp-c-brand-1);text-decoration: underline !important;'class='silky-bbi'>commercial thinking</span> and engineering`,
      image: {
        thumb: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=96&h=72&q=80',
        src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=640&h=420&q=85',
        alt: 'A workspace set up for focused research and planning',
        caption: 'Research and planning workspace'
      },
      after: `to examine these possibilities, shape viable approaches and move selected projects into action.`
    },
    {
      before: `Our contribution can begin with an idea, a question, an <span style='color:var(--vp-c-brand-1);text-decoration: underline !important;'class='silky-bbi'>operational challenge</span>`,
      image: {
        thumb: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=96&h=72&q=80',
        src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=640&h=420&q=85',
        alt: 'Colleagues discussing a project together',
        caption: 'Project discussion and planning'
      },
      after: 'or a clear project brief.'
    }
  ]"
/>

<div style="width: min(100% - 40px, 544px) !important;  margin-inline: auto!important;">

  <h2 style="margin: 0 0 24px; font-weight: 500;">
		What this can mean<br>for your <span class="silky-bbi+115">business</span>
</h2>

<p>Expected benefits are assessed for each engagement; <span class="silky-i">specific results</span> depend on the project and its implementation.</p>

<Timeline
  label="Business benefits"
  :items="[
    { title: `Better <span class='silky-bbi+115'>decisions</span>`, status: [{ icon: '01', markerColor: '#3977c8' }], href: '/services/business-advisory/consulting', time: `Clearer priorities, options and investment choices.` },
    { title: `More efficient <span class='silky-bbi+115'>operations</span>`, status: [{ icon: '02', markerColor: '#3977c8' }], href: '/services/systems-and-operations/systems-overviewoperations', time: `Less duplicated work, fewer avoidable errors and better coordination.` },
    { title: `Greater visibility and <span class='silky-bbi+115'>control</span>`, status: [{ icon: '03', markerColor: '#3977c8' }], href: '/services/systems-and-operations/systems-overviewsoftware', time: `Accessible information, traceable processes and systems you can manage.` },
    { title: 'New opportunities', status: [{ icon: '04', markerColor: '#3977c8' }], href: '/company/initiatives/innovation', time: 'Business concepts, partnerships, products and services evaluated for real-world potential.' },
    { title: 'A clearer route to delivery', status: [{ icon: '05', markerColor: '#3977c8' }], href: '/company/prologue/contact', time: 'Defined scope, accountable coordination and expertise matched to the assignment.' }
  ]"
 />

</div>

 <NmShowcase
	 title="What we do"
		variant="stacked"
	 footnote="Our work connects consulting, innovation and <span class='silky-i'>delivery</span>. Each engagement is defined around the organization's priorities and the capabilities required."
	 citation="El Moumen Yassine"
	 footnote-marker="*"
		:stories='[
	  {
	    name: "Business Consulting and Development",
	    description: "Opportunity research, <span class=silky-i>commercial strategy</span>, operational diagnosis, project structuring and business development support. We help turn analysis and ideas into decisions, plans and actionable initiatives.",
      color: "#E9A23B",
	    beforeImage: "/images/home/showcase-capabilities/business-before.jpg",
	    afterImage: "/images/home/showcase-capabilities/business-after.jpg",
	    beforeText: "Uncertain strategic direction, fragmented market research, and unaligned commercial priorities.",
	    afterText: "Structured business roadmap, <span class=silky-i>clear decisions</span> and commercial expansion.",
	    linkText: "Explore consulting",
	    linkUrl: "/services/business-advisory/consulting"
	  },
	  {
	    name: "Digital Systems and Software",
	    description: "Business applications, internal tools, integrations, automation and information systems designed around the people and processes using them. Our engineering work includes <span class=silky-i>custom development</span> and Rust-based initiatives where appropriate.",
      color: "#3B82F6",
	    beforeImage: "/images/home/showcase-capabilities/digital-before.jpg",
	    afterImage: "/images/home/showcase-capabilities/digital-after.jpg",
	    beforeText: "Siloed legacy tools, manual data entry, and slow execution speeds bottlenecking daily operations.",
	    afterText: "High-performance custom software and Rust-powered automation delivering sub-millisecond execution and total data control.",
	    linkText: "Explore software and systems",
	    linkUrl: "/services/systems-and-operations/systems-overviewsoftware"
	  },
	  {
	    name: "Infrastructure, Equipment and Security",
	    description: "Infrastructure planning, hosting and deployment, self-hosted environments, equipment integration, operational continuity and scoped security assessments. We help organizations make informed <span class=silky-i>decisions</span> and manage their technical environments.",
      color: "#8B5CF6",
	    beforeImage: "/images/home/showcase-capabilities/infrastructure-before.jpg",
	    afterImage: "/images/home/showcase-capabilities/infrastructure-after.jpg",
	    beforeText: "Vulnerable, opaque server setup with recurring vendor lock-in fees and unmonitored security gaps.",
	    afterText: "Sovereign, self-hosted infrastructure built for operational continuity, full privacy, and hardened security controls.",
	    linkText: "Explore infrastructure",
	    linkUrl: "/services/systems-and-operations/systems-overviewinfrastructure"
	  },
	  {
	    name: "Operations, People and Capabilities",
	    description: "Organizational workflows, reporting, service operations, training and people-related solutions. Engagements are offered according to available expertise, <span class=silky-i>scope</span> and operational readiness.",
      color: "#14B8A6",
	    beforeImage: "/images/home/showcase-capabilities/operations-before.jpg",
	    afterImage: "/images/home/showcase-capabilities/operations-after.jpg",
	    beforeText: "Duplicated work, communication friction, and uncoordinated operational workflows across teams.",
	    afterText: "Streamlined operational workflows, clear reporting lines, and upskilled teams executing with full accountability.",
	    linkText: "Explore operations",
	    linkUrl: "/services/systems-and-operations/systems-overviewoperations"
	  },
	  {
	    name: "Innovation and New Ventures",
	    description: "Research, validate and shape opportunities that may lead to new services, products, partnerships or specialized systems. We connect the creative and commercial sides of an idea with a practical <span class=silky-i>development path</span>.",
      color: "#F43F5E",
	    beforeImage: "/images/home/showcase-capabilities/innovation-before.jpg",
	    afterImage: "/images/home/showcase-capabilities/innovation-after.jpg",
	    beforeText: "Untapped commercial concepts and high-potential ideas stalled without a practical path to execution.",
	    afterText: "Validated product-market strategy, robust system architecture, and new venture models deployed for growth.",
	    linkText: "Explore innovation",
	    linkUrl: "/company/initiatives/innovation"
	  }
		]'
   :labels="{
     region: 'Our capabilities',
     before: 'Starting point',
     beforeColor: '#e5484d',
     after: 'Possible outcome',
     afterColor: 'var(--vp-c-brand-1)',
     timelineStart: 'Starting point',
     timelineEnd: 'Possible outcome',
     companies: 'Capabilities',
     stories: 'Capability examples',
     compare: 'Compare the starting point and possible outcome for {name}',
     altBefore: '{name}: starting point',
     altAfter: '{name}: possible outcome',
   }"
 />


<div style="width: min(100% - 40px, 544px);  margin-inline: auto;">

# One space with many <span class='silky-bbi+115'>possibilities.</span> {#showcase}

**An interactive showcase of <span class='silky-bi'>ideas, systems and solutions.</span>**

Discover the areas we explore and the kinds of value that can be created. Browse by business challenge, sector or capability, and open individual stories, prototypes or demonstrations for further detail.

## A few areas we <span class='silky-bbi+115'>explore</span>

<BounceCards
  :images="[
    '/images/home/showcase-capabilities/business-after.jpg',
    '/images/home/showcase-capabilities/digital-after.jpg',
    '/images/home/showcase-capabilities/infrastructure-after.jpg',
    '/images/home/showcase-capabilities/operations-after.jpg',
    '/images/home/showcase-capabilities/innovation-after.jpg'
  ]"
  :container-width="640"
  :container-height="300"
  :animation-delay="0.2"
  :animation-stagger="0.08"
  aspect-ratio="1:1"
  hover-push="220px"
  expanded-width="75%"
  expanded-height="90%"
  :expanded-z-index="40"
  overflow-mode="visible"
  enable-hover
/>

<SimpleMiniCard
  :columns="2"
  :categories="[
    {
      title: 'Business performance',
      items: [
        { icon: '@spmpst::icon::activity', title: 'Operational diagnostics' },
        { icon: '@spmpst::icon::workflow', title: 'Commercial workflows' },
        { icon: '@spmpst::icon::layout-dashboard', title: 'Dashboards' },
        { icon: '@spmpst::icon::layout-dashboard', title: 'Process improvement' }
      ]
    },
    {
      title: 'Software and automation',
      items: [
        { icon: '@spmpst::icon::code', title: 'Tailored applications' },
        { icon: '@spmpst::icon::layers', title: 'Integrations' },
        { icon: '@spmpst::icon::bot', title: 'Document workflows' },
        { icon: '@spmpst::icon::bot', title: 'AI-assisted tasks' }
      ]
    },
    {
      title: 'Infrastructure and connected operations',
      items: [
        { icon: '@spmpst::icon::server', title: 'Self-hosted systems' },
        { icon: '@spmpst::icon::activity', title: 'Monitoring' },
        { icon: '@spmpst::icon::cpu', title: 'Equipment' },
        { icon: '@spmpst::icon::cpu', title: 'Field applications' }
      ]
    },
    {
      title: 'People and organizations',
      items: [
        { icon: '@spmpst::icon::graduation-cap', title: 'Training' },
        { icon: '@spmpst::icon::users', title: 'Coordination' },
        { icon: '@spmpst::icon::sparkles', title: 'Emerging talent solutions' }
      ]
    },
    {
      title: 'Research and ventures',
      items: [
        { icon: '@spmpst::icon::file-code', title: 'Internal standards' },
        { icon: '@spmpst::icon::flask-conical', title: 'Experimental platforms' },
        { icon: '@spmpst::icon::rocket', title: 'New business concepts' }
      ]
    }
  ]"
/>

<FeluqaButton tag="a" href="/#showcase" label="Explore the showcase"/>


<!-- Showcase implementation:
Present each item with an accurate status: Concept / Research / In development / Demo / Delivered.
Use "Delivered" only for verifiable completed work. Separate client references (with permission)
from Numerimondes experiments and illustrative solution concepts.
Suggested interaction: one large visual canvas with switchable categories, layered examples,
and a clear click-through to the relevant project or service page.
-->

## Built around the <span class='silky-bbi+115'>mission.</span>

Numerimondes operates **on a project-by-project basis**. Every assignment begins with an agreed objective and a clear scope. We assemble the combination of developers, consultants, operators and specialist partners suited to the work.

Our founder acts as the central point of contact for project qualification, solution direction and delivery coordination. Numerimondes remains accountable to the client for the work it undertakes, including work performed by specialists engaged for the mission.

:::: info See how an engagement works

::: details Open the flowchart diagram
```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#f4f6f8',
    'primaryTextColor': '#0a0d10',
    'primaryBorderColor': '#0a0d10',
    'lineColor': '#0a0d10',
    'textColor': '#0a0d10',
    'nodeBorder': '#0a0d10'
  }
}}%%
flowchart TD
    Start([Opportunity / Project Brief]) --> P1["1. Understand<br/><i>Audit context, goals and constraints</i>"]

    P1 --> Q1{"Clear alignment<br/>and viability?"}
    Q1 -- No --> Redefine1["Re-evaluate scope<br/>or abort engagement"]
    Redefine1 --> P1

    Q1 -- Yes --> P2["2. Investigate<br/><i>Research options, tech stack and ROI</i>"]

    P2 --> Q2{"Technical and commercial<br/>feasibility validated?"}
    Q2 -- No --> Pivot["Pivot strategy /<br/>Explore alternative tech"]
    Pivot --> P2

    Q2 -- Yes --> P3["3. Define<br/><i>Scope deliverables, budget and schedule</i>"]

    P3 --> Q3{"Proposal and SLA<br/>approved by client?"}
    Q3 -- No --> Adjust["Adjust terms,<br/>budget or timeline"]
    Adjust --> P3

    Q3 -- Yes --> P4["4. Mobilize<br/><i>Assemble experts, tools and environment</i>"]

    P4 --> Q4{"Resources and stack<br/>fully operational?"}
    Q4 -- No --> Resolve["Resolve bottlenecks<br/>/ Onboard specialists"]
    Resolve --> P4

    Q4 -- Yes --> P5["5. Deliver<br/><i>Execute, test, document and handover</i>"]

    P5 --> Q5{"Deliverables validated<br/>and accepted?"}
    Q5 -- No --> Refine["Iterate and refine<br/>implementation"]
    Refine --> P5

    Q5 -- Yes --> End([Project Handover and Success])
```
:::
::::
<FeluqaButton tag="a" href="/company/about-us/delivery-model"
	label="How we work"/>



## Independent by design. <span class='silky-bbi+115'>Curious by nature.</span>

Numerimondes was founded by **Yassine El Moumen**, its founder and managing director.

His background brings together operational management, project delivery, training, consulting and software engineering. An ongoing interest in research, technology, markets and how organizations work informs the ideas and initiatives explored at Numerimondes.

This combination of field experience and technical inquiry shapes an approach grounded in business realities, creative problem-solving and practical execution.

Numerimondes SARL AU is an independent Moroccan company headquartered in Casablanca. Its registered activities span management and business development consulting, information systems, technology, digital marketing, security, training, contact-centre operations, recruitment and IT-related products and equipment. Individual offerings are introduced as they become ready for delivery.



:::: info Become a partner and grow with us
We collaborate with independent professionals and organizations that identify opportunities, contribute specialist expertise or open access to new markets.

**Morocco Only Opportunity**

::: details Accounting and advisory firms
Introduce clients who could benefit from operational, organizational or technical support. You retain your trusted advisory relationship; introductions occur with the client's consent and each assignment is scoped individually.
:::

**World wide opportunities**

::: details Business development and referral partners
Identify qualified opportunities, introduce prospective clients and collaborate on selected commercial activities. Commission and referral terms are agreed in writing for eligible assignments.
:::

::: details Freelancers and specialist partners
Join project teams when your expertise fits an assignment — across software engineering, including Rust, infrastructure, business consulting and other relevant specialties.
:::


<div style="display: flex; gap: 15px;margin-bottom:.5rem;">
<FeluqaButton tag="a" color="dark" href="/opportunities" label="Explore partnerships"/>
<FeluqaButton tag="a" color="dark" href="/company/about-us/about-us" label="More about us"/>
</div>

::::


## Initiatives in <span class='silky-bbi+115'>development</span>

Our internal initiatives are part of the way we research, experiment and build future capabilities.

<MegaCards
  :items="[
    {
      title: 'Feluqa',
      description: 'Coming soon. A Rust-based, cross-platform application framework for efficient systems across deployment environments.',
      href: '/company/initiatives/feluqa',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      icon: '/images/home/initiatives/feluqa.svg'
    },
    {
      title: 'The Best Recruit',
      description: 'Coming soon. A recruitment initiative to help employers discover and evaluate relevant profiles.',
      href: '/company/initiatives/the-best-recruit',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
      icon: '/images/home/initiatives/the-best-recruit.svg'
    },
    {
      title: 'SPMPST',
      description: 'Specification in development. A proposed standard for portable, structured Markdown content and site-building workflows.',
      href: '/company/initiatives/spmpst',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      icon: '/images/home/initiatives/spmpst.svg'
    }
  ]"
  :composition="[
    { items: [0, 1] },
    { items: [2] }
  ]"
  :more="{
    title: 'Discover all our 3 initiatives',
    description: 'Explore our current and upcoming projects',
    href: '/company/initiatives/initiatives',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'
  }"
  :card-height="220"
/>

## Clear scope. Clear commercial <span class='silky-bbi+115'>terms.</span>

Our proposals are structured around the type of work, the complexity of the mission and the responsibilities involved. Consulting, feasibility studies, implementation and ongoing services may follow different pricing models.

Explore how we scope engagements and prepare commercial proposals.

<FeluqaButton tag="a" href="/services/business-advisory/pricing" label="Our pricing approach"/>

<!-- Pricing page: explain discovery, fixed-fee vs milestone vs recurring support,
what affects a quote, and written agreements. Do not publish invented rates or blanket guarantees.
-->



## What could your next opportunity <span class='silky-bbi+115'>become?</span>

Share a challenge, an idea, a business objective or a project you want to explore. We can discuss its potential, the decisions involved and a practical next step.

<div style="display: flex; gap: 15px;">
	<FeluqaButton tag="a"
		color="gray"
		href="/company/prologue/contact" label="Start a conversation"/>
	<FeluqaButton tag="a"
		color="gray"
		href="/opportunities" label="Become a partner"/>
</div>


<!-- INTERNAL PUBLISHING NOTES — DO NOT RENDER
1. Website position: consulting + innovation + solutions + execution. Do not reduce Numerimondes to software.
2. State benefits as aims or project-dependent outcomes; do not fabricate case studies, metrics or success claims.
3. Project-by-project operating model: a single accountable counterpart, adaptable mission teams.
4. Founder visibility is intentional; avoid implying a large permanent employee base.
5. Feluqa and The Best Recruit: Coming soon. SPMPST: specification in development.
6. The Best Recruit must not advertise live placements or an active candidate service before launch.
7. Showcases must distinguish real delivered work from concepts and RandD.
8. Partner compensation is subject to specific written terms; avoid generic promised commission percentages.
9. Pricing page explains methodology and commercial models, not an unverified price list.
10. Main navigation suggestion: Services / Solutions and Showcase / Innovation / Partners / About / Contact.
11. Utility links: Pricing / Feluqa / The Best Recruit / SPMPST.
-->

</div>
