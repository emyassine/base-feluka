import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Cookbook","description":"Recipes and practical patterns.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Cookbook","sidebarTitle":"Cookbook","icon":"book-open","description":"Recipes and practical patterns.","prev":{"text":"Contributing","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing/"},"next":{"text":"Demo","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/index.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/index.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="cookbook" tabindex="-1">Cookbook <a class="header-anchor" href="#cookbook" aria-label="Permalink to &quot;Cookbook&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
