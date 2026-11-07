---
title: "Partners Guide | Numerimondes"
sidebarTitle: "Partners Guide"
icon: "@spmpst::icon::users"
description: "Meet the independent specialists and organizations in the Numerimondes partner network."
lang: en
status: "demo"
layout: home-subheader
---

<script setup lang="ts">
import { computed } from 'vue'
import db from '@docs/src/guides/services/marketplace.json'
const allReviews = computed(() => db.reviews)
const partnerRating = (partnerId: string) => {
  const reviews = allReviews.value.filter((review: any) => review.verified && db.services.find((service: any) => service.id === review.service)?.partner === partnerId)
  return { count: reviews.length, avg: reviews.length ? reviews.reduce((total: number, review: any) => total + review.rating, 0) / reviews.length : 0 }
}
const stars = (rating: number) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
</script>

<main class="nm">
  <header class="nm-hero"><p class="nm-eyebrow">NUMERIMONDES · PARTNER NETWORK</p><h1>Partners Guide</h1><p class="nm-lead">Meet the independent specialists and organizations who contribute to selected client assignments.</p></header>
  <section aria-labelledby="partners-list" class="nm-section">
    <h2 id="partners-list" class="nm-title">Our <span class="silky-bbi+115">partners</span></h2>
    <div class="nm-partners">
      <article v-for="p in db.partners" :key="p.id" class="ui-card ui-card--pad">
        <p class="nm-by"><span class="nm-avatar" aria-hidden="true">{{ p.name.slice(0, 2).toUpperCase() }}</span><strong>{{ p.name }}</strong></p>
        <p class="nm-eyebrow">{{ p.role }}</p><p class="nm-outcome">{{ p.bio }}</p>
        <p class="nm-rating"><span class="nm-stars">{{ stars(partnerRating(p.id).avg) }}</span> <strong>{{ partnerRating(p.id).count ? partnerRating(p.id).avg.toFixed(1) : 'New' }}</strong> · {{ partnerRating(p.id).count }} verified reviews · since {{ p.since }}</p>
        <ul class="nm-meta"><li v-for="badge in p.badges" :key="badge" class="ui-badge">{{ badge }}</li></ul>
      </article>
    </div>
    <aside class="ui-alert"><strong>Are you a specialist or an organisation?</strong> Partners bring clients or expertise; Numerimondes handles qualification, contracting, invoicing and accountability. <a href="/opportunities/morocco/partner-commercial-terms">Explore partner opportunities in Morocco</a> or <a href="/company/contact?topic=partner">discuss a partnership</a>.</aside>
  </section>
</main>
