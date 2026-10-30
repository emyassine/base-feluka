import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Catalogue","description":"Global index of education offerings.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Catalogue","sidebarTitle":"Catalogue","icon":"list","description":"Global index of education offerings.","search":false,"prev":false,"next":{"text":"Institutional","link":"/fr/education/institutional/"}},"headers":[],"relativePath":"fr/education/catalogue.md","filePath":"fr/education/catalogue.md"}');
const _sfc_main = { name: "fr/education/catalogue.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="catalogue" tabindex="-1">Catalogue <a class="header-anchor" href="#catalogue" aria-label="Permalink to &quot;Catalogue&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/education/catalogue.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const catalogue = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  catalogue as default
};
