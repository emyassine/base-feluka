---
title: "Service Marketplace | Numerimondes"
sidebarTitle: "Marketplace"
icon: "@spmpst::icon::store"
description: "Outcome-based consulting, software, infrastructure, people and recruitment services delivered by vetted partners."
lang: en
status: "demo"
layout: home
---

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import db from './marketplace.json'
type Tab = 'scope' | 'pricing' | 'reviews'
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n)) + ' MAD'
const partners = Object.fromEntries(db.partners.map((p: any) => [p.id, p]))
const query = ref('')
const category = ref('all')
const engagement = ref('all')
const delivery = ref('all')
const maxPrice = ref(60000)
const sort = ref('featured')
const basket = ref<string[]>([])
const activeId = ref<string | null>(null)
const tab = ref<Tab>('scope')
const dlg = ref<HTMLDialogElement | null>(null)
const localReviews = ref<any[]>([])
const form = ref({ name: '', rating: 5, text: '' })
const formSent = ref(false)
const salary = ref(7000)
const bonus = ref(0)
onMounted(() => {
  try {
    localReviews.value = JSON.parse(localStorage.getItem('nm-reviews') || '[]')
    basket.value = JSON.parse(localStorage.getItem('nm-brief') || '[]').filter((id: string) => db.services.some((s: any) => s.id === id))
  } catch { /* storage unavailable */ }
})
function persist(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }
const allReviews = computed(() => [...localReviews.value, ...db.reviews])
const ratingOf = (reviews: any[]) => ({ count: reviews.length, avg: reviews.length ? reviews.reduce((t, r) => t + r.rating, 0) / reviews.length : 0 })
const serviceRating = (id: string) => ratingOf(allReviews.value.filter((r: any) => r.service === id && r.verified))
const partnerRating = (pid: string) => ratingOf(allReviews.value.filter((r: any) => r.verified && db.services.find((s: any) => s.id === r.service)?.partner === pid))
const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
const engagements = ['all', 'Project', 'Workshop', 'Recurring']
const deliveries = ['all', 'Human-led', 'Hybrid', 'Automation-assisted']
const categories = computed(() => [{ name: 'all', count: db.services.length }, ...db.categories.map((name: string) => ({ name, count: db.services.filter((s: any) => s.cat === name).length }))])
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = db.services.filter((s: any) => {
    if (category.value !== 'all' && s.cat !== category.value) return false
    if (engagement.value !== 'all' && s.type !== engagement.value) return false
    if (delivery.value !== 'all' && s.delivery !== delivery.value) return false
    if (s.price.from > maxPrice.value) return false
    return !q || [s.title, s.outcome, s.cat, partners[s.partner].name, ...s.deliverables].join(' ').toLowerCase().includes(q)
  })
  const by: Record<string, (a: any, b: any) => number> = {
    featured: (a, b) => Number(!!b.featured) - Number(!!a.featured),
    rating: (a, b) => serviceRating(b.id).avg - serviceRating(a.id).avg,
    low: (a, b) => a.price.from - b.price.from,
    high: (a, b) => b.price.from - a.price.from,
  }
  return [...list].sort(by[sort.value])
})
const hasFilters = computed(() => !!query.value || category.value !== 'all' || engagement.value !== 'all' || delivery.value !== 'all' || maxPrice.value < 60000)
function resetFilters() { query.value = ''; category.value = 'all'; engagement.value = 'all'; delivery.value = 'all'; maxPrice.value = 60000; sort.value = 'featured' }
const active = computed(() => db.services.find((s: any) => s.id === activeId.value) as any)
const inBasket = (id: string) => basket.value.includes(id)
function toggleBasket(id: string) { basket.value = inBasket(id) ? basket.value.filter(x => x !== id) : [...basket.value, id]; persist('nm-brief', basket.value) }
const basketItems = computed(() => db.services.filter((s: any) => basket.value.includes(s.id)))
const oneOff = computed(() => basketItems.value.filter((s: any) => s.price.unit !== 'month').reduce((t: number, s: any) => t + s.price.from, 0))
const monthly = computed(() => basketItems.value.filter((s: any) => s.price.unit === 'month').reduce((t: number, s: any) => t + s.price.from, 0))
const quoteHref = computed(() => `/company/prologue/contact?topic=quote&services=${basket.value.join(',')}`)

