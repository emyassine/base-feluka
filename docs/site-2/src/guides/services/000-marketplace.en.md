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
import db from '@docs/src/guides/services/marketplace.json'
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
