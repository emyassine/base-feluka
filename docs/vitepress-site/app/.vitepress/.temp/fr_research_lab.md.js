import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Lab","description":"Public experiments and prototypes from Numerimondes research.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Lab","sidebarTitle":"Lab","icon":"beaker","description":"Public experiments and prototypes from Numerimondes research.","search":false,"prev":false,"next":{"text":"Publications","link":"/fr/research/publications/"}},"headers":[],"relativePath":"fr/research/lab.md","filePath":"fr/research/lab.md"}');
const _sfc_main = { name: "fr/research/lab.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="lab" tabindex="-1">Lab <a class="header-anchor" href="#lab" aria-label="Permalink to &quot;Lab&quot;">​</a></h1><p>Prototypes, interactive demos, and experimental builds. When a lab result matures into something we sell, it is documented under <a href="/fr/services">Services</a> (or the relevant product page) and linked from here and from publications.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/research/lab.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const lab = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  lab as default
};