const fee = computed(() => Math.max(db.recruit.floor, Number(salary.value || 0) * db.recruit.rate) + Number(bonus.value || 0))

async function openService(id: string, t: Tab = 'scope') {
  activeId.value = id; tab.value = t; formSent.value = false
  await nextTick()
  dlg.value?.showModal()
}
function closeDialog() { dlg.value?.close() }
function onBackdrop(e: MouseEvent) { if (e.target === dlg.value) closeDialog() }
function submitReview() {
  if (!active.value || form.value.text.trim().length < 10 || !form.value.name.trim()) return
  localReviews.value = [{ id: 'l' + Date.now(), service: active.value.id, author: form.value.name.trim(), role: 'Client', company: '', rating: Number(form.value.rating), date: new Date().toISOString().slice(0, 10), verified: false, text: form.value.text.trim() }, ...localReviews.value]
  persist('nm-reviews', localReviews.value)
  form.value = { name: '', rating: 5, text: '' }
  formSent.value = true
}
const pendingFor = (id: string) => localReviews.value.filter(r => r.service === id)
const tabs: Array<[Tab, string]> = [['scope', 'Scope'], ['pricing', 'Pricing'], ['reviews', 'Reviews']]
</script>
<main class="nm">
  <header class="nm-hero">
    <p class="nm-eyebrow">Marketplace · Numerimondes</p>
    <h1>Buy the <span class="silky-bbi+115">outcome</span>.</h1>
    <p class="nm-lead">One accountable company, a network of vetted specialist partners. Every service has a defined scope, a visible starting price, verified client reviews and a written proposal before work begins.</p>
    <div class="nm-hero__cta">
      <a class="ui-btn ui-btn--primary" href="#catalogue">Browse services</a>
      <a class="ui-btn ui-btn--outline" href="#recruit">Calculate a recruitment fee</a>
    </div>
    <ul class="nm-stats" aria-label="Marketplace at a glance">
      <li><strong>{{ db.services.length }}</strong>services</li>
      <li><strong>{{ db.partners.length }}</strong>vetted partners</li>
      <li><strong>{{ db.reviews.length }}</strong>client reviews</li>
      <li><strong>{{ (db.reviews.reduce((t: number, r: any) => t + r.rating, 0) / db.reviews.length).toFixed(1) }}/5</strong>average rating</li>
    </ul>
    <aside class="ui-alert" role="note"><strong>Demo catalogue.</strong> Partners, prices and reviews are illustrative sample data. {{ db.meta.vatNote }} Final amounts are confirmed in writing.</aside>
  </header>
  <section aria-labelledby="nm-how" class="nm-section">
    <h2 id="nm-how" class="nm-title">How the marketplace <span class="silky-bbi+115">works</span></h2>
    <ol class="nm-steps">
      <li><span>1</span><strong>Choose</strong>Compare scope, deliverables, partner and starting price.</li>
      <li><span>2</span><strong>Build your brief</strong>Add one or several services and get an indicative total.</li>
      <li><span>3</span><strong>Receive one proposal</strong>Price, schedule and terms in writing. {{ db.meta.terms }}</li>
      <li><span>4</span><strong>Delivery and review</strong>Partners deliver, Numerimondes stays accountable, you rate the result.</li>
    </ol>
  </section>
  <section id="catalogue" aria-labelledby="nm-cat" class="nm-section">
    <h2 id="nm-cat" class="nm-title">Service <span class="silky-bbi+115">catalogue</span></h2>
    <div class="nm-toolbar" role="search">
      <label class="nm-search"><span class="nm-sr">Search services</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input v-model="query" class="ui-input" type="search" placeholder="Search services, partners or deliverables" autocomplete="off" /></label>
      <label class="nm-field"><span class="nm-sr">Sort by</span><select v-model="sort" class="ui-input"><option value="featured">Featured first</option><option value="rating">Best rated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
    </div>
    <div class="nm-chips" role="group" aria-label="Categories">
      <button v-for="c in categories" :key="c.name" type="button" class="ui-chip" :class="{ 'is-active': category === c.name }" :aria-pressed="category === c.name" @click="category = c.name">{{ c.name === 'all' ? 'All services' : c.name }}<span class="ui-chip__n">{{ c.count }}</span></button>
    </div>
    <div class="nm-filters">
      <div class="nm-group" role="group" aria-label="Engagement type"><span class="nm-label">Engagement</span><button v-for="e in engagements" :key="e" type="button" class="ui-pill" :class="{ 'is-active': engagement === e }" :aria-pressed="engagement === e" @click="engagement = e">{{ e === 'all' ? 'Any' : e }}</button></div>
      <div class="nm-group" role="group" aria-label="Delivery model"><span class="nm-label">Delivery</span><button v-for="d in deliveries" :key="d" type="button" class="ui-pill" :class="{ 'is-active': delivery === d }" :aria-pressed="delivery === d" @click="delivery = d">{{ d === 'all' ? 'Any' : d }}</button></div>
      <label class="nm-group nm-range"><span class="nm-label">Starting price up to</span><input v-model.number="maxPrice" type="range" min="2000" max="60000" step="1000" /><output>{{ fmt(maxPrice) }}</output></label>
    </div>
    <p class="nm-status" aria-live="polite">{{ results.length }} {{ results.length === 1 ? 'service' : 'services' }}<button v-if="hasFilters" type="button" class="ui-link" @click="resetFilters">Clear filters</button></p>
    <div v-if="results.length" class="nm-grid">
      <article v-for="s in results" :key="s.id" class="ui-card" :class="{ 'is-selected': inBasket(s.id) }">
        <div class="ui-card__media"><img :src="s.img + '?auto=format&fit=crop&w=800&q=70'" alt="" loading="lazy" width="800" height="450" /><span v-if="s.featured" class="ui-badge ui-badge--solid">Popular</span></div>
        <div class="ui-card__body">
          <p class="nm-eyebrow">{{ s.cat }}</p>
          <h3>{{ s.title }}</h3>
          <p class="nm-by"><span class="nm-avatar" aria-hidden="true">{{ partners[s.partner].name.slice(0, 2).toUpperCase() }}</span>{{ partners[s.partner].name }} · {{ partners[s.partner].city }}</p>
          <p class="nm-rating"><span class="nm-stars" :aria-label="`Rated ${serviceRating(s.id).avg.toFixed(1)} out of 5`">{{ stars(serviceRating(s.id).avg) }}</span> <strong>{{ serviceRating(s.id).avg ? serviceRating(s.id).avg.toFixed(1) : 'New' }}</strong> <button type="button" class="ui-link" @click="openService(s.id, 'reviews')">{{ serviceRating(s.id).count }} reviews</button></p>
          <p class="nm-outcome">{{ s.outcome }}</p>
          <ul class="nm-meta" aria-label="Service details"><li class="ui-badge">{{ s.type }}</li><li class="ui-badge">{{ s.delivery }}</li><li class="ui-badge">{{ s.duration }}</li></ul>
          <p class="nm-price"><span>From</span><strong>{{ fmt(s.price.from) }}</strong><span>/ {{ s.price.unit }} HT</span></p>
          <div class="nm-actions"><button type="button" class="ui-btn ui-btn--primary" @click="openService(s.id)">View details</button><button type="button" class="ui-btn ui-btn--outline" :aria-pressed="inBasket(s.id)" @click="toggleBasket(s.id)">{{ inBasket(s.id) ? 'In your brief ✓' : 'Add to brief' }}</button></div>
        </div>
      </article>
    </div>
    <div v-else class="ui-empty"><h3>No service matches these filters</h3><p>Broaden the search or describe your need and we will route you to the right partner.</p><p><button type="button" class="ui-btn ui-btn--outline" @click="resetFilters">Clear filters</button> <a class="ui-btn ui-btn--primary" href="/company/prologue/contact?topic=quote">Describe your need</a></p></div>
  </section>
  <section id="recruit" aria-labelledby="nm-rec" class="nm-section nm-recruit">
    <div>
      <p class="nm-eyebrow">Powered by The Best Recruit</p>
      <h2 id="nm-rec" class="nm-title">Recruitment fees, known <span class="silky-bbi+115">before</span> you pay</h2>
      <p class="nm-lead nm-lead--left">Candidates join for free and are qualified by a human. You browse profiles and pay per profile: 46% of the candidate's minimum monthly salary, with a floor of {{ fmt(db.recruit.floor) }}, plus any bonus supplement.</p>
      <table class="ui-table"><caption class="nm-sr">Fee examples</caption><thead><tr><th scope="col">Candidate salary</th><th scope="col">Fee (HT)</th></tr></thead><tbody><tr v-for="n in db.recruit.examples" :key="n"><td>{{ fmt(n) }}</td><td>{{ fmt(Math.max(db.recruit.floor, n * db.recruit.rate)) }}</td></tr></tbody></table>
    </div>
    <form class="ui-card ui-card--pad" @submit.prevent aria-labelledby="nm-calc">
      <h3 id="nm-calc">Fee calculator</h3>
      <label class="nm-label" for="sal">Candidate minimum monthly salary (S, MAD)</label>
      <input id="sal" v-model.number="salary" class="ui-input" type="number" min="0" step="250" inputmode="numeric" />
      <label class="nm-label" for="bon">Bonus supplement (P, MAD)</label>
      <input id="bon" v-model.number="bonus" class="ui-input" type="number" min="0" step="100" inputmode="numeric" />
      <p class="nm-result" aria-live="polite"><span>Estimated fee</span><strong>{{ fmt(fee) }}</strong><small>H = max({{ db.recruit.floor }}; S × 46%) + P · excl. VAT</small></p>
      <button type="button" class="ui-btn ui-btn--primary" @click="toggleBasket('recruit')">{{ inBasket('recruit') ? 'In your brief ✓' : 'Add recruitment to brief' }}</button>
    </form>
  </section>
  <section aria-labelledby="nm-partners" class="nm-section">
    <h2 id="nm-partners" class="nm-title">Vetted <span class="silky-bbi+115">partners</span></h2>
    <div class="nm-partners">
      <article v-for="p in db.partners" :key="p.id" class="ui-card ui-card--pad">
        <p class="nm-by"><span class="nm-avatar" aria-hidden="true">{{ p.name.slice(0, 2).toUpperCase() }}</span><strong>{{ p.name }}</strong></p>
        <p class="nm-eyebrow">{{ p.role }}</p>
        <p class="nm-outcome">{{ p.bio }}</p>
        <p class="nm-rating"><span class="nm-stars">{{ stars(partnerRating(p.id).avg) }}</span> <strong>{{ partnerRating(p.id).count ? partnerRating(p.id).avg.toFixed(1) : 'New' }}</strong> · {{ partnerRating(p.id).count }} verified reviews · since {{ p.since }}</p>
        <ul class="nm-meta"><li v-for="b in p.badges" :key="b" class="ui-badge">{{ b }}</li></ul>
      </article>
    </div>
    <aside class="ui-alert"><strong>Are you a specialist or an organisation?</strong> Partners bring clients or expertise; Numerimondes handles qualification, contracting, invoicing and accountability. <a href="/company/prologue/contact?topic=partner">Apply to become a partner</a></aside>
  </section>
  <section aria-labelledby="nm-faq" class="nm-section">
    <h2 id="nm-faq" class="nm-title">Before you <span class="silky-bbi+115">request</span> a proposal</h2>
    <div class="nm-faq"><details v-for="f in db.faq" :key="f.q"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details></div>
  </section>
  <footer class="nm-footer">
    <h2>Need something tailored?</h2>
    <p>Describe the outcome you need. We will tell you which service fits, or scope a custom engagement with the right partners.</p>
    <a class="ui-btn ui-btn--primary" href="/company/prologue/contact?topic=quote">Request a proposal</a>
  </footer>
  <Transition name="nm-bar">
    <div v-if="basket.length" class="nm-basket" role="region" aria-label="Your brief">
      <div class="nm-basket__text"><strong>{{ basket.length }} {{ basket.length === 1 ? 'service' : 'services' }} in your brief · from {{ oneOff ? fmt(oneOff) : '' }}{{ oneOff && monthly ? ' + ' : '' }}{{ monthly ? fmt(monthly) + '/month' : '' }}</strong><span>{{ basketItems.map((s: any) => s.title).join(' · ') }}</span></div>
      <button type="button" class="ui-btn ui-btn--outline" @click="basket = []; persist('nm-brief', [])">Clear</button>
      <a class="ui-btn ui-btn--primary" :href="quoteHref">Request one proposal</a>
    </div>
  </Transition>
  <dialog ref="dlg" class="ui-dialog" aria-labelledby="dlg-title" @click="onBackdrop" @close="activeId = null">
    <div v-if="active" class="ui-dialog__inner">
      <header class="ui-dialog__head">
        <div><p class="nm-eyebrow">{{ active.cat }} · {{ partners[active.partner].name }}</p><h2 id="dlg-title">{{ active.title }}</h2><p class="nm-rating"><span class="nm-stars">{{ stars(serviceRating(active.id).avg) }}</span> {{ serviceRating(active.id).avg ? serviceRating(active.id).avg.toFixed(1) : 'New' }} · {{ serviceRating(active.id).count }} verified reviews</p></div>
        <button type="button" class="ui-btn ui-btn--ghost" aria-label="Close details" @click="closeDialog">✕</button>
      </header>
      <div class="ui-tabs" role="tablist" aria-label="Service sections"><button v-for="t in tabs" :key="t[0]" type="button" role="tab" class="ui-tab" :class="{ 'is-active': tab === t[0] }" :aria-selected="tab === t[0]" @click="tab = t[0]">{{ t[1] }}</button></div>
      <div v-if="tab === 'scope'" role="tabpanel" class="ui-panel">
        <img class="ui-dialog__img" :src="active.img + '?auto=format&fit=crop&w=1000&q=70'" alt="" loading="lazy" />
        <p>{{ active.outcome }}</p>
        <h4>What you get</h4><ul class="nm-list"><li v-for="d in active.deliverables" :key="d">{{ d }}</li></ul>
        <h4>Delivery</h4><p>{{ active.type }} · {{ active.delivery }} · {{ active.duration }}. Delivered by {{ partners[active.partner].name }} ({{ partners[active.partner].city }}) under Numerimondes accountability.</p>
      </div>
      <div v-else-if="tab === 'pricing'" role="tabpanel" class="ui-panel">
        <p class="nm-price nm-price--lg"><span>From</span><strong>{{ fmt(active.price.from) }}</strong><span>/ {{ active.price.unit }} HT</span></p>
        <p><strong>Basis:</strong> {{ active.price.model }}</p>
        <h4>What shapes the quote</h4><ul class="nm-list"><li v-for="d in active.drivers" :key="d">{{ d }}</li></ul>
        <p class="nm-note">{{ db.meta.vatNote }} {{ db.meta.terms }}</p>
      </div>
      <div v-else role="tabpanel" class="ui-panel">
        <article v-for="r in [...pendingFor(active.id), ...allReviews.filter((x: any) => x.service === active.id && x.verified)]" :key="r.id" class="nm-review">
          <p class="nm-stars">{{ stars(r.rating) }}</p><p>{{ r.text }}</p>
          <p class="nm-note">{{ r.author }}{{ r.company ? ', ' + r.role + ', ' + r.company : '' }} · {{ r.date }} · <span class="ui-badge" :class="{ 'ui-badge--solid': r.verified }">{{ r.verified ? 'Verified' : 'Pending confirmation' }}</span></p>
        </article>
        <form class="nm-reviewform" @submit.prevent="submitReview">
          <h4>Share your experience</h4>
          <label class="nm-label" for="rv-name">Your name</label><input id="rv-name" v-model="form.name" class="ui-input" required />
          <label class="nm-label" for="rv-rate">Rating</label><select id="rv-rate" v-model="form.rating" class="ui-input"><option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }} / 5</option></select>
          <label class="nm-label" for="rv-text">Your review (min. 10 characters)</label><textarea id="rv-text" v-model="form.text" class="ui-input" rows="3" required minlength="10"></textarea>
          <button type="submit" class="ui-btn ui-btn--outline">Submit review</button>
          <p v-if="formSent" class="nm-note" role="status">Thank you. Your review is pending confirmation of your engagement.</p>
        </form>
      </div>
      <footer class="ui-dialog__foot"><button type="button" class="ui-btn ui-btn--outline" :aria-pressed="inBasket(active.id)" @click="toggleBasket(active.id)">{{ inBasket(active.id) ? 'In your brief ✓' : 'Add to brief' }}</button><a class="ui-btn ui-btn--primary" :href="`/company/prologue/contact?topic=${active.id}`">Request a quote</a></footer>
    </div>
  </dialog>
