import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Architecture","description":"System design and core concepts.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Architecture","sidebarTitle":"Architecture","icon":"layout-grid","description":"System design and core concepts.","search":false,"prev":{"text":"API reference","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/"},"next":{"text":"Changelog","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="architecture" tabindex="-1">Architecture <a class="header-anchor" href="#architecture" aria-label="Permalink to &quot;Architecture&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const architecture = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  architecture as default
};
