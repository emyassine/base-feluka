import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Contributing","description":"How to contribute to Webkernel.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Contributing","sidebarTitle":"Contributing","icon":"heart","description":"How to contribute to Webkernel.","search":false,"prev":{"text":"Changelog","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/"},"next":{"text":"Cookbook","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="contributing" tabindex="-1">Contributing <a class="header-anchor" href="#contributing" aria-label="Permalink to &quot;Contributing&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contributing = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  contributing as default
};
