import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Showcase","description":"Who builds with Webkernel.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Showcase","sidebarTitle":"Showcase","icon":"star","description":"Who builds with Webkernel.","prev":{"text":"Roadmap","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/"},"next":{"text":"Upgrade","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/index.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/index.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="showcase" tabindex="-1">Showcase <a class="header-anchor" href="#showcase" aria-label="Permalink to &quot;Showcase&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
