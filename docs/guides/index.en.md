---
sidebarTitle: "Home"
icon: "badge-check"
description: Guides for building applications, understanding the platform, and contributing to its development.
layout: home
---

<MainlineHomeLayout>
<MainlineHero
      title="One platform for every application target."
      lead="A unified namespace and SDK for web, workstation, mobile, games, APIs, and real-time systems—with separate target runtimes."
      primary-label="Get started"
      primary-href="/get-started/"
      secondary-label="Explore the architecture"
      secondary-href="/internals/"
      hero-alt="hero"
      :points='[
        { title: "One shared foundation", description: "Compose a business module into a hosted application or a standalone workstation product." },
        { title: "Purpose-built runtimes", description: "Share schemas, tooling, and libraries while retaining distinct runtime profiles." },
        { title: "Current implementation", description: "Selected framework foundations are implemented. Dynamic module installation and complete runtime shells remain unfinished." }
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

<ReactDevHome>
  <ReactDevBlockComponents
    title="Compose product interfaces from typed views"
    lead="Build product pages from small, reusable view templates. Feluqa compiles `.view.rs` files into the application and keeps data and rendering responsibilities explicit."
    detail="The view compiler is implemented. Shared UI contracts and a complete accessible component catalogue are still being integrated."
    code-title="resources/views/catalog/product-card.view.rs"
    :code-lines='["@rs", "let name = product.name();", "let price = product.formatted_price();", "@endrs", "<article class=\"product-card\">", "  <h2>{{ name }}</h2>", "  <p>{{ price }}</p>", "</article>"]'
    markup-title="Keep the frontend independent"
    markup-lead="Feluqa is headless-first: application contracts and services do not depend on a UI framework."
    markup-detail="Feluqa is meant to work with React or any frontend framework. Vue and plain HTML are also intended consumers; complete frontend integrations remain in progress."
    markup-code-title="resources/views/catalog/index.view.rs"
    :markup-code-lines='["@foreach (product in products)", "  @include(\"catalog::product-card\", product = product)", "@endforeach"]'
    :content-replacements='{
      "Video.js": "resources/views/catalog/product-card.view.rs",
      "VideoList.js": "resources/views/catalog/index.view.rs",
      "My video": "Feluqa module",
      "First video": "Inventory module",
      "Second video": "Order module",
      "Third video": "Customer module",
      "3 Videos": "3 business modules",
      "Video description": "Reusable, typed application component"
    }'
  />

  <ReactDevBlockInteractivity
    title="Connect interactive views to typed actions"
    lead="Feluqa Live defines typed action contracts. Server handlers validate input, authorize every action, and own business behavior regardless of which frontend sends the request."
    detail="The snippet illustrates Rust domain logic, not a complete Live handler. Browser reconciliation and shared replay support remain under development."
    preview-title="Live product search"
    preview-subtitle="Search a catalog through a typed action"
    code-title="crates/catalog/src/search.rs"
    :code-lines='["#[derive(Debug)]", "pub struct ProductSearch {", "    pub query: String,", "}", "", "pub fn matches_query(name: &str, query: &str) -> bool {", "    name.to_lowercase().contains(&query.to_lowercase())", "}"]'
    cta-label="Explore panels and Live"
    cta-href="/get-started/frontend/panels"
    cta-icon="code"
    :content-replacements='{
      "SearchableVideoList.js": "crates/catalog/src/search.rs",
      "First video": "Wireless sensor",
      "Second video": "Gateway device",
      "Third video": "Temperature probe",
      "React Videos": "Live product search",
      "Search": "Search products",
      "Video description": "Typed catalog result"
    }'
  />

  <ReactDevBlockFramework
    title="Build within an opinionated application framework"
    lead="Feluqa gives every application a consistent structure for configuration, route composition, compiled views, and shared contracts. It provides conventions across the application lifecycle so teams can focus on business workflows."
    detail="Application composition is selected in `feluqa.toml` and compiled statically today. Dynamic module installation, complete runtime shells, and standalone generated-app builds remain unfinished."
    demo-label="Feluqa showcase"
    code-title="feluqa.toml"
    :code-lines='["[app]", "name = \"Bookstore\"", "profile = \"web\""]'
    cta-label="Read the architecture"
    cta-href="/internals/"
    cta-icon="framework"
    :content-replacements='{
      "confs/[slug].js": "feluqa.toml",
      "React Videos": "Feluqa application preview",
      "React Conf": "Feluqa showcase"
    }'
  />

  <ReactDevBlockPlatforms
    title="One product across web, native, and connected devices"
    lead="Feluqa targets hosted web, workstation, mobile, games, APIs, real-time systems, and IoT through one namespace and SDK, with runtimes suited to each destination."
    detail="Web delivery is the first priority. Local hosting for nearby clients without Internet is a product requirement; workstation storage, device synchronization, and conflict behavior remain open work."
    web-title="Serve web applications and local networks"
    web-detail="The web profile composes routes from their owning sites, panels, and modules. It can serve nearby clients as a local host; web delivery comes first."
    native-title="Reach workstations, mobile, and IoT"
    native-detail="Dedicated runtimes are the target for standalone workstation, mobile, and connected device applications. Workstation storage and offline synchronization design remain open."
    cta-label="Explore target platforms"
    cta-href="/internals/"
    cta-icon="native"
  />
