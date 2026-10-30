import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Services","description":"Numerimondes — unit offers with closed scopes. Consulting, delivery, managed cloud, and tender support for organizations. Founder-led, real deliverables.","frontmatter":{"title":"Services","sidebarTitle":"Services","icon":"layout-grid","description":"Numerimondes — unit offers with closed scopes. Consulting, delivery, managed cloud, and tender support for organizations. Founder-led, real deliverables.","search":false,"prev":false,"next":{"text":"Audit","link":"/services/audit/"}},"headers":[],"relativePath":"services.md","filePath":"services.md"}');
const _sfc_main = { name: "services.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  const _component_NmStat = resolveComponent("NmStat");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><span class="nm-eyebrow">Founder-led · Casablanca</span><h1 class="nm-headline">Services for the work <span class="nm-headline-accent">your business needs done.</span></h1><p style="${ssrRenderStyle({ "max-width": "42rem", "margin": "1rem auto 0", "opacity": "0.85" })}"> Numerimondes is small on purpose: a founder, three people we trust completely, and a vetted network we bring in when a mission needs them. Each service answers one question a client actually asks — nothing overlaps, nothing is padding. Prefer starting from an outcome instead? See <a href="/solutions">Solutions</a>. </p></div><h2 id="which-service-answers-your-question" tabindex="-1">Which service answers your question? <a class="header-anchor" href="#which-service-answers-your-question" aria-label="Permalink to &quot;Which service answers your question?&quot;">​</a></h2><p>Read the question, not the label.</p><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "1.5rem 0 2.5rem", "gap": "0.75rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-chat-bubble-left-right",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/consulting" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Should we do this, and how?&quot; → Consulting</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/consulting",
            style: { "text-decoration": "none" }
          }, '"Should we do this, and how?" → Consulting')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A decision needs to be made — go-to-market, IS strategy, security posture, AI priorities — and you want it grounded in things we&#39;ve actually done, not a generic framework. `);
      } else {
        return [
          createTextVNode(" A decision needs to be made — go-to-market, IS strategy, security posture, AI priorities — and you want it grounded in things we've actually done, not a generic framework. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-magnifying-glass",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/audit" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;What do we have, and what is it costing us?&quot; → Audit</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/audit",
            style: { "text-decoration": "none" }
          }, '"What do we have, and what is it costing us?" → Audit')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` You want a factual map of your current tools or your full value chain, a number attached to the waste, and a report you can put in front of a board. No build included. `);
      } else {
        return [
          createTextVNode(" You want a factual map of your current tools or your full value chain, a number attached to the waste, and a report you can put in front of a board. No build included. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-code-bracket",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/development" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Build it.&quot; → Development</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/development",
            style: { "text-decoration": "none" }
          }, '"Build it." → Development')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` You need custom software — an application, a backend, an integration — designed and shipped once, that you then own outright. `);
      } else {
        return [
          createTextVNode(" You need custom software — an application, a backend, an integration — designed and shipped once, that you then own outright. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-bolt",
    color: "danger"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/automation" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Remove the manual work.&quot; → Automation</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/automation",
            style: { "text-decoration": "none" }
          }, '"Remove the manual work." → Automation')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A specific repetitive process — quote generation, invoice reconciliation, HR paperwork — needs to run itself. Priced against the time and money it saves, not the hours it takes to build. `);
      } else {
        return [
          createTextVNode(" A specific repetitive process — quote generation, invoice reconciliation, HR paperwork — needs to run itself. Priced against the time and money it saves, not the hours it takes to build. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cpu-chip",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/intelligence" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Make it smart, and keep it private.&quot; → Intelligence</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/intelligence",
            style: { "text-decoration": "none" }
          }, '"Make it smart, and keep it private." → Intelligence')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Local models, private knowledge bases, external signal pipelines, and workforce alignment — from a solo freelancer&#39;s second brain to an air-gapped institutional deployment. `);
      } else {
        return [
          createTextVNode(" Local models, private knowledge bases, external signal pipelines, and workforce alignment — from a solo freelancer's second brain to an air-gapped institutional deployment. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-server-stack",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/infrastructure" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Keep it running.&quot; → Infrastructure</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/infrastructure",
            style: { "text-decoration": "none" }
          }, '"Keep it running." → Infrastructure')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Software already exists (yours or ours) and needs to stay healthy — hosting ops as a mission, monitoring, migrations, and training your team to operate it without us. `);
      } else {
        return [
          createTextVNode(" Software already exists (yours or ours) and needs to stay healthy — hosting ops as a mission, monitoring, migrations, and training your team to operate it without us. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="managed-cloud" tabindex="-1">Managed cloud <a class="header-anchor" href="#managed-cloud" aria-label="Permalink to &quot;Managed cloud&quot;">​</a></h2><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "0 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cloud",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/cloud" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Numerimondes Cloud service</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/cloud",
            style: { "text-decoration": "none" }
          }, "Numerimondes Cloud service")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Managed hosting and server operations — shared hosting, VPS, bare metal, or your own hardware, managed and invoiced directly by Numerimondes. <a href="/services/cloud"${_scopeId}>See Numerimondes Cloud →</a>`);
      } else {
        return [
          createTextVNode(" Managed hosting and server operations — shared hosting, VPS, bare metal, or your own hardware, managed and invoiced directly by Numerimondes. "),
          createVNode("a", { href: "/services/cloud" }, "See Numerimondes Cloud →")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="tender-support" tabindex="-1">Tender support <a class="header-anchor" href="#tender-support" aria-label="Permalink to &quot;Tender support&quot;">​</a></h2><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "0 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-document-check",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/tender-support" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>&quot;Help us win this tender.&quot; → Tender Support</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/tender-support",
            style: { "text-decoration": "none" }
          }, '"Help us win this tender." → Tender Support')
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Public and private markets in Morocco and Europe — deal structuring and narrative &amp; dossier assembly. `);
      } else {
        return [
          createTextVNode(" Public and private markets in Morocco and Europe — deal structuring and narrative & dossier assembly. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="why-small-is-the-offer-not-the-excuse" tabindex="-1">Why small is the offer, not the excuse <a class="header-anchor" href="#why-small-is-the-offer-not-the-excuse" aria-label="Permalink to &quot;Why small is the offer, not the excuse&quot;">​</a></h2><p>Most consulting firms scale by adding layers between you and the person who understands your problem. We scale by adding proof. Every mission we take, someone with a name and a track record is accountable for it end to end — usually the founder himself.</p><p>This is not a romantic story about boutiques. It is a pricing and delivery decision: fewer people, less overhead, closed scopes, real deliverables, prices you can put in front of a board.</p><div class="grid-container grid-cols-4" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Team",
    value: "4",
    description: "Founder + 3 trusted operators",
    color: "primary",
    icon: "heroicon-o-user-group"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Network",
    value: "Vetted",
    description: "Freelancers & specialists, on demand",
    color: "success",
    icon: "heroicon-o-users"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Scope",
    value: "Closed",
    description: "Fixed deliverables, not open-ended hours",
    color: "warning",
    icon: "heroicon-o-clipboard-document-check"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Pricing",
    value: "Upfront",
    description: "A price, or at least an order of magnitude",
    color: "info",
    icon: "heroicon-o-currency-dollar"
  }, null, _parent));
  _push(`</div></div><h2 id="how-the-services-connect" tabindex="-1">How the services connect <a class="header-anchor" href="#how-the-services-connect" aria-label="Permalink to &quot;How the services connect&quot;">​</a></h2><p>They are not six silos. In practice, most engagements move left to right — though you can enter anywhere:</p><div class="grid-container grid-cols-3" style="${ssrRenderStyle({ "margin": "0.5rem 0 1rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "1. Diagnose",
    value: "Audit",
    description: "Map the stack and the value chain",
    color: "success",
    icon: "heroicon-o-magnifying-glass"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "2. Decide",
    value: "Consulting",
    description: "Prioritise, size the ROI, plan the move",
    color: "primary",
    icon: "heroicon-o-chat-bubble-left-right"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "3. Build",
    value: "Development",
    description: "Ship the systems that were prioritised",
    color: "info",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div></div><div class="grid-container grid-cols-3" style="${ssrRenderStyle({ "margin": "0 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "4. Sharpen",
    value: "Intelligence",
    description: "Add local models & private knowledge",
    color: "warning",
    icon: "heroicon-o-cpu-chip"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "5. Automate",
    value: "Automation",
    description: "Remove the repetitive work inside them",
    color: "danger",
    icon: "heroicon-o-bolt"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "6. Run",
    value: "Infrastructure",
    description: "Host, monitor, train your operators",
    color: "warning",
    icon: "heroicon-o-server-stack"
  }, null, _parent));
  _push(`</div></div><p>An audit does not commit you to a build. A build does not commit you to hosting with us. Each service stands on its own; together, they are how a company goes from &quot;we should probably modernise&quot; to running systems it actually owns.</p><h2 id="how-we-price" tabindex="-1">How we price <a class="header-anchor" href="#how-we-price" aria-label="Permalink to &quot;How we price&quot;">​</a></h2><p>We would rather quote a number than dress up a day rate. On every service you will find one of:</p><ul><li><strong>A closed package price</strong>, when the scope is standard enough to fix in advance (Audit, most of Automation).</li><li><strong>An order of magnitude and a milestone structure</strong>, when the work is bespoke (Development, Infrastructure, strategic Consulting) — so you know what you are walking into before a contract exists.</li></ul><p>Payment is always milestone-based. No 100%-upfront, no invoice-at-the-end surprises.</p><p>Each offer page is presentation-first: scope, includes/excludes, pricing method, CTA. Optional depth (methodology, pricing model, cloud detail) is one level under the offer — no deeper tree.</p><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "gap": "0.5rem" })}"></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("services.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const services = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  services as default
};
