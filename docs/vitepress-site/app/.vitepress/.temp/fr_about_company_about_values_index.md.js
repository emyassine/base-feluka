import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Values","description":"Principles that guide our work.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Values","sidebarTitle":"Values","icon":"heart","description":"Principles that guide our work.","prev":{"text":"Story","link":"/fr/about/company/about/story/"},"next":{"text":"Vision","link":"/fr/about/company/about/vision/"}},"headers":[],"relativePath":"fr/about/company/about/values/index.md","filePath":"fr/about/company/about/values/index.md"}');
const _sfc_main = { name: "fr/about/company/about/values/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="values" tabindex="-1">Values <a class="header-anchor" href="#values" aria-label="Permalink to &quot;Values&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/about/values/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
