import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Modules","description":"Webkernel modules catalogue.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Modules","sidebarTitle":"Modules","icon":"puzzle-piece","description":"Webkernel modules catalogue.","search":false,"prev":{"text":"Getting started","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/"},"next":{"text":"Roadmap","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/modules.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/modules.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/modules.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="modules" tabindex="-1">Modules <a class="header-anchor" href="#modules" aria-label="Permalink to &quot;Modules&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/modules.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const modules = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  modules as default
};
