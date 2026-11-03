---
title: "Service Marketplace | Numerimondes"
sidebarTitle: "Marketplace"
icon: "@spmpst::icon::store"
description: "A catalogue of outcome-based consulting, software, infrastructure and operations services."
lang: en
status: "demo"
layout: home
---

<script setup lang="ts">
import { computed, ref } from 'vue'

type Engagement = 'Project' | 'Workshop' | 'Recurring'
type Delivery = 'Human-led' | 'Automation-assisted' | 'Hybrid'

interface Service {
  id: string
  category: string
  title: string
  outcome: string
  engagement: Engagement
  delivery: Delivery
  duration: string
  quoteBasis: string
  quoteFormula: string
  deliverables: string[]
  drivers: string[]
  cta: string
  featured?: boolean
}

const services: Service[] = [
  {
    id: 'diagnostic', category: 'Business advisory', title: 'Business and operations diagnostic',
    outcome: 'A clear picture of how work really happens, where it breaks, and which improvements are worth making first.',
    engagement: 'Project', delivery: 'Human-led', duration: '2–4 weeks',
    quoteBasis: 'By quotation', quoteFormula: 'Estimated specialist time × agreed rate, plus any approved travel or research expenses.',
    deliverables: ['Current-state process summary', 'Prioritised improvement options', 'Short written findings and next steps'],
    drivers: ['Number of teams, processes or locations involved', 'Availability and quality of existing information', 'Required interviews, analysis and final deliverables'],
    cta: 'Request a diagnostic quote', featured: true,
  },
  {
    id: 'discovery', category: 'Business advisory', title: 'Project discovery study',
    outcome: 'An early idea or complex requirement turned into options, risks, requirements and a decision-ready delivery plan.',
    engagement: 'Project', delivery: 'Hybrid', duration: '3–6 weeks',
    quoteBasis: 'Fixed scope or milestones', quoteFormula: 'Research and analysis effort + agreed outputs + any approved specialist or third-party costs.',
    deliverables: ['Requirements and risk register', 'Options and recommendation', 'Delivery plan and indicative budget'],
    drivers: ['Technical and commercial uncertainty to resolve', 'Systems, integrations and stakeholders to review', 'Depth of the business case, prototype or specification'],
    cta: 'Scope a discovery study',
  },
  {
    id: 'software', category: 'Software and automation', title: 'Workflow or internal tool',
    outcome: 'A working application, dashboard, integration or automation built around an agreed operating need.',
    engagement: 'Project', delivery: 'Automation-assisted', duration: '4–12 weeks',
    quoteBasis: 'Milestone or fixed-scope quote', quoteFormula: 'Estimated design and development effort + agreed testing and handover + approved licensing or infrastructure.',
    deliverables: ['Working software in your environment', 'Documentation and handover', 'Agreed warranty or support window'],
    drivers: ['Number of user roles, workflows and screens', 'Data migration, integrations and access controls', 'Hosting, documentation and ongoing support needs'],
    cta: 'Discuss a software project', featured: true,
  },
  {
    id: 'reporting', category: 'Software and automation', title: 'Reporting and data cleanup',
    outcome: 'Reliable recurring reports from the spreadsheets, exports and systems you already use.',
    engagement: 'Project', delivery: 'Automation-assisted', duration: '1–3 weeks',
    quoteBasis: 'Fixed scope', quoteFormula: 'Number of sources and reports × cleanup complexity, with agreed review rounds.',
    deliverables: ['Cleaned and documented data set', 'Automated or repeatable report', 'Short usage guide'],
    drivers: ['Number and quality of data sources', 'Reports and refresh frequency required', 'Validation rules and access restrictions'],
    cta: 'Request a reporting quote',
  },
  {
    id: 'infrastructure', category: 'Infrastructure and IT', title: 'Infrastructure and deployment review',
    outcome: 'Practical recommendations for deployment, backup, monitoring or continuity in a hosted or self-hosted environment.',
    engagement: 'Project', delivery: 'Human-led', duration: '1–3 weeks',
    quoteBasis: 'Scoped review or implementation quote', quoteFormula: 'Environment size + review depth + agreed recommendations or implementation tasks.',
    deliverables: ['Environment and risk overview', 'Prioritised remediation plan', 'Optional implementation of agreed items'],
    drivers: ['Servers, applications, sites and equipment in scope', 'Access, documentation and operational constraints', 'Required testing, migration and follow-up support'],
    cta: 'Request an infrastructure quote',
  },
  {
    id: 'managed-it', category: 'Infrastructure and IT', title: 'Managed IT operations',
    outcome: 'Your IT keeps running: patching, monitoring, user provisioning and alert handling delivered as an ongoing service.',
    engagement: 'Recurring', delivery: 'Hybrid', duration: 'Monthly, 6-month minimum suggested',
    quoteBasis: 'Monthly or capacity-based quote', quoteFormula: 'Covered users and systems + service window + reporting, with exclusions listed in writing.',
    deliverables: ['Routine maintenance and monitoring', 'Incident handling within the agreed window', 'Monthly service report'],
    drivers: ['Users, devices and systems covered', 'Response expectations and service hours', 'Compliance, reporting and improvement work'],
    cta: 'Discuss managed IT', featured: true,
  },
  {
    id: 'equipment', category: 'Infrastructure and IT', title: 'IT equipment sourcing and setup',
    outcome: 'The right equipment selected, supplied, configured and documented for your team or site.',
    engagement: 'Project', delivery: 'Human-led', duration: '1–4 weeks',
    quoteBasis: 'Itemised quote', quoteFormula: 'Equipment cost at supplier price + configuration and installation effort + any agreed warranty handling.',
    deliverables: ['Itemised specification and quote', 'Configured and tested equipment', 'Inventory and handover notes'],
    drivers: ['Quantity and type of equipment', 'Configuration and on-site installation needs', 'Delivery location and warranty requirements'],
    cta: 'Request an equipment quote',
  },
  {
    id: 'security', category: 'Security', title: 'Security baseline review',
    outcome: 'A realistic view of your exposure and a short list of fixes that reduce the most risk first.',
    engagement: 'Project', delivery: 'Hybrid', duration: '1–3 weeks',
    quoteBasis: 'Scoped review', quoteFormula: 'Systems and accounts in scope × review depth, plus agreed follow-up on prioritised items.',
    deliverables: ['Findings ranked by risk', 'Practical remediation steps', 'Basic policy and access recommendations'],
    drivers: ['Systems, users and sites in scope', 'Existing controls and documentation', 'Retesting and remediation support required'],
    cta: 'Request a security review',
  },
  {
    id: 'workshop', category: 'People and training', title: 'Process improvement workshop',
    outcome: 'The people involved in a process agree on friction points, priorities and changes they can put into practice.',
    engagement: 'Workshop', delivery: 'Human-led', duration: '½–2 days',
    quoteBasis: 'Per agreed workshop or program', quoteFormula: 'Preparation + session delivery + synthesis and follow-up, based on participants and sessions.',
    deliverables: ['Facilitated session', 'Process map or friction list', 'Action plan with owners'],
    drivers: ['Workshop length, format and number of participants', 'Preparation, facilitation and materials required', 'Whether a process map or implementation plan is included'],
    cta: 'Plan a workshop',
  },
  {
    id: 'training', category: 'People and training', title: 'Team training program',
    outcome: 'A team that can apply a new tool, process or skill on its own after the sessions end.',
    engagement: 'Workshop', delivery: 'Human-led', duration: '1–5 sessions',
    quoteBasis: 'Per session or program', quoteFormula: 'Content preparation + delivery days + materials, adjusted to group size and format.',
    deliverables: ['Tailored training sessions', 'Practical exercises and materials', 'Follow-up questions window'],
    drivers: ['Audience size and prior level', 'Custom content versus existing material', 'On-site, remote or mixed delivery'],
    cta: 'Discuss a training program',
  },
  {
    id: 'recruitment', category: 'Recruitment', title: 'Qualified candidate shortlist',
    outcome: 'A shortlist of candidates whose profiles have been structured and qualified against your role.',
    engagement: 'Project', delivery: 'Automation-assisted', duration: '2–6 weeks',
    quoteBasis: 'Per role or fixed fee', quoteFormula: 'Role definition + sourcing and screening effort + agreed shortlist size; terms confirmed in writing.',
    deliverables: ['Role profile and criteria', 'Qualified shortlist with notes', 'Interview coordination if requested'],
    drivers: ['Seniority and rarity of the role', 'Volume of roles and candidates', 'Screening depth and interview support'],
    cta: 'Brief a recruitment need',
  },
  {
    id: 'contact-centre', category: 'Customer operations', title: 'Contact-centre operations setup',
    outcome: 'A defined customer-contact process with scripts, tooling and reporting ready to run.',
    engagement: 'Project', delivery: 'Hybrid', duration: '3–8 weeks',
    quoteBasis: 'Setup quote, then monthly', quoteFormula: 'Process design + tooling configuration + training, then capacity-based monthly operation if needed.',
    deliverables: ['Call and message flows', 'Tooling configuration', 'Agent guidance and reporting views'],
    drivers: ['Channels and expected contact volume', 'Languages and service hours', 'Integration with CRM or ticketing tools'],
    cta: 'Discuss contact operations',
  },
  {
    id: 'marketing', category: 'Digital marketing', title: 'Digital presence setup',
    outcome: 'A clear, working online presence: site, profiles and tracking that support how you win clients.',
    engagement: 'Project', delivery: 'Hybrid', duration: '2–6 weeks',
    quoteBasis: 'Fixed scope', quoteFormula: 'Pages and channels in scope + content effort + tracking setup + agreed revision rounds.',
    deliverables: ['Site or landing pages', 'Configured profiles and tracking', 'Content and update guide'],
    drivers: ['Number of pages, languages and channels', 'Copywriting and visual material needed', 'Ongoing campaign or reporting needs'],
    cta: 'Request a marketing quote',
  },
  {
    id: 'support', category: 'Business advisory', title: 'Operational support arrangement',
    outcome: 'A recurring scope of advisory, maintenance or operational help with responsibilities and coverage written down.',
    engagement: 'Recurring', delivery: 'Hybrid', duration: 'Monthly',
    quoteBasis: 'Monthly or capacity-based quote', quoteFormula: 'Reserved capacity + covered systems or activities + agreed service window and reporting.',
    deliverables: ['Reserved monthly capacity', 'Agreed response expectations', 'Regular activity reporting'],
    drivers: ['Systems, environments and activities covered', 'Expected workload and service hours', 'Reporting, improvement work and exclusions'],
    cta: 'Discuss ongoing support',
  },
]