</ReactDevHome>

<MainlineGuideBlocks
      title="Find your way through the guides"
      description="Start building, explore platform architecture, or find the contribution guidance that fits your work."
      :items='[
        { title: "Start building", description: "Prepare the toolchain, learn the application structure, and follow practical guides.", image: "triage-card", links: [{ label: "Get started", href: "/get-started/" }, { label: "Learn by building", href: "/learn/" }] },
        { title: "Understand the platform", description: "Read the product direction, runtime model, compilation approach, and workspace architecture.", image: "cycle-card", links: [{ label: "Product and audience", href: "/get-started/introduction/product-and-audience" }, { label: "Platform internals", href: "/internals/" }] },
        { title: "Contribute", description: "Check the implementation status and contributor rules before changing the framework.", image: "overview-card", links: [{ label: "Agent guidance", href: "/agents/" }, { label: "Contribution guide", href: "/prologue/contribution-guide" }] }
      ]'
    />

<MainlineResourceBlock
      title="A shared foundation, with purpose-built runtimes"
      :items='[
        { title: "Starting a Feluqa app", description: "A short article on choosing a useful first workflow and composing an application with the current tools.", linkLabel: "Read the article", href: "/articles/starting-a-feluqa-app", imageAlt: "Starting a Feluqa application" },
        { title: "Separate target runtimes.", description: "Share tooling and contracts while keeping runtime profiles suited to each destination.", linkLabel: "Explore platform internals", href: "/internals/" },
        { title: "Portable path ownership.", description: "Context roots and portable paths define where an application owns its data.", linkLabel: "Read storage guidance", href: "/storage/storage-backends-and-paths", imageAlt: "Portable path ownership" },
        { title: "A built-in control panel.", description: "Shared panel contracts exist; complete System Panel and UI integration remain planned work.", linkLabel: "Read the panel status", href: "/get-started/frontend/system-panel", imageAlt: "System control panel" },
        { title: "Local-first operation.", description: "Serving nearby clients without Internet is a product requirement; sync and conflict behavior remain open.", linkLabel: "Read the local-first direction", href: "/internals/", imageAlt: "Local-first application" }
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



<MainlineFaq
      title="Ask your Questions"
      lead="Read the guides for implementation details and the current status of the work."
      :items='[
        { question: "What is Feluqa?", answer: "A proprietary platform and unified namespace for building applications across web, workstation, mobile, games, APIs, and real-time systems. The target architecture is still under development." },
        { question: "Where should I start?", answer: "Start with Get started to understand the product direction, prepare an environment, and follow the application guides." },
        { question: "Is the complete platform available today?", answer: "No. Selected framework foundations are implemented; dynamic module installation, complete runtime shells, and several product capabilities remain unfinished." }
      ]'
    />

<MainlineCta
	title="Build with the current foundations"
	description="Follow the guides, check what is implemented, and help move the framework forward."
	action-label="Read the contribution guide"
	action-href="/prologue/contribution-guide"
	:navigation='[
		{ name: "Product", href: "/#feature-modern-teams" },
		{ name: "About Us", href: "https://numerimondes.com", external: true },
		{ name: "Pricing", href: "https://numerimondes.com", external: true },
		{ name: "FAQ", href: "/faq" },
		{ name: "Contact", href: "https://numerimondes.com", external: true },
		{ name: "Xwitter", href: "https://x.com/ausrobdev", external: true },
		{ name: "LinkedIn", href: "#", external: true }
	]'
	legal-label="Privacy Policy"
	legal-href="https://numerimondes.com"
	logo-alt="Feluqa"
/>
</MainlineHomeLayout>
