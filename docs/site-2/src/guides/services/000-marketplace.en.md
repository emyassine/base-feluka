---
title: "Service Marketplace | Numerimondes"
sidebarTitle: "Marketplace"
icon: "@spmpst::icon::store"
description: "A catalogue of scoped consulting, software, infrastructure and operations services."
lang: en
status: "demo"
layout: home
---

<style>
.service-marketplace {
  --marketplace-border: var(--vp-c-divider, #d8dee8);
  --marketplace-muted: var(--vp-c-text-2, #657080);
  width: min(100% - 40px, 1120px);
  margin: 0 auto 5rem;
  color: var(--vp-c-text-1, #172033);
}
.service-marketplace__hero {
  padding: clamp(2.5rem, 7vw, 6rem) 0 3rem;
  text-align: center;
}
.service-marketplace__eyebrow {
  margin: 0 0 1rem;
  color: var(--marketplace-muted);
  font-size: .76rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.service-marketplace__hero h1 {
  max-width: 850px;
  margin: 0 auto 1.25rem;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1.04;
}
.service-marketplace__hero > p:last-of-type {
  max-width: 700px;
  margin: 0 auto;
  color: var(--marketplace-muted);
  font-size: 1.12rem;
  line-height: 1.7;
}
.service-marketplace__notice {
  margin: 1.5rem auto 0;
  max-width: 760px;
  padding: 1rem 1.2rem;
  border: 1px solid var(--marketplace-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f6f8fb);
  color: var(--marketplace-muted);
  font-size: .95rem;
  text-align: left;
}
.service-marketplace__section-title {
  margin: 3rem 0 1.25rem;
  font-size: clamp(1.65rem, 3vw, 2.2rem);
  font-weight: 500;
  letter-spacing: -.025em;
}
.service-marketplace__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.service-marketplace__card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: clamp(1.2rem, 3vw, 1.7rem);
  border: 1px solid var(--marketplace-border);
  border-radius: 16px;
  background: var(--vp-c-bg, #fff);
  box-shadow: 0 8px 28px rgb(15 23 42 / .045);
}
.service-marketplace__card h3 {
  margin: 0 0 .55rem;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
}
.service-marketplace__summary {
  margin: 0 0 1.1rem;
  color: var(--marketplace-muted);
  line-height: 1.6;
}
.service-marketplace__price {
  margin: 0 0 1rem;
  padding: .85rem 1rem;
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #3977c8) 8%, transparent);
  line-height: 1.5;
}
.service-marketplace__price strong { display: block; margin-bottom: .2rem; }
.service-marketplace__card h4 {
  margin: .5rem 0 .35rem;
  font-size: .9rem;
  font-weight: 700;
}
.service-marketplace__card ul {
  margin: 0 0 1rem;
  padding-left: 1.2rem;
  color: var(--marketplace-muted);
  line-height: 1.6;
}
.service-marketplace__card li + li { margin-top: .25rem; }
.service-marketplace__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  margin-top: auto;
  padding: .65rem 1rem;
  border: 1px solid var(--vp-c-brand-1, #3977c8);
  border-radius: 9px;
  background: var(--vp-c-brand-1, #3977c8);
  color: #fff !important;
  font-weight: 650;
  text-decoration: none;
}
.service-marketplace__link:hover { filter: brightness(.94); }
.service-marketplace__process {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.service-marketplace__process li {
  padding: 1rem;
  border-top: 2px solid var(--vp-c-brand-1, #3977c8);
  background: var(--vp-c-bg-soft, #f6f8fb);
  line-height: 1.5;
}
.service-marketplace__process strong { display: block; margin-bottom: .3rem; }
.service-marketplace__footer {
  margin-top: 3rem;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 16px;
  background: var(--vp-c-bg-soft, #f6f8fb);
  text-align: center;
}
.service-marketplace__footer h2 { margin: 0 0 .6rem; font-weight: 550; }
.service-marketplace__footer p { max-width: 680px; margin: 0 auto 1rem; color: var(--marketplace-muted); line-height: 1.65; }
@media (max-width: 720px) {
  .service-marketplace__grid { grid-template-columns: 1fr; }
  .service-marketplace__process { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 420px) {
  .service-marketplace { width: min(100% - 28px, 1120px); }
  .service-marketplace__process { grid-template-columns: 1fr; }
}
</style>

<main class="service-marketplace">
  <header class="service-marketplace__hero" style="text-align:center;">
    <p class="service-marketplace__eyebrow">Services · Numerimondes</p>
    <h1>Choose a clear next step for your <span class="silky-bbi+115">project</span>.</h1>
    <p>Browse practical services across business advisory, software, infrastructure and operations. Each engagement has a defined scope, a delivery process and a written price before work begins.</p>
    <aside class="service-marketplace__notice" role="note">
      <strong>Demo catalogue:</strong> public fixed prices are not published yet. Each offer shows the basis used to prepare a quote; the final scope, amount, schedule and assumptions are confirmed in a written proposal.
    </aside>
  </header>

  <section aria-labelledby="marketplace-project-services">
    <h2 id="marketplace-project-services" class="service-marketplace__section-title">Project <span class="silky-bbi+115">services</span></h2>
    <div class="service-marketplace__grid">
      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Business advisory</p>
        <h3>Business and operations diagnostic</h3>
        <p class="service-marketplace__summary">Clarify a business challenge, understand how work currently happens and identify practical improvement options.</p>
        <p class="service-marketplace__price"><strong>Price: by quotation</strong>Estimated specialist time × agreed rate, plus any approved travel or research expenses.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Number of teams, processes or locations involved</li>
          <li>Availability and quality of existing information</li>
          <li>Required interviews, analysis and final deliverables</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=diagnostic">Request a diagnostic quote</a>
      </article>

      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Discovery and feasibility</p>
        <h3>Project discovery study</h3>
        <p class="service-marketplace__summary">Turn an early idea or complex requirement into options, risks, requirements and a decision-ready delivery plan.</p>
        <p class="service-marketplace__price"><strong>Price: fixed scope or milestones</strong>Research and analysis effort + agreed outputs + any approved specialist or third-party costs.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Technical and commercial uncertainty to resolve</li>
          <li>Systems, integrations and stakeholders to review</li>
          <li>Depth of the business case, prototype or specification</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=discovery">Scope a discovery study</a>
      </article>

      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Software and automation</p>
        <h3>Workflow or internal tool</h3>
        <p class="service-marketplace__summary">Design and build a targeted application, dashboard, integration or automation around an agreed operating need.</p>
        <p class="service-marketplace__price"><strong>Price: milestone or fixed-scope quote</strong>Estimated design and development effort + agreed testing and handover + approved licensing or infrastructure.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Number of user roles, workflows and screens</li>
          <li>Data migration, integrations and access controls</li>
          <li>Hosting, documentation and ongoing support needs</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=software">Discuss a software project</a>
      </article>

      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Infrastructure</p>
        <h3>Infrastructure and deployment review</h3>
        <p class="service-marketplace__summary">Review a hosting or self-hosted environment and prepare practical recommendations for deployment, backup, monitoring or continuity.</p>
        <p class="service-marketplace__price"><strong>Price: scoped review or implementation quote</strong>Environment size + review depth + agreed recommendations or implementation tasks.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Servers, applications, sites and equipment in scope</li>
          <li>Access, documentation and operational constraints</li>
          <li>Required testing, migration and follow-up support</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=infrastructure">Request an infrastructure quote</a>
      </article>

      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Operations and training</p>
        <h3>Process improvement workshop</h3>
        <p class="service-marketplace__summary">Bring the people involved in a process together to map friction, agree priorities and define changes that can be put into practice.</p>
        <p class="service-marketplace__price"><strong>Price: per agreed workshop or program</strong>Preparation + session delivery + synthesis and follow-up, based on the number of participants and sessions.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Workshop length, format and number of participants</li>
          <li>Preparation, facilitation and materials required</li>
          <li>Whether a process map or implementation plan is included</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=operations">Plan a workshop</a>
      </article>

      <article class="service-marketplace__card">
        <p class="service-marketplace__eyebrow">Ongoing support</p>
        <h3>Operational support arrangement</h3>
        <p class="service-marketplace__summary">Agree a recurring scope for advisory, maintenance or operational assistance, with responsibilities and coverage clearly documented.</p>
        <p class="service-marketplace__price"><strong>Price: monthly or capacity-based quote</strong>Reserved capacity + covered systems or activities + agreed service window and reporting.</p>
        <h4>What shapes the quote</h4>
        <ul>
          <li>Systems, environments and activities covered</li>
          <li>Expected workload, response expectations and service hours</li>
          <li>Reporting, improvement work and exclusions</li>
        </ul>
        <a class="service-marketplace__link" href="/company/prologue/contact?topic=support">Discuss ongoing support</a>
      </article>
    </div>
  </section>

  <section aria-labelledby="marketplace-process">
    <h2 id="marketplace-process" class="service-marketplace__section-title">A clear process from request to <span class="silky-bbi+115">delivery</span></h2>
    <ol class="service-marketplace__process">
      <li><strong>1. Share the need</strong>Tell us the objective, current situation and any important deadline.</li>
      <li><strong>2. Confirm the scope</strong>We clarify deliverables, assumptions, dependencies and responsibilities.</li>
      <li><strong>3. Review the proposal</strong>You receive the price, schedule and terms in writing before approving work.</li>
      <li><strong>4. Start the engagement</strong>Work begins after approval, with progress and handover handled as agreed.</li>
    </ol>
  </section>

  <footer class="service-marketplace__footer">
    <h2>Need a service tailored to your situation?</h2>
    <p>Send a short description of the outcome you need. We can help determine which service fits and what information is needed for an accurate quote.</p>
    <a class="service-marketplace__link" href="/company/prologue/contact?topic=quote">Request a proposal</a>
  </footer>
</main>