const engagements: Array<Engagement | 'all'> = ['all', 'Project', 'Workshop', 'Recurring']
const deliveries: Array<Delivery | 'all'> = ['all', 'Human-led', 'Hybrid', 'Automation-assisted']
const deliveryHints: Record<Delivery, string> = {
  'Human-led': 'Specialists do the work.',
  'Hybrid': 'Specialists and automation share the work.',
  'Automation-assisted': 'Automation does the repeatable part; specialists review it.',
}

const query = ref('')
const category = ref('all')
const engagement = ref<Engagement | 'all'>('all')
const delivery = ref<Delivery | 'all'>('all')
const sort = ref<'featured' | 'az' | 'category'>('featured')
const basket = ref<string[]>([])
const expanded = ref<string[]>([])

const categories = computed(() => {
  const names = Array.from(new Set(services.map(s => s.category)))
  return [{ name: 'all', count: services.length }, ...names.map(name => ({ name, count: services.filter(s => s.category === name).length }))]
})

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = services.filter((s) => {
    if (category.value !== 'all' && s.category !== category.value) return false
    if (engagement.value !== 'all' && s.engagement !== engagement.value) return false
    if (delivery.value !== 'all' && s.delivery !== delivery.value) return false
    if (!q) return true
    return [s.title, s.outcome, s.category, ...s.deliverables, ...s.drivers].join(' ').toLowerCase().includes(q)
  })
  if (sort.value === 'az') return [...list].sort((a, b) => a.title.localeCompare(b.title))
  if (sort.value === 'category') return [...list].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
})

