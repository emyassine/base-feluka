import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Numerimondes Cloud","description":"Server management, hosting, and infrastructure resale — shared hosting, VPS, bare metal, or your own hardware, managed and invoiced directly by Numerimondes.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Numerimondes Cloud","sidebarTitle":"Cloud","icon":"cloud","description":"Server management, hosting, and infrastructure resale — shared hosting, VPS, bare metal, or your own hardware, managed and invoiced directly by Numerimondes.","prev":{"text":"Pricing Model","link":"/fr/services/automation/pricing-model/"},"next":{"text":"Features","link":"/fr/services/cloud/features/"}},"headers":[],"relativePath":"fr/services/cloud/index.md","filePath":"fr/services/cloud/index.md"}');
const _sfc_main = { name: "fr/services/cloud/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Hosting &amp; management · Casablanca-based&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Server management, &lt;span class=&quot;nm-headline-accent&quot;&gt;without the overhead.&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 40rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    Numerimondes Cloud is a management and hosting layer on infrastructure we operate, resell, or
    manage on your behalf — shared hosting, a VPS, a dedicated bare-metal server, or hardware you
    already own. You choose the tier. We configure, secure, and invoice it directly, under our name.
&lt;/p&gt;
</code></pre></div><h2 id="where-this-service-starts-and-stops" tabindex="-1">Where this service starts and stops <a class="header-anchor" href="#where-this-service-starts-and-stops" aria-label="Permalink to &quot;Where this service starts and stops&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-check-circle",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cloud includes`);
      } else {
        return [
          createTextVNode("Cloud includes")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Server provisioning or resale, OS and stack configuration, security hardening, monitoring, backups, and ongoing management — invoiced directly by Numerimondes, whatever the underlying hardware. `);
      } else {
        return [
          createTextVNode(" Server provisioning or resale, OS and stack configuration, security hardening, monitoring, backups, and ongoing management — invoiced directly by Numerimondes, whatever the underlying hardware. ")
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
        _push2(`Cloud does not include`);
      } else {
        return [
          createTextVNode("Cloud does not include")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Writing application code (that&#39;s <a href="/services/development"${_scopeId}>Development</a>). Strategic decisions about your infrastructure roadmap (that&#39;s <a href="/services/infrastructure"${_scopeId}>Infrastructure</a> consulting). Automating a business process (that&#39;s <a href="/services/automation"${_scopeId}>Automation</a>). `);
      } else {
        return [
          createTextVNode(" Writing application code (that's "),
          createVNode("a", { href: "/services/development" }, "Development"),
          createTextVNode("). Strategic decisions about your infrastructure roadmap (that's "),
          createVNode("a", { href: "/services/infrastructure" }, "Infrastructure"),
          createTextVNode(" consulting). Automating a business process (that's "),
          createVNode("a", { href: "/services/automation" }, "Automation"),
          createTextVNode("). ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="how-the-commercial-model-works" tabindex="-1">How the commercial model works <a class="header-anchor" href="#how-the-commercial-model-works" aria-label="Permalink to &quot;How the commercial model works&quot;">​</a></h2><p>This is a direct hosting and management relationship, not a referral to a third-party cloud provider. Numerimondes provisions or sources the underlying capacity, applies the management layer, and invoices the client directly under the Numerimondes name — regardless of which of the four tiers below is chosen.</p><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-squares-2x2",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Shared hosting`);
      } else {
        return [
          createTextVNode("Shared hosting")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Web hosting on shared infrastructure — the lowest-cost entry tier, suited to standard web projects and smaller sites. `);
      } else {
        return [
          createTextVNode(" Web hosting on shared infrastructure — the lowest-cost entry tier, suited to standard web projects and smaller sites. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-server",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`VPS`);
      } else {
        return [
          createTextVNode("VPS")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A virtual private server sized to your workload, fully managed — isolated resources without the cost of dedicated hardware. `);
      } else {
        return [
          createTextVNode(" A virtual private server sized to your workload, fully managed — isolated resources without the cost of dedicated hardware. ")
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
        _push2(`Bare metal dedicated`);
      } else {
        return [
          createTextVNode("Bare metal dedicated")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A physical server reserved entirely for you — for workloads that need dedicated resources, predictable performance, or specific compliance requirements. `);
      } else {
        return [
          createTextVNode(" A physical server reserved entirely for you — for workloads that need dedicated resources, predictable performance, or specific compliance requirements. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-building-office",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Bring your own`);
      } else {
        return [
          createTextVNode("Bring your own")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Hardware you already own or rent — physical server, home machine, or an existing VPS from any provider — with the same management layer applied to it. `);
      } else {
        return [
          createTextVNode(" Hardware you already own or rent — physical server, home machine, or an existing VPS from any provider — with the same management layer applied to it. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Full pricing for each tier is on the <a href="/fr/services/cloud/pricing">pricing page →</a></p><h2 id="what-managed-means-here" tabindex="-1">What &quot;managed&quot; means here <a class="header-anchor" href="#what-managed-means-here" aria-label="Permalink to &quot;What &quot;managed&quot; means here&quot;">​</a></h2><p>We sit between you and the raw infrastructure, whichever tier you choose. You keep ownership of your data and, where applicable, your hardware. We handle configuration, security, monitoring, updates, and backups.</p><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-shield-check",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Security baseline applied by default`);
      } else {
        return [
          createTextVNode("Security baseline applied by default")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Firewall configuration, SSH hardening, automated security updates, and malware scanning — configured from first boot, not left to a default install. `);
      } else {
        return [
          createTextVNode(" Firewall configuration, SSH hardening, automated security updates, and malware scanning — configured from first boot, not left to a default install. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-path",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Stack-agnostic`);
      } else {
        return [
          createTextVNode("Stack-agnostic")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` PHP, Node.js, Python, Ruby, Go, Java, .NET, Rust, and the corresponding database engines — see the <a href="/services/cloud/tech-stack"${_scopeId}>full technology list</a>. `);
      } else {
        return [
          createTextVNode(" PHP, Node.js, Python, Ruby, Go, Java, .NET, Rust, and the corresponding database engines — see the "),
          createVNode("a", { href: "/services/cloud/tech-stack" }, "full technology list"),
          createTextVNode(". ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Full detail on what is configured, monitored, and maintained is on the <a href="/fr/services/cloud/features">features page →</a></p><h2 id="who-this-is-for" tabindex="-1">Who this is for <a class="header-anchor" href="#who-this-is-for" aria-label="Permalink to &quot;Who this is for&quot;">​</a></h2><p>Clients who came through an <a href="/fr/services/audit">Audit</a> or <a href="/fr/services/infrastructure">Infrastructure</a> engagement and want a straightforward place to host the result, and anyone — services client or not — who wants a directly-invoiced, actively managed server without negotiating with a foreign hosting provider themselves.</p><hr><h2 id="go-deeper" tabindex="-1">Go deeper <a class="header-anchor" href="#go-deeper" aria-label="Permalink to &quot;Go deeper&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-adjustments-horizontal",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/cloud/features" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Features — what we configure and monitor</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/cloud/features",
            style: { "text-decoration": "none" }
          }, "Features — what we configure and monitor")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` The full breakdown: server hardening, database management, SSL/DNS/email, monitoring, and backups. `);
      } else {
        return [
          createTextVNode(" The full breakdown: server hardening, database management, SSL/DNS/email, monitoring, and backups. ")
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
        _push2(`<a href="/services/cloud/tech-stack" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Tech stack — every runtime, every database</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/cloud/tech-stack",
            style: { "text-decoration": "none" }
          }, "Tech stack — every runtime, every database")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Languages, database engines, and frameworks we configure and manage. `);
      } else {
        return [
          createTextVNode(" Languages, database engines, and frameworks we configure and manage. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-currency-dollar",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/cloud/pricing" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Pricing — shared, VPS, bare metal, or your own hardware</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/cloud/pricing",
            style: { "text-decoration": "none" }
          }, "Pricing — shared, VPS, bare metal, or your own hardware")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Transparent tiers, published rates for shared hosting, and a quote process for the rest. `);
      } else {
        return [
          createTextVNode(" Transparent tiers, published rates for shared hosting, and a quote process for the rest. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-squares-2x2",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/cloud/platforms" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Platforms — what already runs on this infrastructure</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/cloud/platforms",
            style: { "text-decoration": "none" }
          }, "Platforms — what already runs on this infrastructure")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` The Numerimondes products and client deployments hosted on this same management layer. `);
      } else {
        return [
          createTextVNode(" The Numerimondes products and client deployments hosted on this same management layer. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Ask about Numerimondes Cloud


    See pricing


    Infrastructure services

← Services
</code></pre></div><p>:::md justified Numerimondes Cloud is a service of Numerimondes SARL AU. Where infrastructure is sourced from third-party providers for resale, Numerimondes remains the contracting and billing party; underlying provider terms may apply to service availability and are disclosed on request.</p><p><strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/cloud/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
