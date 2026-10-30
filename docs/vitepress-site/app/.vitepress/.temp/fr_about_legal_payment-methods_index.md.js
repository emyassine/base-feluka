import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Payment methods","description":"Accepted payment methods.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Payment methods","sidebarTitle":"Payment methods","icon":"credit-card","description":"Accepted payment methods.","prev":{"text":"Overview","link":"/fr/about/legal/overview/"},"next":{"text":"Privacy","link":"/fr/about/legal/privacy/"}},"headers":[],"relativePath":"fr/about/legal/payment-methods/index.md","filePath":"fr/about/legal/payment-methods/index.md"}');
const _sfc_main = { name: "fr/about/legal/payment-methods/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="payment-methods" tabindex="-1">Payment methods <a class="header-anchor" href="#payment-methods" aria-label="Permalink to &quot;Payment methods&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/legal/payment-methods/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
