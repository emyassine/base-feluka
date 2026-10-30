import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Infrastructure","description":"Keep it running. Hosting, monitoring, migrations, and operator training for systems you already own.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Infrastructure","sidebarTitle":"Infrastructure","icon":"server","description":"Keep it running. Hosting, monitoring, migrations, and operator training for systems you already own.","search":false,"prev":{"text":"Webkernel Path","link":"/fr/services/development/webkernel-path/"},"next":{"text":"Self-Hosting","link":"/fr/services/infrastructure/self-hosting/"}},"headers":[],"relativePath":"fr/services/infrastructure.md","filePath":"fr/services/infrastructure.md"}');
const _sfc_main = { name: "fr/services/infrastructure.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  const _component_NmTriptych = resolveComponent("NmTriptych");
  const _component_NmStat = resolveComponent("NmStat");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Run-stage · Operations&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;The question this service answers: &lt;span class=&quot;nm-headline-accent&quot;&gt;&quot;keep it running.&quot;&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    Software already exists — yours or ours — and someone needs to keep it healthy: hosting, monitoring,
    migrations, and training your team to run it without calling us every time something changes.
&lt;/p&gt;
</code></pre></div><h2 id="where-this-service-starts-and-stops" tabindex="-1">Where this service starts and stops <a class="header-anchor" href="#where-this-service-starts-and-stops" aria-label="Permalink to &quot;Where this service starts and stops&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-check-circle",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Infrastructure includes`);
      } else {
        return [
          createTextVNode("Infrastructure includes")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Managed operations, CI/CD pipelines, legacy migrations, and hands-on operator training — as a consulting engagement, on whatever infrastructure you already have. `);
      } else {
        return [
          createTextVNode(" Managed operations, CI/CD pipelines, legacy migrations, and hands-on operator training — as a consulting engagement, on whatever infrastructure you already have. ")
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
        _push2(`Infrastructure does not include`);
      } else {
        return [
          createTextVNode("Infrastructure does not include")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Writing new application code (that&#39;s <a href="/services/development"${_scopeId}>Development</a>). Automating a specific business process with no-code/AI workflows (that&#39;s <a href="/services/automation"${_scopeId}>Automation</a>). The actual hosting product itself (that&#39;s <a href="/services/cloud"${_scopeId}>Numerimondes Cloud</a>). `);
      } else {
        return [
          createTextVNode(" Writing new application code (that's "),
          createVNode("a", { href: "/services/development" }, "Development"),
          createTextVNode("). Automating a specific business process with no-code/AI workflows (that's "),
          createVNode("a", { href: "/services/automation" }, "Automation"),
          createTextVNode("). The actual hosting product itself (that's "),
          createVNode("a", { href: "/services/cloud" }, "Numerimondes Cloud"),
          createTextVNode("). ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="my-8">`);
  _push(ssrRenderComponent(_component_NmTriptych, {
    left: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    center: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    right: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    height: "180px"
  }, null, _parent));
  _push(`</div><h2 id="what-we-operate" tabindex="-1">What we operate <a class="header-anchor" href="#what-we-operate" aria-label="Permalink to &quot;What we operate&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cog-6-tooth",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Maintenance &amp; managed operations`);
      } else {
        return [
          createTextVNode("Maintenance & managed operations")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Keep production healthy without surrendering control. Monitoring, updates, and incident discipline on infrastructure you own. `);
      } else {
        return [
          createTextVNode(" Keep production healthy without surrendering control. Monitoring, updates, and incident discipline on infrastructure you own. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-path-rounded-square",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`CI/CD &amp; deployment pipelines`);
      } else {
        return [
          createTextVNode("CI/CD & deployment pipelines")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Build, test, and release pipelines your team can operate — not a fragile setup only we understand. `);
      } else {
        return [
          createTextVNode(" Build, test, and release pipelines your team can operate — not a fragile setup only we understand. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-path",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Legacy migration &amp; upgrades`);
      } else {
        return [
          createTextVNode("Legacy migration & upgrades")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Phased transition, minimal disruption. Exit stacked SaaS rents where ownership makes economic sense. `);
      } else {
        return [
          createTextVNode(" Phased transition, minimal disruption. Exit stacked SaaS rents where ownership makes economic sense. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-academic-cap",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Operator training`);
      } else {
        return [
          createTextVNode("Operator training")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Your people run the stack. Hands-on sessions, runbooks, and escalation paths that survive staff turnover. `);
      } else {
        return [
          createTextVNode(" Your people run the stack. Hands-on sessions, runbooks, and escalation paths that survive staff turnover. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="where-you-host" tabindex="-1">Where you host <a class="header-anchor" href="#where-you-host" aria-label="Permalink to &quot;Where you host&quot;">​</a></h2><p>This service is about the work — the migration, the pipeline, the training — not about where things physically run. That question has three honest answers:</p><div class="grid-container grid-cols-3" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Option A",
    value: "Your hardware",
    description: "On-prem, home server, or your existing VPS",
    color: "primary",
    icon: "heroicon-o-building-office"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Option B",
    value: "A third party",
    description: "Any provider you already rent from",
    color: "success",
    icon: "heroicon-o-cloud"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Option C",
    value: "Numerimondes Cloud",
    description: "Our own managed server product",
    color: "warning",
    icon: "heroicon-o-server"
  }, null, _parent));
  _push(`</div></div><p>If you want the hardware itself managed — hardening, monitoring, backups, 24/7 emergency response — that is exactly what <a href="/fr/services/cloud">Numerimondes Cloud</a> does, and it is sold as its own product with its own console and pricing, independent of a services engagement. An Infrastructure consulting mission and a Numerimondes Cloud subscription can be bought together or entirely separately.</p><h2 id="pricing-method" tabindex="-1">Pricing method <a class="header-anchor" href="#pricing-method" aria-label="Permalink to &quot;Pricing method&quot;">​</a></h2><p>Infrastructure work is either project-based (a migration, a pipeline build-out) or a recurring managed-operations retainer. Same discipline as everywhere else:</p><table tabindex="0"><thead><tr><th>Formula</th><th>Scope</th><th>Typical basis</th></tr></thead><tbody><tr><td><strong>Migration project</strong></td><td>One-time legacy system move or platform upgrade</td><td>Fixed price per milestone</td></tr><tr><td><strong>Pipeline build-out</strong></td><td>CI/CD setup for one or several services</td><td>Fixed price</td></tr><tr><td><strong>Advisory retainer</strong></td><td>Ongoing operational strategy, not day-to-day server management</td><td>Monthly retainer, order of magnitude given upfront</td></tr><tr><td><strong>Operator training</strong></td><td>Hands-on sessions for your internal team</td><td>Fixed price per session or programme</td></tr></tbody></table><p>Payment stays milestone-based: never fully upfront, never a single invoice at the end.</p><h2 id="how-it-connects" tabindex="-1">How it connects <a class="header-anchor" href="#how-it-connects" aria-label="Permalink to &quot;How it connects&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "0.5rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-magnifying-glass",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`From audit findings`);
      } else {
        return [
          createTextVNode("From audit findings")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Level 1 and Level 2 audits surface lock-in and migration opportunities. Infrastructure work turns those findings into running systems. `);
      } else {
        return [
          createTextVNode(" Level 1 and Level 2 audits surface lock-in and migration opportunities. Infrastructure work turns those findings into running systems. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-code-bracket",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Beside development`);
      } else {
        return [
          createTextVNode("Beside development")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Custom apps from <a href="/services/development"${_scopeId}>Development</a> need environments, pipelines, and operators. We close that loop. `);
      } else {
        return [
          createTextVNode(" Custom apps from "),
          createVNode("a", { href: "/services/development" }, "Development"),
          createTextVNode(" need environments, pipelines, and operators. We close that loop. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="go-deeper" tabindex="-1">Go deeper <a class="header-anchor" href="#go-deeper" aria-label="Permalink to &quot;Go deeper&quot;">​</a></h2><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "1rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-shield-check",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/infrastructure/self-hosting" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Why self-hosting, and when it doesn&#39;t make sense</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/infrastructure/self-hosting",
            style: { "text-decoration": "none" }
          }, "Why self-hosting, and when it doesn't make sense")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` An honest look at the sovereignty argument — including the cases where renting is still the right call. `);
      } else {
        return [
          createTextVNode(" An honest look at the sovereignty argument — including the cases where renting is still the right call. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Request an infrastructure briefing


    Numerimondes Cloud


    Start with an audit

← Services
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/infrastructure.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const infrastructure = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  infrastructure as default
};
