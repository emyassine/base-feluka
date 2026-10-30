import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Development","description":"Build it. Custom software you own outright — designed once, shipped once, no vendor left in the loop.","frontmatter":{"title":"Development","sidebarTitle":"Development","icon":"code-xml","description":"Build it. Custom software you own outright — designed once, shipped once, no vendor left in the loop.","search":false,"prev":{"text":"How We Sprint","link":"/services/consulting/how-we-sprint/"},"next":{"text":"Webkernel Path","link":"/services/development/webkernel-path/"}},"headers":[],"relativePath":"services/development.md","filePath":"services/development.md"}');
const _sfc_main = { name: "services/development.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  const _component_NmTriptych = resolveComponent("NmTriptych");
  const _component_NmStat = resolveComponent("NmStat");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Build-stage · Engineering&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;The question this service answers: &lt;span class=&quot;nm-headline-accent&quot;&gt;&quot;build it.&quot;&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    You already know what you need — an application, a backend, an integration. This is the service
    that designs it, ships it, and hands it to you as something you own outright, not rent.
&lt;/p&gt;
</code></pre></div><h2 id="where-this-service-starts-and-stops" tabindex="-1">Where this service starts and stops <a class="header-anchor" href="#where-this-service-starts-and-stops" aria-label="Permalink to &quot;Where this service starts and stops&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-check-circle",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Development includes`);
      } else {
        return [
          createTextVNode("Development includes")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Architecture, build, and handover of custom software: business applications, backend systems, integrations, and platform modernisation — as a one-time delivery. `);
      } else {
        return [
          createTextVNode(" Architecture, build, and handover of custom software: business applications, backend systems, integrations, and platform modernisation — as a one-time delivery. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-x-circle",
    color: "danger"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Development does not include`);
      } else {
        return [
          createTextVNode("Development does not include")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Hosting or running what we build long-term (that&#39;s <a href="/services/infrastructure"${_scopeId}>Infrastructure</a>). Automating a specific repetitive process with no-code tools (that&#39;s <a href="/services/automation"${_scopeId}>Automation</a>). `);
      } else {
        return [
          createTextVNode(" Hosting or running what we build long-term (that's "),
          createVNode("a", { href: "/services/infrastructure" }, "Infrastructure"),
          createTextVNode("). Automating a specific repetitive process with no-code tools (that's "),
          createVNode("a", { href: "/services/automation" }, "Automation"),
          createTextVNode("). ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="my-8">`);
  _push(ssrRenderComponent(_component_NmTriptych, {
    left: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    center: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    right: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    height: "180px"
  }, null, _parent));
  _push(`</div><h2 id="what-we-ship" tabindex="-1">What we ship <a class="header-anchor" href="#what-we-ship" aria-label="Permalink to &quot;What we ship&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cube",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Sovereign software development`);
      } else {
        return [
          createTextVNode("Sovereign software development")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Business apps on foundations you own. Source leverage, data locality, and a roadmap you decide — not a SaaS toggle someone else can flip. `);
      } else {
        return [
          createTextVNode(" Business apps on foundations you own. Source leverage, data locality, and a roadmap you decide — not a SaaS toggle someone else can flip. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-square-3-stack-3d",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Backend architecture &amp; systems design`);
      } else {
        return [
          createTextVNode("Backend architecture & systems design")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Domain models, boundaries, and honest trade-offs. Architecture that survives the first three years of real use. `);
      } else {
        return [
          createTextVNode(" Domain models, boundaries, and honest trade-offs. Architecture that survives the first three years of real use. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-link",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Integration &amp; delivery`);
      } else {
        return [
          createTextVNode("Integration & delivery")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Pipelines and environments your teams can operate. Connect existing tools without rebuilding everything at once. `);
      } else {
        return [
          createTextVNode(" Pipelines and environments your teams can operate. Connect existing tools without rebuilding everything at once. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-trending-up",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Platform modernisation`);
      } else {
        return [
          createTextVNode("Platform modernisation")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Incremental, not big-bang theatre. Replace lock-in and debt in phases that keep production stable. `);
      } else {
        return [
          createTextVNode(" Incremental, not big-bang theatre. Replace lock-in and debt in phases that keep production stable. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="pricing-method" tabindex="-1">Pricing method <a class="header-anchor" href="#pricing-method" aria-label="Permalink to &quot;Pricing method&quot;">​</a></h2><p>Development is bespoke by nature, so we do not pretend to fix a price before scoping. What we commit to instead:</p><ul><li><strong>An order of magnitude within the first conversation</strong> — before any contract, so you know roughly what you are walking into.</li><li><strong>A closed quote after scoping</strong>, broken into milestones tied to shippable increments, not calendar time.</li><li><strong>Milestone payment</strong>, never 100% upfront and never a single invoice at the end.</li></ul><table tabindex="0"><thead><tr><th>Formula</th><th>Scope</th><th>Typical basis</th></tr></thead><tbody><tr><td><strong>Scoping sprint</strong></td><td>Requirements, architecture direction, estimate</td><td>Fixed price, 1–2 weeks</td></tr><tr><td><strong>Build phase</strong></td><td>Design → build → handover, per milestone</td><td>Fixed price per milestone, agreed after scoping</td></tr><tr><td><strong>Ongoing evolution</strong></td><td>Post-launch features, capped monthly capacity</td><td>Monthly retainer, order of magnitude given upfront</td></tr></tbody></table><h2 id="how-we-work" tabindex="-1">How we work <a class="header-anchor" href="#how-we-work" aria-label="Permalink to &quot;How we work&quot;">​</a></h2><div class="grid-container grid-cols-3" style="${ssrRenderStyle({ "margin": "0.5rem 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Start",
    value: "Scope",
    description: "Clear in / out · milestones",
    color: "primary",
    icon: "heroicon-o-clipboard-document-check"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Build",
    value: "Ship",
    description: "Working software, documented",
    color: "success",
    icon: "heroicon-o-rocket-launch"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Handover",
    value: "Own",
    description: "You run it after we leave",
    color: "warning",
    icon: "heroicon-o-key"
  }, null, _parent));
  _push(`</div></div><ul><li><strong>Audit-informed builds</strong> — when useful, start from an <a href="/services/audit">Audit</a> pack so scope is grounded in your real stack and value chain</li><li><strong>No perpetual dependency</strong> — we design for your operators, not for infinite billable change requests</li><li>Once shipped, ongoing hosting and operations move to <a href="/services/infrastructure">Infrastructure</a> — a separate, optional engagement</li></ul><p>Registered purpose includes information-systems consulting and software development. Day-to-day positioning lives here; official identifiers under <a href="/about/legal">Legal</a>.</p><hr><h2 id="go-deeper" tabindex="-1">Go deeper <a class="header-anchor" href="#go-deeper" aria-label="Permalink to &quot;Go deeper&quot;">​</a></h2><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "1rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cube",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/development/webkernel-path" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>The Webkernel path — a sovereign foundation you host yourself</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/development/webkernel-path",
            style: { "text-decoration": "none" }
          }, "The Webkernel path — a sovereign foundation you host yourself")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` For organisations that want a source-available enterprise foundation instead of a build from a blank page. `);
      } else {
        return [
          createTextVNode(" For organisations that want a source-available enterprise foundation instead of a build from a blank page. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Book a technical briefing


    Webkernel product


    Infrastructure

← Services
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("services/development.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const development = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  development as default
};
