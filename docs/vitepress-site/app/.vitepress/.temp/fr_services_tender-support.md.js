import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Tender Support","description":"End-to-end public and private tender support for Morocco and Europe — deal structuring on a deposit-plus-commission model, and technical dossier production.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Tender Support","sidebarTitle":"Tender Support","icon":"file-check","description":"End-to-end public and private tender support for Morocco and Europe — deal structuring on a deposit-plus-commission model, and technical dossier production.","search":false,"prev":{"text":"Intelligence","link":"/fr/services/intelligence/"},"next":{"text":"Deal Structuring","link":"/fr/services/tender-support/deal-structuring/"}},"headers":[],"relativePath":"fr/services/tender-support.md","filePath":"fr/services/tender-support.md"}');
const _sfc_main = { name: "fr/services/tender-support.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Public &amp; private markets · Morocco &amp; Europe&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;The question this service answers: &lt;span class=&quot;nm-headline-accent&quot;&gt;&quot;help us win this tender.&quot;&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 40rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    We help clients become suppliers on public and private tenders in Morocco and Europe —
    from finding the right opportunity to submitting a technically credible file. It splits into
    two related services, either of which can stand alone.
&lt;/p&gt;
</code></pre></div><h2 id="two-tracks-one-goal" tabindex="-1">Two tracks, one goal <a class="header-anchor" href="#two-tracks-one-goal" aria-label="Permalink to &quot;Two tracks, one goal&quot;">​</a></h2><p>Most clients need Deal Structuring; some tenders additionally need Narrative &amp; Assembly as a separately-scoped deliverable. Either track can stand alone.</p><h2 id="go-deeper" tabindex="-1">Go deeper <a class="header-anchor" href="#go-deeper" aria-label="Permalink to &quot;Go deeper&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-briefcase",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/tender-support/deal-structuring" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Deal Structuring</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/tender-support/deal-structuring",
            style: { "text-decoration": "none" }
          }, "Deal Structuring")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Sourcing the tender if you don&#39;t have one yet, assembling the administrative and financial file, submitting it, and following it through to award — on a deposit-plus-commission model tied to whether you win. `);
      } else {
        return [
          createTextVNode(" Sourcing the tender if you don't have one yet, assembling the administrative and financial file, submitting it, and following it through to award — on a deposit-plus-commission model tied to whether you win. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-puzzle-piece",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<a href="/services/tender-support/narrative-assembly" style="${ssrRenderStyle({ "text-decoration": "none" })}"${_scopeId}>Narrative &amp; Assembly</a>`);
      } else {
        return [
          createVNode("a", {
            href: "/services/tender-support/narrative-assembly",
            style: { "text-decoration": "none" }
          }, "Narrative & Assembly")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Turning material you already have — brochures, specs, financials — into the coherent story a cahier des charges, a bank, or an investor actually needs to see. Production is subcontracted when required; the narrative and assembly are ours. `);
      } else {
        return [
          createTextVNode(" Turning material you already have — brochures, specs, financials — into the coherent story a cahier des charges, a bank, or an investor actually needs to see. Production is subcontracted when required; the narrative and assembly are ours. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Discuss a tender file


    Deal Structuring


    Narrative &amp; Assembly

← Services
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/tender-support.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tenderSupport = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  tenderSupport as default
};
