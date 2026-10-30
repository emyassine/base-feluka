---
sidebarTitle: "Home"
icon: "house"
title: "Feluqa"
description: "Feluqa developer documentation for applications, modules, and platform contributors. One namespace across web, workstation, mobile, APIs, and real-time systems."
layout: home
markdownStyles: false
pageClass: site-home
---

<HomeHero
  eyebrow="A platform for business software"
  status="Development preview · web first"
  :title="['Shared contracts.', 'Separate runtimes.']"
  :accent-index="1"
  lead="Build the web product first. Keep shared contracts for workstation, mobile and local deployments as the platform expands."
  :actions="[
    { label: 'Start building', href: '/get-started/' },
    { label: 'Read the architecture', href: '/get-started/introduction/architecture-overview' }
  ]"
  :facts="[
    { label: 'Rust' },
    { label: 'Web first' },
    { label: 'Local runtime', suffix: 'target' }
  ]"
/>

<HomeRuntimes
  label="Runtime profiles"
  :items="[
    { name: 'Server', tone: 'partial', status: 'Partial' },
    { name: 'Workstation', tone: 'target', status: 'Target' },
    { name: 'Mobile client', tone: 'target', status: 'Target' },
    { name: 'Embedded · no_std', tone: 'exploring', status: 'Exploring' }
  ]"
  note="One SDK, separate runtime profiles. Status reflects this repository, not a release guarantee."
/>

<HomeCapabilities
  kicker="Foundations"
  title="Foundations you can inspect, not a promise you have to trust."
  copy="The current repository ships selected framework foundations. Each line states its implementation status, so planned work is never presented as shipped behaviour."
  :items="[
    {
      index: '01',
      title: 'Compile-time composition',
      description: 'Panels, resources, permissions and routes are declared with attributes and collected by the scanner. No manual registry, no magic strings.',
      tone: 'partial',
      status: 'Partial',
      tags: ['attributes', 'scanner', 'routes']
    },
    {
      index: '02',
      title: 'One permission model',
      description: 'Tenant-bound principals, roles and delegated grants are enforced by the server, independently of what the interface chooses to show.',
      tone: 'partial',
      status: 'Partial',
      tags: ['tenants', 'RBAC', 'audit']
    },
    {
      index: '03',
      title: 'Typed Live actions',
      description: 'Live dispatch validates typed input, session and CSRF state, authorization, bounded work and replay policy before a handler runs.',
      tone: 'partial',
      status: 'Partial',
      tags: ['typed', 'signed', 'replay']
    },
    {
      index: '04',
      title: 'Schema-driven panels',
      description: 'Panels and resources render from a versioned UI schema. Presentation stays declarative; services keep ownership of business operations.',
      tone: 'partial',
      status: 'Partial',
      tags: ['SDUI', 'panels', 'resources']
    },
    {
      index: '05',
      title: 'SQLite and PostgreSQL',
      description: 'Named connection pools, SeaORM models and embedded dialect migrations with checksums. SQLite for local installs, PostgreSQL for hosted deployments.',
      tone: 'implemented',
      status: 'Implemented',
      tags: ['SeaORM', 'migrations', 'pools']
    },
    {
      index: '06',
      title: 'Local-first deployment',
      description: 'A local host is meant to serve nearby clients without Internet, with bundled assets and SQLite persistence. Disconnected sync remains open design work.',
      tone: 'target',
      status: 'Target',
      tags: ['offline', 'local host', 'sync']
    }
  ]"
/>