const hasFilters = computed(() =>
  !!query.value || category.value !== 'all' || engagement.value !== 'all' || delivery.value !== 'all')

const basketItems = computed(() => services.filter(s => basket.value.includes(s.id)))
const quoteHref = computed(() =>
  basket.value.length
    ? `/company/prologue/contact?topic=quote&services=${basket.value.join(',')}`
    : '/company/prologue/contact?topic=quote')

const inBasket = (id: string) => basket.value.includes(id)
const isOpen = (id: string) => expanded.value.includes(id)

function toggleBasket(id: string) {
  basket.value = inBasket(id) ? basket.value.filter(x => x !== id) : [...basket.value, id]
}
function toggleOpen(id: string) {
  expanded.value = isOpen(id) ? expanded.value.filter(x => x !== id) : [...expanded.value, id]
}
function resetFilters() {
  query.value = ''
  category.value = 'all'
  engagement.value = 'all'
  delivery.value = 'all'
  sort.value = 'featured'
}
</script>

<main class="sm">
  <header class="sm-hero">
    <p class="sm-eyebrow">Services · Numerimondes</p>
    <h1>Choose a clear next step for your <span class="silky-bbi+115">project</span>.</h1>
    <p class="sm-lead">Browse practical services across advisory, software, infrastructure, people and operations. Each one is sold as an outcome with a defined scope, a delivery process and a written price before work begins.</p>
    <aside class="sm-notice" role="note">
      <strong>Demo catalogue:</strong> public fixed prices are not published yet. Each offer shows the basis used to prepare a quote; the final scope, amount, schedule and assumptions are confirmed in a written proposal. Durations are indicative.
    </aside>
    <ul class="sm-trust" aria-label="How we work">
      <li><strong>Outcome first</strong>You buy a result, not hours of a tool.</li>
      <li><strong>Written price</strong>Scope and amount agreed before work starts.</li>
      <li><strong>Specialist review</strong>Automation helps; people stay accountable.</li>
    </ul>
  </header>

  <section aria-labelledby="sm-catalogue" class="sm-catalogue">
    <h2 id="sm-catalogue" class="sm-title">Service <span class="silky-bbi+115">catalogue</span></h2>

    <div class="sm-toolbar" role="search">
      <label class="sm-search">
        <span class="sm-sr">Search services</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
        <input v-model="query" type="search" placeholder="Search services, deliverables or needs" autocomplete="off" />
      </label>
      <label class="sm-select">
        <span class="sm-sr">Sort by</span>
        <select v-model="sort">
          <option value="featured">Featured first</option>
          <option value="az">Name A–Z</option>
          <option value="category">By category</option>
        </select>
      </label>
    </div>

    <div class="sm-chips" role="tablist" aria-label="Categories">
      <button
        v-for="c in categories" :key="c.name" type="button" role="tab"
        class="sm-chip" :class="{ 'is-active': category === c.name }"
        :aria-selected="category === c.name" @click="category = c.name"
      >{{ c.name === 'all' ? 'All services' : c.name }} <span class="sm-count">{{ c.count }}</span></button>
    </div>

    <div class="sm-filters">
      <div class="sm-group" role="group" aria-label="Engagement type">
        <span class="sm-group__label">Engagement</span>
        <button v-for="e in engagements" :key="e" type="button" class="sm-pill" :class="{ 'is-active': engagement === e }" :aria-pressed="engagement === e" @click="engagement = e">{{ e === 'all' ? 'Any' : e }}</button>
      </div>
      <div class="sm-group" role="group" aria-label="Delivery model">
        <span class="sm-group__label">Delivery</span>
        <button v-for="d in deliveries" :key="d" type="button" class="sm-pill" :class="{ 'is-active': delivery === d }" :aria-pressed="delivery === d" @click="delivery = d">{{ d === 'all' ? 'Any' : d }}</button>
      </div>
    </div>

    <p class="sm-status" aria-live="polite">
      {{ results.length }} {{ results.length === 1 ? 'service' : 'services' }}
      <button v-if="hasFilters" type="button" class="sm-link" @click="resetFilters">Clear filters</button>
    </p>

    <div v-if="results.length" class="sm-grid">
      <article v-for="s in results" :key="s.id" class="sm-card" :class="{ 'is-selected': inBasket(s.id) }">
        <div class="sm-card__top">
          <p class="sm-eyebrow">{{ s.category }}</p>
          <span v-if="s.featured" class="sm-badge">Popular</span>
        </div>
        <h3>{{ s.title }}</h3>
        <p class="sm-outcome">{{ s.outcome }}</p>
        <ul class="sm-meta" aria-label="Service details">
          <li>{{ s.engagement }}</li>
          <li :title="deliveryHints[s.delivery]">{{ s.delivery }}</li>
          <li>{{ s.duration }}</li>
        </ul>
        <p class="sm-price">
          <strong>Price: {{ s.quoteBasis }}</strong>
          {{ s.quoteFormula }}
        </p>
        <h4>What you get</h4>
        <ul class="sm-list">
          <li v-for="d in s.deliverables" :key="d">{{ d }}</li>
        </ul>
        <button type="button" class="sm-toggle" :aria-expanded="isOpen(s.id)" :aria-controls="`drivers-${s.id}`" @click="toggleOpen(s.id)">
          What shapes the quote
          <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ 'is-open': isOpen(s.id) }"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <ul v-show="isOpen(s.id)" :id="`drivers-${s.id}`" class="sm-list sm-list--drivers">
          <li v-for="d in s.drivers" :key="d">{{ d }}</li>
        </ul>
        <div class="sm-actions">
          <a class="sm-btn sm-btn--primary" :href="`/company/prologue/contact?topic=${s.id}`">{{ s.cta }}</a>
          <button type="button" class="sm-btn sm-btn--ghost" :aria-pressed="inBasket(s.id)" @click="toggleBasket(s.id)">{{ inBasket(s.id) ? 'Added to brief' : 'Add to brief' }}</button>
        </div>
      </article>
    </div>

    <div v-else class="sm-empty">
      <h3>No service matches these filters</h3>
      <p>Try a broader search, or describe your need and we will point you to the right service.</p>
      <p><button type="button" class="sm-btn sm-btn--ghost" @click="resetFilters">Clear filters</button> <a class="sm-btn sm-btn--primary" href="/company/prologue/contact?topic=quote">Describe your need</a></p>
    </div>
  </section>

  <section aria-labelledby="sm-process">
    <h2 id="sm-process" class="sm-title">A clear process from request to <span class="silky-bbi+115">delivery</span></h2>
    <ol class="sm-process">
      <li><strong>1. Share the need</strong>Tell us the objective, current situation and any important deadline.</li>
      <li><strong>2. Confirm the scope</strong>We clarify deliverables, assumptions, dependencies and responsibilities.</li>
      <li><strong>3. Review the proposal</strong>You receive the price, schedule and terms in writing before approving work.</li>
      <li><strong>4. Start the engagement</strong>Work begins after approval, with progress and handover handled as agreed.</li>
    </ol>
  </section>

  <section aria-labelledby="sm-faq">
    <h2 id="sm-faq" class="sm-title">Before you <span class="silky-bbi+115">request</span> a quote</h2>
    <div class="sm-faq">
      <details><summary>Why are prices not listed?</summary><p>Most engagements depend on scope, data quality and the systems involved. Publishing a single number would hide those assumptions, so each offer shows what the price is built from and you receive the exact amount in writing.</p></details>
      <details><summary>What does “automation-assisted” mean?</summary><p>Repeatable parts of the work are handled with automation and reviewed by a specialist. You still deal with people who are accountable for the result.</p></details>
      <details><summary>Can I combine several services?</summary><p>Yes. Add services to your brief and send them together; we will prepare one proposal with a shared scope and schedule.</p></details>
      <details><summary>What if my need is not listed?</summary><p>Describe the outcome you want. We will tell you which service fits or whether a tailored scope is needed.</p></details>
    </div>
  </section>

  <footer class="sm-footer">
    <h2>Need a service tailored to your situation?</h2>
    <p>Send a short description of the outcome you need. We can help determine which service fits and what information is needed for an accurate quote.</p>
    <a class="sm-btn sm-btn--primary" href="/company/prologue/contact?topic=quote">Request a proposal</a>
  </footer>

  <Transition name="sm-bar">
    <div v-if="basket.length" class="sm-basket" role="region" aria-label="Your brief">
      <div class="sm-basket__text">
        <strong>{{ basket.length }} {{ basket.length === 1 ? 'service' : 'services' }} in your brief</strong>
        <span>{{ basketItems.map(s => s.title).join(' · ') }}</span>
      </div>
      <button type="button" class="sm-btn sm-btn--ghost" @click="basket = []">Clear</button>
      <a class="sm-btn sm-btn--primary" :href="quoteHref">Request one proposal</a>
    </div>
  </Transition>
