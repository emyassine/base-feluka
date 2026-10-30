import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Apply","description":"Submit an application to join Numerimondes.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Apply","sidebarTitle":"Apply","icon":"send","description":"Submit an application to join Numerimondes.","prev":{"text":"Vision","link":"/fr/about/company/about/vision/"},"next":{"text":"Open positions","link":"/fr/about/company/careers/open-positions/"}},"headers":[],"relativePath":"fr/about/company/careers/apply/index.md","filePath":"fr/about/company/careers/apply/index.md"}');
const _sfc_main = { name: "fr/about/company/careers/apply/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="apply" tabindex="-1">Apply <a class="header-anchor" href="#apply" aria-label="Permalink to &quot;Apply&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/careers/apply/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
