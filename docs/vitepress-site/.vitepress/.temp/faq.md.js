import { ssrRenderAttrs } from "@vue/server-renderer";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Feluqa FAQ","description":"Frequently asked questions and links to the Feluqa documentation guides.","frontmatter":{"title":"Feluqa FAQ","sidebarTitle":"FAQ","icon":"circle-help","description":"Frequently asked questions and links to the Feluqa documentation guides.","lang":"en","search":false,"prev":false,"next":false},"headers":[],"relativePath":"faq.md","filePath":"faq.md"}');
const _sfc_main = { name: "faq.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="feluqa-faq" tabindex="-1">Feluqa FAQ <a class="header-anchor" href="#feluqa-faq" aria-label="Permalink to &quot;Feluqa FAQ&quot;">​</a></h1><h2 id="popular-guides" tabindex="-1">Popular guides <a class="header-anchor" href="#popular-guides" aria-label="Permalink to &quot;Popular guides&quot;">​</a></h2><ul><li><a href="/get-started/">Get started</a> — Understand Feluqa and build a first application.</li><li><a href="/internals/">Internals</a> — Explore runtime, workspace, and compile-time architecture.</li><li><a href="/agents/">Agents</a> — Read contribution guidance for AI coding agents.</li><li><a href="/learn/">Learn</a> — Follow practical application tutorials.</li></ul><h2 id="quick-answers" tabindex="-1">Quick answers <a class="header-anchor" href="#quick-answers" aria-label="Permalink to &quot;Quick answers&quot;">​</a></h2><h3 id="what-is-feluqa" tabindex="-1">What is Feluqa? <a class="header-anchor" href="#what-is-feluqa" aria-label="Permalink to &quot;What is Feluqa?&quot;">​</a></h3><p>Feluqa is a proprietary platform and unified namespace for building applications across web, workstation, mobile, games, APIs, and real-time systems. The target architecture is still under development.</p><h3 id="where-should-i-start" tabindex="-1">Where should I start? <a class="header-anchor" href="#where-should-i-start" aria-label="Permalink to &quot;Where should I start?&quot;">​</a></h3><p>Start with Get started to understand the current product direction, set up a development environment, and follow the application guides.</p><h3 id="is-the-complete-platform-available-today" tabindex="-1">Is the complete platform available today? <a class="header-anchor" href="#is-the-complete-platform-available-today" aria-label="Permalink to &quot;Is the complete platform available today?&quot;">​</a></h3><p>No. The repository provides selected framework foundations, while several target capabilities such as dynamic module installation and complete runtime shells remain in active development.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("faq.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const faq = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  faq as default
};