</main>

<style scoped>
.sm { width: min(calc(100% - 40px), 1120px); margin: 0 auto 6rem; color: var(--vp-c-text-1, #172033); }
.sm-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.sm-eyebrow { margin: 0; color: var(--vp-c-text-2, #657080); font-size: .76rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.sm-title { margin: 3.5rem 0 1.25rem; font-size: clamp(1.65rem, 3vw, 2.2rem); font-weight: 500; letter-spacing: -.025em; border: 0; padding: 0; }

/* Hero */
.sm-hero { padding: clamp(2.5rem, 7vw, 6rem) 0 2.5rem; text-align: center; }
.sm-hero h1 { max-width: 850px; margin: 1rem auto 1.25rem; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 500; letter-spacing: -.045em; line-height: 1.04; }
.sm-lead { max-width: 700px; margin: 0 auto; color: var(--vp-c-text-2, #657080); font-size: 1.12rem; line-height: 1.7; }
.sm-notice { max-width: 760px; margin: 1.5rem auto 0; padding: 1rem 1.2rem; border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 12px; background: var(--vp-c-bg-soft, #f6f8fb); color: var(--vp-c-text-2, #657080); font-size: .95rem; line-height: 1.6; text-align: left; }
.sm-trust { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .75rem; max-width: 860px; margin: 1.75rem auto 0; padding: 0; list-style: none; text-align: left; }
.sm-trust li { padding: .9rem 1rem; border-left: 2px solid var(--vp-c-brand-1, #3977c8); color: var(--vp-c-text-2, #657080); font-size: .92rem; line-height: 1.5; }
.sm-trust strong { display: block; color: var(--vp-c-text-1, #172033); }

/* Toolbar */
.sm-toolbar { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem; }
.sm-search { position: relative; flex: 1 1 280px; }
.sm-search svg { position: absolute; top: 50%; left: .9rem; width: 1.1rem; height: 1.1rem; transform: translateY(-50%); fill: none; stroke: var(--vp-c-text-2, #657080); stroke-width: 1.8; stroke-linecap: round; pointer-events: none; }
.sm-search input,
.sm-select select { width: 100%; min-height: 2.9rem; border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 12px; background: var(--vp-c-bg, #fff); color: inherit; font: inherit; font-size: .95rem; }
.sm-search input { padding: .6rem 1rem .6rem 2.7rem; }
.sm-select { flex: 0 1 200px; }
.sm-select select { padding: .6rem .9rem; }
.sm-search input:focus-visible,
.sm-select select:focus-visible { outline: 2px solid var(--vp-c-brand-1, #3977c8); outline-offset: 1px; }

/* Chips and pills */
.sm-chips { display: flex; gap: .5rem; margin-bottom: 1rem; padding-bottom: .25rem; overflow-x: auto; scrollbar-width: none; }
.sm-chips::-webkit-scrollbar { display: none; }
.sm-chip { flex: 0 0 auto; display: inline-flex; align-items: center; gap: .45rem; min-height: 2.4rem; padding: .35rem .95rem; border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 999px; background: var(--vp-c-bg, #fff); color: inherit; font: inherit; font-size: .88rem; font-weight: 600; white-space: nowrap; cursor: pointer; transition: background-color .15s, border-color .15s, color .15s; }
.sm-chip.is-active { border-color: var(--vp-c-brand-1, #3977c8); background: var(--vp-c-brand-1, #3977c8); color: #fff; }
.sm-count { padding: 0 .4rem; border-radius: 999px; background: color-mix(in srgb, currentColor 14%, transparent); font-size: .72rem; }
.sm-filters { display: flex; flex-wrap: wrap; gap: .75rem 2rem; margin-bottom: 1rem; }
.sm-group { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; }
.sm-group__label { margin-right: .35rem; color: var(--vp-c-text-2, #657080); font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.sm-pill { min-height: 2rem; padding: .2rem .75rem; border: 1px solid transparent; border-radius: 8px; background: var(--vp-c-bg-soft, #f6f8fb); color: inherit; font: inherit; font-size: .82rem; font-weight: 600; cursor: pointer; }
.sm-pill.is-active { border-color: var(--vp-c-brand-1, #3977c8); background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 12%, transparent); color: var(--vp-c-brand-1, #3977c8); }
.sm-chip:focus-visible, .sm-pill:focus-visible, .sm-toggle:focus-visible, .sm-btn:focus-visible, .sm-link:focus-visible { outline: 2px solid var(--vp-c-brand-1, #3977c8); outline-offset: 2px; }
.sm-status { display: flex; align-items: center; gap: .75rem; margin: 0 0 1rem; color: var(--vp-c-text-2, #657080); font-size: .9rem; }
.sm-link { padding: 0; border: 0; background: none; color: var(--vp-c-brand-1, #3977c8); font: inherit; font-weight: 600; text-decoration: underline; cursor: pointer; }

/* Cards */
.sm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 1rem; }
.sm-card { display: flex; min-width: 0; flex-direction: column; padding: clamp(1.2rem, 3vw, 1.6rem); border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 16px; background: var(--vp-c-bg, #fff); box-shadow: 0 8px 28px rgb(15 23 42 / .045); transition: border-color .15s, box-shadow .15s, transform .15s; }
@media (hover: hover) { .sm-card:hover { border-color: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 45%, var(--vp-c-divider, #d8dee8)); box-shadow: 0 14px 36px rgb(15 23 42 / .09); } }
.sm-card.is-selected { border-color: var(--vp-c-brand-1, #3977c8); box-shadow: 0 0 0 1px var(--vp-c-brand-1, #3977c8), 0 14px 36px rgb(15 23 42 / .09); }
.sm-card__top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .9rem; }
.sm-badge { padding: .12rem .55rem; border-radius: 999px; background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 14%, transparent); color: var(--vp-c-brand-1, #3977c8); font-size: .7rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.sm-card h3 { margin: 0 0 .5rem; font-size: 1.28rem; font-weight: 600; line-height: 1.3; }
.sm-card h4 { margin: .25rem 0 .35rem; font-size: .88rem; font-weight: 700; }
.sm-outcome { margin: 0 0 .9rem; color: var(--vp-c-text-2, #657080); line-height: 1.6; }
.sm-meta { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1rem; padding: 0; list-style: none; }
.sm-meta li { padding: .15rem .6rem; border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 999px; color: var(--vp-c-text-2, #657080); font-size: .75rem; font-weight: 600; }
.sm-price { margin: 0 0 1rem; padding: .85rem 1rem; border-radius: 10px; background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 8%, transparent); font-size: .92rem; line-height: 1.5; }
.sm-price strong { display: block; margin-bottom: .2rem; }
.sm-list { margin: 0 0 .75rem; padding-left: 1.2rem; color: var(--vp-c-text-2, #657080); font-size: .92rem; line-height: 1.6; }
.sm-list--drivers { margin-top: .5rem; }
.sm-toggle { display: inline-flex; align-items: center; gap: .35rem; align-self: flex-start; min-height: 2rem; margin-bottom: .25rem; padding: 0; border: 0; background: none; color: var(--vp-c-text-1, #172033); font: inherit; font-size: .88rem; font-weight: 700; cursor: pointer; }
.sm-toggle svg { width: 1rem; height: 1rem; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform .2s; }
.sm-toggle svg.is-open { transform: rotate(180deg); }

/* Buttons */
.sm-actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: auto; padding-top: .75rem; }
.sm-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 2.75rem; padding: .65rem 1rem; border: 1px solid var(--vp-c-brand-1, #3977c8); border-radius: 9px; font: inherit; font-size: .92rem; font-weight: 650; line-height: 1.2; text-decoration: none; cursor: pointer; transition: background-color .15s, color .15s; }
.sm-btn--primary { flex: 1 1 auto; background: var(--vp-c-brand-1, #3977c8); color: #fff !important; }
.sm-btn--ghost { background: transparent; color: var(--vp-c-brand-1, #3977c8); }
.sm-btn--ghost[aria-pressed='true'] { background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 12%, transparent); }
@media (hover: hover) { .sm-btn--primary:hover { filter: brightness(1.08); } .sm-btn--ghost:hover { background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 10%, transparent); } }

.sm-empty { padding: 2.5rem 1.5rem; border: 1px dashed var(--vp-c-divider, #d8dee8); border-radius: 16px; text-align: center; color: var(--vp-c-text-2, #657080); }
.sm-empty h3 { margin: 0 0 .5rem; color: var(--vp-c-text-1, #172033); }

/* Process, FAQ, footer */
.sm-process { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .75rem; margin: 0; padding: 0; list-style: none; }
.sm-process li { padding: 1rem; border-top: 2px solid var(--vp-c-brand-1, #3977c8); background: var(--vp-c-bg-soft, #f6f8fb); line-height: 1.5; }
.sm-process strong { display: block; margin-bottom: .3rem; }
.sm-faq details { padding: .9rem 0; border-bottom: 1px solid var(--vp-c-divider, #d8dee8); }
.sm-faq summary { font-weight: 600; cursor: pointer; }
.sm-faq p { margin: .6rem 0 0; color: var(--vp-c-text-2, #657080); line-height: 1.65; }
.sm-footer { margin-top: 3.5rem; padding: clamp(1.5rem, 4vw, 2.5rem); border-radius: 16px; background: var(--vp-c-bg-soft, #f6f8fb); text-align: center; }
.sm-footer h2 { margin: 0 0 .6rem; font-weight: 550; border: 0; padding: 0; }
.sm-footer p { max-width: 680px; margin: 0 auto 1rem; color: var(--vp-c-text-2, #657080); line-height: 1.65; }
.sm-footer .sm-btn { flex: none; }

/* Brief bar */
.sm-basket { position: fixed; right: 0; bottom: max(1rem, env(safe-area-inset-bottom, 0px)); left: 0; z-index: 30; display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; width: min(calc(100% - 24px), 860px); margin: 0 auto; padding: .75rem .9rem; border: 1px solid var(--vp-c-divider, #d8dee8); border-radius: 16px; background: color-mix(in srgb, var(--vp-c-bg, #fff) 88%, transparent); box-shadow: 0 16px 40px rgb(15 23 42 / .22); -webkit-backdrop-filter: blur(18px) saturate(1.4); backdrop-filter: blur(18px) saturate(1.4); }
.sm-basket__text { display: flex; min-width: 0; flex: 1 1 220px; flex-direction: column; font-size: .88rem; }
.sm-basket__text span { overflow: hidden; color: var(--vp-c-text-2, #657080); text-overflow: ellipsis; white-space: nowrap; }
.sm-basket .sm-btn { flex: 0 0 auto; min-height: 2.5rem; }
.sm-bar-enter-active, .sm-bar-leave-active { transition: opacity .2s ease, transform .2s ease; }
.sm-bar-enter-from, .sm-bar-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-width: 640px) {
  .sm { width: min(calc(100% - 28px), 1120px); }
  .sm-toolbar { flex-direction: column; }
  .sm-select { flex-basis: auto; }
  .sm-actions .sm-btn { flex: 1 1 100%; }
  .sm-basket .sm-btn { flex: 1 1 auto; }
}
@media (prefers-reduced-motion: reduce) {
  .sm-card, .sm-chip, .sm-btn, .sm-toggle svg, .sm-bar-enter-active, .sm-bar-leave-active { transition: none; }
}
</style>