<HomeCompose
  kicker="Composition"
  title="Composition, not configuration."
  copy="A product composes applications; an application composes modules. Portability comes from shared contracts, not from forcing every runtime to behave the same way."
  code-label="bookstore · src/orders.rs"
  :code="[
    { text: '// declared once, composed by the scanner', tone: 'comment' },
    { text: '#[panel(path = &#34;bookstore&#34;)]', tone: 'attribute' },
    { text: `#[resource(Book, scope = tenant)]`, tone: 'attribute' },
    { text: '#[gate(role = &#34;clerk&#34;)]', tone: 'attribute' },
    { text: 'fn create_order(input: OrderInput) -> Result<Order> {', tone: 'function' },
    { text: '    orders.create(input).await', tone: 'plain' },
    { text: '}', tone: 'plain' }
  ]"
  code-foot="scanner · routes · permissions · manifests"
  :stages="[
    { index: '01', title: 'Product', description: 'The solution people use, with its own audience and deployment story.', chips: ['Bookstore'] },
    { index: '02', title: 'Applications', description: 'Deployable programs for a target role, built from the modules they need.', chips: ['Web', 'Workstation'] },
    { index: '03', title: 'Modules', description: 'Self-contained business capabilities with their own version and permissions.', chips: ['Sales', 'Inventory'] },
    { index: '04', title: 'Contracts', description: 'One namespace for panels, resources, permissions, audit and storage.', chips: ['feluqa'] }
  ]"
  note="This is the target model. The current repository is a statically composed development consumer; dynamic module installation is still planned."
  link-label="Read the architecture overview"
  link-href="/get-started/introduction/architecture-overview"
/>

<HomeLocalFirst
  kicker="Local-first"
  :title="['Built for the room,', 'not only the cloud.']"
  :accent-index="1"
  copy="Feluqa is designed for hosted deployments and disconnected environments: a local host, nearby clients, bundled assets and SQLite storage. Sensitive sites should not need an external service to open the application."
  :bullets="[
    'Bundled UI assets and local fonts',
    'SQLite as the proposed local default',
    'No required external services',
    'Disconnected sync and conflict behaviour remain open design work'
  ]"
  link-label="Read the deployment guides"
  link-href="/get-started/"
/>

<HomeSteps
  kicker="Getting started"
  title="From domain to running app."
  copy="Start with the documented foundations, then follow the guides as the platform grows. The commands below show the intended development loop."
  :steps="[
    { index: '01', title: 'Describe the domain', description: 'Model the business concepts, modules and permissions your application needs.' },
    { index: '02', title: 'Compose the application', description: 'Select modules and target profiles. Shared contracts keep behaviour portable.' },
    { index: '03', title: 'Run it locally', description: 'Develop against SQLite, then deploy the same application to a hosted server.' }
  ]"
  terminal-label="bookstore — feluqa dev"
  :terminal="[
    { text: '$ feluqa new bookstore', tone: 'prompt' },
    { text: '  created feluqa.toml', tone: 'dim' },
    { text: '  created src/main.rs', tone: 'dim' },
    { text: '$ cd bookstore', tone: 'prompt' },
    { text: '$ feluqa dev', tone: 'prompt' },
    { text: '  compiling workspace …', tone: 'dim' },
    { text: '  applying migrations …', tone: 'dim' },
    { text: '  serving http://127.0.0.1:8080', tone: 'ok' }
  ]"
  :actions="[
    { label: 'Install Feluqa', href: '/get-started/installation/' },
    { label: 'Follow the first-application guide', href: '/learn/create-your-first-application' }
  ]"
/>

<HomeCta
  kicker="Start here"
  :title="['Start with what exists.', 'Follow what comes next.']"
  :accent-index="1"
  copy="Feluqa is under active development. The guides separate implemented foundations from target design, so you can adopt what is ready and plan for what is not."
  primary-label="Open the guides"
  primary-href="/get-started/"
  secondary-label="Read the internals"
  secondary-href="/feluqa-internals/"
  :legend="[
    { tone: 'implemented', label: 'Implemented', description: 'available in the baseline' },
    { tone: 'partial', label: 'Partial', description: 'foundations exist' },
    { tone: 'target', label: 'Target', description: 'agreed design' },
    { tone: 'exploring', label: 'Exploring', description: 'may change' }
  ]"
  note="Documentation status · reviewed October 2026"
/>
