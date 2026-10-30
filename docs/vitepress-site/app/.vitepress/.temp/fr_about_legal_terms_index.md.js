import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Terms of use","description":"Terms governing use of our sites and services.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Terms of use","sidebarTitle":"Terms","icon":"file-check","description":"Terms governing use of our sites and services.","prev":{"text":"Privacy","link":"/fr/about/legal/privacy/"},"next":false},"headers":[],"relativePath":"fr/about/legal/terms/index.md","filePath":"fr/about/legal/terms/index.md"}');
const _sfc_main = { name: "fr/about/legal/terms/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="terms-of-use" tabindex="-1">Terms of use <a class="header-anchor" href="#terms-of-use" aria-label="Permalink to &quot;Terms of use&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/legal/terms/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