</main>
<style scoped>
.nm { --brand: var(--vp-c-brand-1); width: min(calc(100% - 40px), 1160px); margin: 0 auto 6rem; color: var(--foreground); font-family: var(--sans); }
.nm-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.nm-eyebrow { margin: 0; color: var(--muted); font-size: .74rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.nm-title { margin: 0 0 1.25rem; border: 0; padding: 0; font-size: clamp(1.65rem, 3vw, 2.3rem); font-weight: 500; letter-spacing: -.025em; }
.nm-section { margin-top: clamp(3rem, 7vw, 5rem); }
.nm-lead { max-width: 700px; margin: 0 auto; color: var(--muted); font-size: 1.1rem; line-height: 1.7; }
.nm-lead--left { margin: 0 0 1.25rem; }
.nm-note { color: var(--muted); font-size: .85rem; }
.nm-label { display: block; margin: .75rem 0 .3rem; color: var(--muted); font-size: .76rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

/* Hero */
.nm-hero { padding: clamp(2.5rem, 7vw, 6rem) 0 1rem; text-align: center; }
.nm-hero h1 { max-width: 880px; margin: 1rem auto 1.25rem; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 500; letter-spacing: -.045em; line-height: 1.04; }
.nm-hero__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: .6rem; margin-top: 1.75rem; }
.nm-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1px; max-width: 760px; margin: 2.25rem auto 1.5rem; padding: 0; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--border); list-style: none; }
.nm-stats li { padding: 1rem; background: var(--surface); color: var(--muted); font-size: .85rem; }
.nm-stats strong { display: block; color: var(--foreground); font-size: 1.6rem; font-weight: 600; letter-spacing: -.02em; }
.nm-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.nm-steps li { padding: 1.1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); color: var(--muted); font-size: .92rem; line-height: 1.55; }
.nm-steps strong { display: block; color: var(--foreground); margin-bottom: .25rem; }
.nm-steps span { display: inline-grid; width: 1.6rem; height: 1.6rem; margin-bottom: .6rem; place-items: center; border-radius: 50%; background: var(--accent); color: var(--accent-ink); font-size: .8rem; font-weight: 700; }
/* Components */
.ui-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 2.75rem; padding: .6rem 1.1rem; border: 1px solid var(--accent); border-radius: var(--radius-md); background: transparent; color: var(--foreground); font: inherit; font-size: .92rem; font-weight: 600; line-height: 1.2; text-decoration: none; cursor: pointer; transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.ui-btn--primary { background: var(--accent); color: var(--accent-ink) !important; }
.ui-btn--primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.ui-btn--outline { border-color: var(--border); }
.ui-btn--outline:hover, .ui-btn--outline[aria-pressed='true'] { border-color: var(--accent); background: var(--hover); }
.ui-btn--ghost { min-height: 2.5rem; border-color: transparent; }
.ui-btn--ghost:hover { background: var(--hover); }
.ui-btn:focus-visible, .ui-chip:focus-visible, .ui-pill:focus-visible, .ui-tab:focus-visible, .ui-link:focus-visible, .ui-input:focus-visible, summary:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.ui-input { width: 100%; min-height: 2.75rem; padding: .55rem .85rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: inherit; font: inherit; font-size: .95rem; }
textarea.ui-input { resize: vertical; }
.ui-chip { display: inline-flex; flex: 0 0 auto; align-items: center; gap: .45rem; min-height: 2.4rem; padding: .3rem .9rem; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: inherit; font: inherit; font-size: .86rem; font-weight: 600; white-space: nowrap; cursor: pointer; }
.ui-chip.is-active { border-color: var(--accent); background: var(--accent); color: var(--accent-ink); }
.ui-chip__n { padding: 0 .4rem; border-radius: 999px; background: color-mix(in srgb, currentColor 16%, transparent); font-size: .7rem; }
.ui-pill { min-height: 2rem; padding: .2rem .75rem; border: 1px solid transparent; border-radius: var(--radius-md); background: var(--surface-soft); color: inherit; font: inherit; font-size: .82rem; font-weight: 600; cursor: pointer; }
.ui-pill.is-active { border-color: var(--accent); background: var(--accent-soft); }
.ui-badge { display: inline-block; padding: .12rem .55rem; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-size: .72rem; font-weight: 600; }
.ui-badge--solid { border-color: var(--accent); background: var(--accent); color: var(--accent-ink); }
.ui-link { padding: 0; border: 0; background: none; color: var(--brand); font: inherit; font-weight: 600; text-decoration: underline; cursor: pointer; }
.ui-alert { max-width: 780px; margin: 1.5rem auto 0; padding: 1rem 1.2rem; border: 1px solid var(--border); border-left: 3px solid var(--brand); border-radius: var(--radius-md); background: var(--surface-soft); color: var(--muted); font-size: .92rem; line-height: 1.6; text-align: left; }
.ui-alert strong { color: var(--foreground); }
.ui-card { display: flex; min-width: 0; flex-direction: column; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow-sm); transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out); }
.ui-card--pad { padding: 1.4rem; }
@media (hover: hover) { .ui-card:hover { border-color: var(--subtle); box-shadow: var(--shadow); } }
.ui-card.is-selected { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.ui-card__media { position: relative; aspect-ratio: 16 / 9; background: linear-gradient(135deg, var(--surface-soft), var(--accent-soft)); }
.ui-card__media img { width: 100%; height: 100%; object-fit: cover; }
.ui-card__media .ui-badge { position: absolute; top: .75rem; left: .75rem; }
.ui-card__body { display: flex; flex: 1; flex-direction: column; padding: 1.25rem; }
.ui-card h3 { margin: .35rem 0 .5rem; font-size: 1.2rem; font-weight: 600; line-height: 1.3; }
.ui-table { width: 100%; border-collapse: collapse; font-size: .92rem; }
.ui-table th, .ui-table td { padding: .6rem .8rem; border-bottom: 1px solid var(--border); text-align: left; }
.ui-table th { color: var(--muted); font-size: .76rem; letter-spacing: .06em; text-transform: uppercase; }
.ui-empty { padding: 2.5rem 1.5rem; border: 1px dashed var(--border); border-radius: var(--radius-lg); color: var(--muted); text-align: center; }
.ui-empty h3 { margin: 0 0 .5rem; color: var(--foreground); }
.ui-tabs { display: flex; gap: .25rem; border-bottom: 1px solid var(--border); }
.ui-tab { padding: .7rem 1rem; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--muted); font: inherit; font-weight: 600; cursor: pointer; }
.ui-tab.is-active { border-color: var(--accent); color: var(--foreground); }
.ui-dialog { width: min(720px, calc(100% - 24px)); max-height: 90vh; padding: 0; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); color: var(--foreground); box-shadow: 0 24px 64px rgb(0 0 0 / .3); }
.ui-dialog::backdrop { background: rgb(0 0 0 / .5); }
.ui-dialog__inner { display: flex; max-height: 90vh; flex-direction: column; }
.ui-dialog__head { display: flex; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem 1rem; }
.ui-dialog__head h2 { margin: .3rem 0; border: 0; padding: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -.02em; }
.ui-panel { flex: 1; padding: 1.25rem 1.5rem; overflow-y: auto; line-height: 1.65; }
.ui-panel h4 { margin: 1rem 0 .4rem; font-size: .9rem; }
.ui-dialog__img { width: 100%; max-height: 220px; margin-bottom: 1rem; border-radius: var(--radius-md); object-fit: cover; }
.ui-dialog__foot { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; padding: 1rem 1.5rem; border-top: 1px solid var(--border); }
/* Catalogue */
.nm-toolbar { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem; }
.nm-search { position: relative; flex: 1 1 280px; }
.nm-search svg { position: absolute; top: 50%; left: .9rem; width: 1.1rem; height: 1.1rem; transform: translateY(-50%); fill: none; stroke: var(--muted); stroke-width: 1.8; stroke-linecap: round; pointer-events: none; }
.nm-search .ui-input { padding-left: 2.7rem; }
.nm-field { flex: 0 1 220px; }
.nm-chips { display: flex; gap: .5rem; margin-bottom: 1rem; padding-bottom: .25rem; overflow-x: auto; scrollbar-width: none; }
.nm-filters { display: flex; flex-wrap: wrap; gap: .75rem 2rem; margin-bottom: 1rem; }
.nm-group { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; }
.nm-group .nm-label { margin: 0 .35rem 0 0; }
.nm-range input { accent-color: var(--accent); }
.nm-status { display: flex; align-items: center; gap: .75rem; margin: 0 0 1rem; color: var(--muted); font-size: .9rem; }
.nm-grid, .nm-partners { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: var(--space-2); }
.nm-by { display: flex; align-items: center; gap: .55rem; margin: 0 0 .4rem; color: var(--muted); font-size: .88rem; }
.nm-avatar { display: inline-grid; width: 1.9rem; height: 1.9rem; place-items: center; border-radius: 50%; background: var(--accent-soft); color: var(--foreground); font-size: .68rem; font-weight: 700; }
.nm-rating { margin: 0 0 .6rem; color: var(--muted); font-size: .86rem; }
.nm-stars { color: #d9930d; letter-spacing: .05em; }
.nm-outcome { margin: 0 0 .9rem; color: var(--muted); line-height: 1.6; }
.nm-meta { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1rem; padding: 0; list-style: none; }
.nm-price { display: flex; align-items: baseline; gap: .4rem; margin: 0 0 1rem; color: var(--muted); font-size: .85rem; }
.nm-price strong { color: var(--foreground); font-size: 1.45rem; font-weight: 600; letter-spacing: -.02em; }
.nm-price--lg strong { font-size: 2rem; }
.nm-actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: auto; }
.nm-actions .ui-btn { flex: 1 1 auto; }
.nm-list { margin: 0 0 .5rem; padding-left: 1.2rem; color: var(--muted); }
.nm-recruit { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); align-items: start; }
.nm-result { display: flex; flex-direction: column; margin: 1.25rem 0; padding: 1rem; border-radius: var(--radius-md); background: var(--accent-soft); }
.nm-result strong { font-size: 2rem; font-weight: 600; letter-spacing: -.02em; }
.nm-result small { color: var(--muted); }
.nm-review { padding: .9rem 0; border-bottom: 1px solid var(--border); }
.nm-review p { margin: 0 0 .3rem; }
.nm-reviewform { margin-top: 1.25rem; padding-top: .5rem; }
.nm-reviewform .ui-btn { margin-top: .9rem; }
.nm-faq details { padding: .9rem 0; border-bottom: 1px solid var(--border); }
.nm-faq summary { font-weight: 600; cursor: pointer; }
.nm-faq p { margin: .6rem 0 0; color: var(--muted); line-height: 1.65; }
.nm-footer { margin-top: 4rem; padding: clamp(1.5rem, 4vw, 2.75rem); border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface-soft); text-align: center; }
.nm-footer h2 { margin: 0 0 .6rem; border: 0; padding: 0; font-weight: 500; }
.nm-footer p { max-width: 640px; margin: 0 auto 1.25rem; color: var(--muted); line-height: 1.65; }
.nm-basket { position: fixed; right: 0; bottom: max(1rem, env(safe-area-inset-bottom, 0px)); left: 0; z-index: 30; display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; width: min(calc(100% - 24px), 900px); margin: 0 auto; padding: .75rem .9rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: color-mix(in srgb, var(--surface) 90%, transparent); box-shadow: 0 16px 40px rgb(0 0 0 / .22); backdrop-filter: blur(18px); }
.nm-basket__text { display: flex; min-width: 0; flex: 1 1 240px; flex-direction: column; font-size: .88rem; }
.nm-basket__text span { overflow: hidden; color: var(--muted); text-overflow: ellipsis; white-space: nowrap; }
.nm-bar-enter-active, .nm-bar-leave-active { transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease; }
.nm-bar-enter-from, .nm-bar-leave-to { opacity: 0; transform: translateY(12px); }
@media (max-width: 640px) { .nm { width: min(calc(100% - 28px), 1160px); } .nm-toolbar { flex-direction: column; } .nm-field { flex-basis: auto; } .nm-basket .ui-btn { flex: 1 1 auto; } }
@media (prefers-reduced-motion: reduce) { .ui-card, .ui-btn, .nm-bar-enter-active, .nm-bar-leave-active { transition: none; } }
</style>
