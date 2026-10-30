import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Solutions","description":"Named packages that compose several Numerimondes services into one outcome. Unit services live under Services.","frontmatter":{"title":"Solutions","sidebarTitle":"Solutions","icon":"sparkles","description":"Named packages that compose several Numerimondes services into one outcome. Unit services live under Services.","search":false,"prev":{"text":"Contact","link":"/contact/"},"next":{"text":"Home","link":"/solutions/home-2/"}},"headers":[],"relativePath":"solutions.md","filePath":"solutions.md"}');
const _sfc_main = { name: "solutions.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Packages · separate from the catalogue&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Solutions compose &lt;span class=&quot;nm-headline-accent&quot;&gt;several services&lt;/span&gt;.&lt;/h1&gt;
&lt;p style=&quot;max-width: 42rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A &lt;strong&gt;service&lt;/strong&gt; is one brick you can buy alone — its full writing stays on the service page.
    A &lt;strong&gt;solution&lt;/strong&gt; is a named package that sequences those bricks (for example Audit, then decide, then build and run).
    We do not move or rewrite a service into Solutions; we compose it.
&lt;/p&gt;
</code></pre></div><h2 id="services-vs-solutions" tabindex="-1">Services vs solutions <a class="header-anchor" href="#services-vs-solutions" aria-label="Permalink to &quot;Services vs solutions&quot;">​</a></h2><table tabindex="0"><thead><tr><th></th><th><strong>Services</strong></th><th><strong>Solutions</strong></th></tr></thead><tbody><tr><td>What</td><td>One unit offer</td><td>Several services in one package</td></tr><tr><td>Example</td><td><a href="/services/audit">Audit</a> alone</td><td><a href="/solutions/modernization">Modernization</a> = Audit + the work that follows</td></tr><tr><td>Writing</td><td>Full redaction on the service page</td><td>Composition + links — no copy-paste of unit pages</td></tr><tr><td>Where</td><td><a href="/services">/services</a></td><td>This section</td></tr></tbody></table><hr><h2 id="packaged-solutions" tabindex="-1">Packaged solutions <a class="header-anchor" href="#packaged-solutions" aria-label="Permalink to &quot;Packaged solutions&quot;">​</a></h2><div class="grid-container grid-cols-1" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem", "gap": "0.75rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-path",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/solutions/modernization" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Modernization</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/solutions/modernization",
            style: { "text-decoration": "none" }
          }, "Modernization")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` From diagnosis to systems you own: Audit → Consulting → Development and/or Automation → Infrastructure / Cloud. Phase detail lives on each service page; this pack is the assembly. <a href="/solutions/modernization"${_scopeId}>Open Modernization →</a>`);
      } else {
        return [
          createTextVNode(" From diagnosis to systems you own: Audit → Consulting → Development and/or Automation → Infrastructure / Cloud. Phase detail lives on each service page; this pack is the assembly. "),
          createVNode("a", { href: "/solutions/modernization" }, "Open Modernization →")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="prefer-a-single-brick" tabindex="-1">Prefer a single brick? <a class="header-anchor" href="#prefer-a-single-brick" aria-label="Permalink to &quot;Prefer a single brick?&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-2 mb-4"><pre><code>    Browse services


    Audit service


    Modernization pack
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("solutions.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const solutions = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  solutions as default
};
