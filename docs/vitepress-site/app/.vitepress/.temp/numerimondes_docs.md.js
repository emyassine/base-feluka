import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Numerimondes Documentation","description":"Technical documentation for Numerimondes products and platforms.","frontmatter":{"title":"Numerimondes Documentation","sidebarTitle":"Documentation","icon":"book-open","description":"Technical documentation for Numerimondes products and platforms.","search":false,"prev":false,"next":false},"headers":[],"relativePath":"numerimondes/docs.md","filePath":"numerimondes/docs.md"}');
const _sfc_main = { name: "numerimondes/docs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="numerimondes-documentation" tabindex="-1">Numerimondes Documentation <a class="header-anchor" href="#numerimondes-documentation" aria-label="Permalink to &quot;Numerimondes Documentation&quot;">​</a></h1><p>Technical guides for the products and platforms built by Numerimondes.</p><h2 id="webkernel" tabindex="-1">Webkernel <a class="header-anchor" href="#webkernel" aria-label="Permalink to &quot;Webkernel&quot;">​</a></h2><p>Explore the <a href="/numerimondes/docs/oss/webkernel/">Webkernel product guide</a> and its <a href="/numerimondes/docs/oss/webkernel/docs/2.x/">technical documentation</a>.</p><h2 id="services" tabindex="-1">Services <a class="header-anchor" href="#services" aria-label="Permalink to &quot;Services&quot;">​</a></h2><p>Numerimondes Cloud is presented with our <a href="/services/">services</a>, including managed hosting, infrastructure, features, and pricing.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("numerimondes/docs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const docs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  docs as default
};
