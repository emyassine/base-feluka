import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Current partners","description":"Organisations we partner with.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Current partners","sidebarTitle":"Current partners","icon":"building-office","description":"Organisations we partner with.","prev":{"text":"Become a partner","link":"/fr/partnerships/become-partner/"},"next":{"text":"Institutional","link":"/fr/partnerships/institutional/"}},"headers":[],"relativePath":"fr/partnerships/current-partners/index.md","filePath":"fr/partnerships/current-partners/index.md"}');
const _sfc_main = { name: "fr/partnerships/current-partners/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="current-partners" tabindex="-1">Current partners <a class="header-anchor" href="#current-partners" aria-label="Permalink to &quot;Current partners&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/partnerships/current-partners/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
