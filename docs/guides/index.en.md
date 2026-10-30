---
sidebarTitle: "Home"
icon: "badge-check"
description: Guides for building applications, understanding the platform, and contributing to its development.
layout: home
---

<MainlineHomeLayout>
<template #top>
<MainlineHero
      title="Mainline Next.js template"
      lead="Mainline is an open-source website template built with shadcn/ui, Tailwind 4 &amp; Next.js"
      primary-label="Get template"
      primary-href="https://github.com/shadcnblocks/mainline-nextjs-template"
      secondary-label="Built by shadcnblocks.com"
      secondary-href="https://shadcnblocks.com"
      hero-alt="hero"
      :points='[
        { title: "Tailored workflows", description: "Track progress across custom issue flows." },
        { title: "Cross-team projects", description: "Collaborate across teams and departments." },
        { title: "Milestones", description: "Break projects down into concrete phases." },
        { title: "Progress insights", description: "Track scope, velocity, and progress over time." }
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

<MainlineGuideBlocks
      eyebrow="MEASURE TWICE. CUT ONCE."
      title="Made for modern product teams"
      description="Mainline is built on the habits that make the best product teams successful: staying focused, moving quickly, and always aiming for high-quality work."
      :items='[
        { title: "Purpose-built for product development", image: "triage-card", href: "#" },
        { title: "Manage projects end-to-end", image: "cycle-card", href: "#" },
        { title: "Build momentum and healthy habits", image: "overview-card", href: "#" }
      ]'
    />

<MainlineResourceBlock
      title="Mainline your resource allocation and execution"
      :items='[
        { title: "Reusable issue templates.", description: "Draft lightning-fast documents with our Smart Instructions and Templates.", imageAlt: "Issue template interface" },
        { title: "Simplify your stack.", description: "No more Confluence, SharePoint, or Microsoft Word." },
        { title: "Graveyard it.", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.", imageAlt: "Graveyard interface" },
        { title: "Task discussions.", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.", imageAlt: "Task discussions interface" },
        { title: "Notifications.", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.", imageAlt: "Notifications interface" }
      ]'
    />
</template>

<template #middle>
<MainlineTestimonials
    title="Trusted by product builders"
    description="Mainline is built on the habits that make the best product teams successful: staying focused, moving quickly, and always aiming for high-quality work."
    action-label="Read our Customer Stories"
    :items='[
      { quote: "We\u0027re misusing Mainline as a CRM and it still works!", author: "Amy Chase", role: "PM", company: "Mercury Finance", image: "amy-chase" },
      { quote: "I was able to replace 80% of my team with Mainline bots.", author: "Jonas Kotara", role: "Lead Engineer", company: "Mercury Finance", image: "jonas-kotara" },
      { quote: "Founder Mode is hard enough without having a really nice PM app.", author: "Kevin Yam", role: "Founder", company: "Mercury Finance", image: "kevin-yam" },
      { quote: "I can use the tool as a substitute from my PM.", author: "Kundo Marta", role: "Founder", company: "Mercury Finance", image: "kundo-marta" },
      { quote: "We\u0027re misusing Mainline as a CRM and it still works!", author: "Amy Chase", role: "PM", company: "Mercury Finance", image: "amy-chase" },
      { quote: "I was able to replace 80% of my team with Mainline bots.", author: "Jonas Kotara", role: "Lead Engineer", company: "Mercury Finance", image: "jonas-kotara" },
      { quote: "Founder Mode is hard enough without having a really nice PM app.", author: "Kevin Yam", role: "Founder", company: "Mercury Finance", image: "kevin-yam" },
      { quote: "I can use the tool as a substitute from my PM.", author: "Kundo Marta", role: "Founder", company: "Mercury Finance", image: "kundo-marta" }
    ]'
  />
</template>

<template #bottom>
<MainlinePricing
      title="Pricing"
      description="Use Mainline for free with your whole team. Upgrade to enable unlimited issues, enhanced security controls, and additional features."
      action-label="Get started"
      :plans='[
        { name: "Free", monthlyPrice: "$0", yearlyPrice: "$0", description: "Free for everyone", features: ["Unlimited members", "2 teams", "500 issues", "Slack and Github integrations"] },
        { name: "Startup", monthlyPrice: "$8", yearlyPrice: "$6", features: ["All free plan features and...", "Mainline AI", "Unlimited teams", "Unlimited issues and file uploads", "Mainline Insights", "Admin roles"] },
        { name: "Enterprise", monthlyPrice: "$8", yearlyPrice: "$6", features: ["All free plan features and...", "Mainline AI", "Supermainline AGI", "Free daily catered lunch", "random HIPPA audits"] }
      ]'
    />

<MainlineFaq
      title="Got Questions?"
      lead="If you can't find what you're looking for,"
      contact-label="get in touch"
      contact-href="/contact"
      closing-punctuation="."
      :categories='[
        { title: "Support", questions: [
          { question: "How do I update my account ?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." },
          { question: "Is support free, or do I need to Google everything?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." },
          { question: "Are you going to be subsumed by AI?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." }
        ] },
        { title: "Your account", questions: [
          { question: "Is support free, or do I need to Google everything?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." },
          { question: "Are you going to be subsumed by AI?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." }
        ] },
        { title: "Other questions", questions: [
          { question: "Is support free, or do I need to Google everything?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." },
          { question: "Are you going to be subsumed by AI?", answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos." }
        ] }
      ]'
    />
</template>

<template #footer>
	  <MainlineCta
	    title="Start your free trial today"
	    description="Mainline is the fit-for-purpose tool for planning and building modern software products."
	    action-label="Get template"
	    action-href="https://github.com/shadcnblocks/mainline-nextjs-template"
	    :navigation='[
	      { name: "Product", href: "/#feature-modern-teams" },
	      { name: "About Us", href: "/about" },
	      { name: "Pricing", href: "/pricing" },
	      { name: "FAQ", href: "/faq" },
	      { name: "Contact", href: "/contact" },
	      { name: "Xwitter", href: "https://x.com/ausrobdev", external: true },
	      { name: "LinkedIn", href: "#", external: true }
	    ]'
	    legal-label="Privacy Policy"
	    legal-href="/privacy"
	    logo-alt="Mainline"
	  />
</template>
</MainlineHomeLayout>
