import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Audit Methodology","description":"How Numerimondes scopes Level 1 vs Level 2 audits, when an NDA applies, and how the three-year TCO figure is built.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Audit Methodology","sidebarTitle":"Methodology","icon":"book-open","description":"How Numerimondes scopes Level 1 vs Level 2 audits, when an NDA applies, and how the three-year TCO figure is built.","search":false,"prev":{"text":"Audit","link":"/fr/services/audit/"},"next":{"text":"Automation","link":"/fr/services/automation/"}},"headers":[],"relativePath":"fr/services/audit/methodology.md","filePath":"fr/services/audit/methodology.md"}');
const _sfc_main = { name: "fr/services/audit/methodology.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Audit · Methodology&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;How we decide &lt;span class=&quot;nm-headline-accent&quot;&gt;how deep to go&lt;/span&gt;, and how we protect what we find.&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A subpage of &lt;a href=&quot;/services/audit&quot;&gt;Audit&lt;/a&gt; — the reasoning behind Level 1 vs Level 2,
    the NDA trigger, and the three-year TCO model. For packages and price ranges, see the parent page.
&lt;/p&gt;
</code></pre></div><h2 id="why-two-levels-not-one-audit-for-everyone" tabindex="-1">Why two levels, not one audit for everyone <a class="header-anchor" href="#why-two-levels-not-one-audit-for-everyone" aria-label="Permalink to &quot;Why two levels, not one audit for everyone&quot;">​</a></h2><p>Most audits sold in the market are Level 1 in substance, sold at Level 2 prices: a list of software, with commentary. That is useful, but it stops at the stack. <strong>Pseudo-consulting stops at the stack.</strong> The real cost of an underperforming organisation rarely lives only in tool choice — it lives in how work moves between people.</p><p>So we split the offer honestly instead of folding one into the other:</p><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cpu-chip",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Level 1 — what we look at`);
      } else {
        return [
          createTextVNode("Level 1 — what we look at")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Every tool in active use: what it costs monthly and cumulatively, what it locks you into, what it does not do, and what a self-hosted alternative would change. `);
      } else {
        return [
          createTextVNode(" Every tool in active use: what it costs monthly and cumulatively, what it locks you into, what it does not do, and what a self-hosted alternative would change. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrows-pointing-out",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Level 2 — what we add`);
      } else {
        return [
          createTextVNode("Level 2 — what we add")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` The processes around those tools: who touches what, where handoffs break, which tasks are manual because nobody has had time to automate them, and what that manual work costs in hours per month. `);
      } else {
        return [
          createTextVNode(" The processes around those tools: who touches what, where handoffs break, which tasks are manual because nobody has had time to automate them, and what that manual work costs in hours per month. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Level 2 is never forced. Many clients get everything they need from Level 1 — a smaller company running four SaaS tools does not need an organisational value-chain study. Level 2 earns its price when the organisation is dense enough that process friction outweighs the software bill.</p><h2 id="the-nda-trigger-explained" tabindex="-1">The NDA trigger, explained <a class="header-anchor" href="#the-nda-trigger-explained" aria-label="Permalink to &quot;The NDA trigger, explained&quot;">​</a></h2><p>We are precise about when confidentiality escalates, because it should not be a blanket clause that makes every engagement feel heavier than it is.</p><ul><li><strong>Level 1</strong> touches software licences, subscription costs, and technical configuration — information a vendor invoice or an admin panel already shows. A lighter confidentiality clause in the quote covers this, unless you ask for more.</li><li><strong>Level 2</strong> touches how your organisation actually operates — internal processes, management data, sometimes financial elements tied to margin or headcount. That is materially more sensitive, so a signed <strong>NDA always precedes any Level 2 access</strong>, no exceptions, before a single interview or document review begins.</li></ul><p>If you start at Level 1 and later decide to extend to Level 2, the NDA is signed at that point — you are never asked to sign it upfront for work you have not yet committed to.</p><h2 id="how-the-three-year-tco-figure-is-built" tabindex="-1">How the three-year TCO figure is built <a class="header-anchor" href="#how-the-three-year-tco-figure-is-built" aria-label="Permalink to &quot;How the three-year TCO figure is built&quot;">​</a></h2><p>The <strong>Total Cost of Ownership</strong> projection is the number most clients actually forward to their CFO, so it is worth explaining what goes into it rather than leaving it as a black box:</p><ul><li><strong>Current-state cost</strong>: every subscription, licence, and per-seat fee at today&#39;s rate, projected forward assuming no changes — including typical vendor price increases where a pattern exists.</li><li><strong>Hidden cost</strong>: integration maintenance, workarounds, and the operational cost of vendor lock-in when a tool becomes harder to leave than to keep.</li><li><strong>Alternative-state cost</strong>: what a self-hosted or owned equivalent would cost to build and maintain over the same three years, including our own estimate for the work involved — not a marketing number.</li></ul><p>The comparison is <strong>indicative and built per client</strong> during the audit itself, from your actual invoices and tool list — never a generic industry average dressed up as your number.</p><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Request an audit quote

← Audit
Services
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/audit/methodology.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const methodology = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  methodology as default
};
