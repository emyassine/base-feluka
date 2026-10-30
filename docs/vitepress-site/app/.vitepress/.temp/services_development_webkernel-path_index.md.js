import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"The Webkernel Path","description":"Building on Webkernel — a source-available enterprise foundation you host and control, instead of a build from a blank page.","frontmatter":{"title":"The Webkernel Path","sidebarTitle":"Webkernel Path","icon":"cube","description":"Building on Webkernel — a source-available enterprise foundation you host and control, instead of a build from a blank page.","prev":{"text":"Development","link":"/services/development/"},"next":{"text":"Infrastructure","link":"/services/infrastructure/"}},"headers":[],"relativePath":"services/development/webkernel-path/index.md","filePath":"services/development/webkernel-path/index.md"}');
const _sfc_main = { name: "services/development/webkernel-path/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Development · Foundation option&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Not every build starts from a &lt;span class=&quot;nm-headline-accent&quot;&gt;blank page&lt;/span&gt;.&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A subpage of &lt;a href=&quot;/services/development&quot;&gt;Development&lt;/a&gt;. Webkernel is a source-available
    enterprise foundation created by our founder — one option among several, not a mandatory dependency.
&lt;/p&gt;
</code></pre></div><h2 id="what-webkernel-is-in-this-context" tabindex="-1">What Webkernel is, in this context <a class="header-anchor" href="#what-webkernel-is-in-this-context" aria-label="Permalink to &quot;What Webkernel is, in this context&quot;">​</a></h2><p>Webkernel is an open-source foundation built for digital sovereignty: the idea that a company should own its tools instead of depending permanently on a foreign SaaS stack it can never fully control. It was created by Yassine El Moumen before Numerimondes existed as a business, and it remains the technical backbone behind several of our own products.</p><p>When we scope a Development engagement, Webkernel is one path we can propose — not the only one, and never forced.</p><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-check-circle",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`When we suggest it`);
      } else {
        return [
          createTextVNode("When we suggest it")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` You need a business application with standard enterprise concerns — auth, admin, data modelling — and want to avoid re-solving those from zero. Self-hosting matters to you, contractually or philosophically. `);
      } else {
        return [
          createTextVNode(" You need a business application with standard enterprise concerns — auth, admin, data modelling — and want to avoid re-solving those from zero. Self-hosting matters to you, contractually or philosophically. ")
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
        _push2(`When we don&#39;t`);
      } else {
        return [
          createTextVNode("When we don't")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Your requirements are narrow enough that a lighter, purpose-built stack is faster and cheaper. Fit comes first — Webkernel is a means, not the goal of the engagement. `);
      } else {
        return [
          createTextVNode(" Your requirements are narrow enough that a lighter, purpose-built stack is faster and cheaper. Fit comes first — Webkernel is a means, not the goal of the engagement. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="what-sovereign-means-in-practice" tabindex="-1">What &quot;sovereign&quot; means in practice <a class="header-anchor" href="#what-sovereign-means-in-practice" aria-label="Permalink to &quot;What &quot;sovereign&quot; means in practice&quot;">​</a></h2><ul><li><strong>Source leverage</strong> — you are not waiting on a vendor roadmap to ship a feature you need today.</li><li><strong>Data locality</strong> — your data lives where you decide to host it, including fully air-gapped if required.</li><li><strong>No forced SaaS rent</strong> — the core application does not carry a recurring per-seat licence to a third party.</li><li><strong>Your roadmap, not someone else&#39;s toggle</strong> — a vendor cannot deprecate a feature you depend on out from under you.</li></ul><h2 id="how-it-fits-with-the-rest-of-numerimondes" tabindex="-1">How it fits with the rest of Numerimondes <a class="header-anchor" href="#how-it-fits-with-the-rest-of-numerimondes" aria-label="Permalink to &quot;How it fits with the rest of Numerimondes&quot;">​</a></h2><ul><li>An <a href="/services/audit">Audit</a> can identify where a self-hosted foundation would remove ongoing SaaS cost — Webkernel is often the concrete answer to that finding.</li><li>Once a Webkernel-based system ships, running it long-term is <a href="/services/infrastructure">Infrastructure</a> work: hosting, monitoring, and operator training. It can also run on <a href="/services/cloud">Numerimondes Cloud</a> if you choose managed hosting instead of your own hardware.</li><li>Webkernel itself has its own <a href="/numerimondes/docs/oss/webkernel">product page</a> with technical documentation, separate from this services context.</li></ul><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Discuss a Webkernel-based build


    Webkernel product page

← Development
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("services/development/webkernel-path/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
