import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Vision","description":"What we aim to build.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Vision","sidebarTitle":"Vision","icon":"eye","description":"What we aim to build.","prev":{"text":"Values","link":"/fr/about/company/about/values/"},"next":{"text":"Apply","link":"/fr/about/company/careers/apply/"}},"headers":[],"relativePath":"fr/about/company/about/vision/index.md","filePath":"fr/about/company/about/vision/index.md"}');
const _sfc_main = { name: "fr/about/company/about/vision/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="vision" tabindex="-1">Vision <a class="header-anchor" href="#vision" aria-label="Permalink to &quot;Vision&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/about/vision/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
