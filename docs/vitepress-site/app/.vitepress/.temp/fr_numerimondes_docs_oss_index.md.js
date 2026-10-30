import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Webkernel","description":"Source-available enterprise foundation — product landing.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Webkernel","sidebarTitle":"Webkernel","icon":"cube","description":"Source-available enterprise foundation — product landing.","search":false,"prev":false,"next":{"text":"API reference","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/index.md","filePath":"fr/numerimondes/docs/oss/index.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="webkernel" tabindex="-1">Webkernel <a class="header-anchor" href="#webkernel" aria-label="Permalink to &quot;Webkernel&quot;">​</a></h1><p>Source-available enterprise foundation for builders who host and control their stack.</p><h2 id="explore" tabindex="-1">Explore <a class="header-anchor" href="#explore" aria-label="Permalink to &quot;Explore&quot;">​</a></h2><ul><li><a href="/fr/numerimondes/docs/oss/webkernel/docs/2.x/">Documentation</a></li><li><a href="/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/">Changelog</a></li><li><a href="/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/">Roadmap</a></li><li><a href="/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/">Demo</a></li><li><a href="/fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/">Showcase</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
