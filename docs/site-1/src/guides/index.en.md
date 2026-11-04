---
sidebarTitle: "Home"
icon: "@spmpst::icon::badge-check"
description: Guides for building applications, understanding the platform, and contributing to its development.
layout: home
---

<MainlineHomeLayout>
	<MainlineHero
	  title="The software your operations run on. Built once, delivered everywhere."
	  lead="From the factory floor to the field unit to the back office: one application, built around how your organization works, on every device you operate."
	  primary-label="Describe your operation"
	  primary-href="/for-organizations#tell-us-about-your-operation"
	  secondary-label="See what is tested today"
	  secondary-href="/products/"
	  :targets='[
	    { label: "Web", caption: "Back office in the browser", image: "/media/images/targets/web.svg", alt: "Feluqa web application" },
	    { label: "Workstation", caption: "Operator workstation", image: "/media/images/targets/workstation.svg", alt: "Feluqa workstation application" },
	    { label: "Mobile", caption: "Field use on a phone", image: "/media/images/targets/mobile.svg", alt: "Feluqa mobile application" },
	    { label: "Real-time", caption: "Live operations view", image: "/media/images/targets/realtime.svg", alt: "Feluqa real-time dashboard" },
	    { label: "APIs", caption: "Integration with your existing systems", image: "/media/images/targets/api.svg", alt: "Feluqa API console" }
	  ]'
  :points='[
	    { title: "Minimal and expressive", description: "Describe what the application is with standardized structs and components. The platform handles the rest.", icon: "/media/icons/conventions-code.svg" },
	    { title: "One foundation, every target", description: "Share schemas, tooling, and libraries while keeping distinct runtime profiles per target.", icon: "/media/icons/starter-layers.svg" },
	    { title: "Ready for agents", description: "Predictable contracts let agents inspect, propose, and validate changes for human review.", icon: "/media/icons/agents-bot.svg" },
	    { title: "Honest about status", description: "Every guide marks what is implemented, partial, targeted, or still being explored.", icon: "/media/icons/configuration-sliders.svg" }
	  ]'
	/>

<MainlineLogos
      title="Powering the world's best product teams."
      subtitle="From next-gen startups to established enterprises."
      :companies='[
        { name: "Mercury", logo: "mercury", width: 143, height: 26, href: "https://mercury.com" },
        { name: "Watershed", logo: "watershed", width: 154, height: 31, href: "https://watershed.com" },
        { name: "Retool", logo: "retool", width: 113, height: 22, href: "https://retool.com" },
        { name: "Descript", logo: "descript", width: 112, height: 27, href: "https://descript.com" },
        { name: "Perplexity", logo: "perplexity", width: 141, height: 32, href: "https://perplexity.com" },
        { name: "Monzo", logo: "monzo", width: 104, height: 18, href: "https://monzo.com" },
        { name: "Ramp", logo: "ramp", width: 105, height: 28, href: "https://ramp.com" },
        { name: "Raycast", logo: "raycast", width: 128, height: 33, href: "https://raycast.com" },
        { name: "Arc", logo: "arc", width: 90, height: 28, href: "https://arc.com" }
      ]'
    />


<FlexCarousel
    title="Explore Feluqa"
    description="Follow practical guides, understand the platform direction, and check what is implemented today."
    preset="ribbon"
    :card-height="0.46"
    :gap="16"
    autoplay
    :dispersion="0.7"
    click-action="modal"
    show-card-button
    :items='[
      { src: "https://images.unsplash.com/photo-1737071371043-761e02b1ef95?w=1200&q=80&auto=format&fit=max", alt: "Abstract chrome sculpture", title: "Start building", actionLabel: "Get started", subtitle: "Toolchain, app structure, and practical guides.", href: "/get-started/" },
      { src: "https://images.unsplash.com/photo-1693645325828-62cd35c8da8f?w=1200&q=80&auto=format&fit=max", alt: "A figure in a minimal studio", title: "Platform architecture", actionLabel: "Explore architecture", subtitle: "Product direction, runtimes, and workspace design.", href: "/internals/" },
      { src: "https://images.unsplash.com/photo-1739056238917-d89cd05c48d5?w=1200&q=80&auto=format&fit=max", alt: "A sculptural liquid-metal form", title: "Implementation status", actionLabel: "View implementation", subtitle: "See the current foundations and remaining work.", href: "/agents/" },
      { src: "https://images.unsplash.com/photo-1747191092806-c7da11881986?w=1200&q=80&auto=format&fit=max", alt: "A clay study sculpture", title: "Contribute", actionLabel: "Read contribution guide", subtitle: "Read the contributor guidance before making changes.", href: "/prologue/contribution-guide" },
      { src: "https://images.unsplash.com/photo-1770249196550-ff6c641165cb?w=1200&q=80&auto=format&fit=max", alt: "A chrome humanoid sculpture", title: "Workstation runtime", actionLabel: "Explore workstation apps", subtitle: "Standalone apps with dedicated runtime profiles.", href: "/get-started/" },
      { src: "https://images.unsplash.com/photo-1787181875088-087d612262a7?w=1200&q=80&auto=format&fit=max", alt: "A black textured sculpture with an opening at its center", title: "System Control Panel", actionLabel: "Explore the control panel", subtitle: "Manage modules and context roots from the built-in panel.", href: "/get-started/frontend/system-panel" }
    ]'
  />

</MainlineHomeLayout>
