import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Cloud Platforms","description":"The Numerimondes products and platforms that run on Numerimondes Cloud infrastructure.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Cloud Platforms","sidebarTitle":"Platforms","icon":"layout-grid","description":"The Numerimondes products and platforms that run on Numerimondes Cloud infrastructure.","search":false,"prev":{"text":"Features","link":"/fr/services/cloud/features/"},"next":{"text":"Pricing","link":"/fr/services/cloud/pricing/"}},"headers":[],"relativePath":"fr/services/cloud/platforms.md","filePath":"fr/services/cloud/platforms.md"}');
const _sfc_main = { name: "fr/services/cloud/platforms.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Cloud · Platforms&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;What we build &lt;span class=&quot;nm-headline-accent&quot;&gt;runs on this infrastructure too.&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A subpage of &lt;a href=&quot;/services/cloud&quot;&gt;Numerimondes Cloud&lt;/a&gt;. Our own products and platforms
    are hosted and managed on the same infrastructure we offer to clients — not a separate, better-treated environment.
&lt;/p&gt;
</code></pre></div><h2 id="our-ecosystem" tabindex="-1">Our ecosystem <a class="header-anchor" href="#our-ecosystem" aria-label="Permalink to &quot;Our ecosystem&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-building-office-2",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Numerimondes — numerimondes.com`);
      } else {
        return [
          createTextVNode("Numerimondes — numerimondes.com")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Corporate site — software engineering, products, and strategic consulting. `);
      } else {
        return [
          createTextVNode(" Corporate site — software engineering, products, and strategic consulting. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cube",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Webkernel — webkernelphp.com`);
      } else {
        return [
          createTextVNode("Webkernel — webkernelphp.com")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Open-source PHP application framework for sovereign enterprise apps. See the <a href="/numerimondes/docs/oss/webkernel"${_scopeId}>product page</a>. `);
      } else {
        return [
          createTextVNode(" Open-source PHP application framework for sovereign enterprise apps. See the "),
          createVNode("a", { href: "/numerimondes/docs/oss/webkernel" }, "product page"),
          createTextVNode(". ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-user-group",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`The Best Recruit — thebestrecruit.com`);
      } else {
        return [
          createTextVNode("The Best Recruit — thebestrecruit.com")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Self-hosted HR and learning suite — applicant tracking, learning management, and talent management. `);
      } else {
        return [
          createTextVNode(" Self-hosted HR and learning suite — applicant tracking, learning management, and talent management. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-globe-alt",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`EAS Bridge — easbridge.com`);
      } else {
        return [
          createTextVNode("EAS Bridge — easbridge.com")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Cross-border platform bridging enterprise application services between Morocco and Europe. `);
      } else {
        return [
          createTextVNode(" Cross-border platform bridging enterprise application services between Morocco and Europe. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Other products in development on the same infrastructure include a partner-program portal and an Amazigh-language e-learning platform; both will be listed here once live.</p><h2 id="why-this-matters" tabindex="-1">Why this matters <a class="header-anchor" href="#why-this-matters" aria-label="Permalink to &quot;Why this matters&quot;">​</a></h2><p>We manage our own production infrastructure on the same stack we offer clients — the same hardening, monitoring, and backup discipline described on the <a href="/fr/services/cloud/features">Features page</a>. If a security update or a configuration change is worth applying to a client server, we apply it to our own platforms too, since downtime or a breach on our own products costs us directly.</p><p>We are not publishing specific uptime percentages or response-time figures on this page as a marketing claim — real performance depends on the tier, the workload, and the hardware involved, and any figure we haven&#39;t independently verified for a given period is not one we will assert here. Clients under an active management agreement receive their own service reporting as part of that agreement.</p><h2 id="host-your-platform-on-the-same-infrastructure" tabindex="-1">Host your platform on the same infrastructure <a class="header-anchor" href="#host-your-platform-on-the-same-infrastructure" aria-label="Permalink to &quot;Host your platform on the same infrastructure&quot;">​</a></h2><p>Whether a single domain or a multi-product portfolio, the same managed environment described on this page and on <a href="/fr/services/cloud/features">Features</a> is available under any of the four <a href="/fr/services/cloud/pricing">pricing tiers</a>.</p><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Get in touch


    See pricing

← Numerimondes Cloud
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/cloud/platforms.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const platforms = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  platforms as default
};
