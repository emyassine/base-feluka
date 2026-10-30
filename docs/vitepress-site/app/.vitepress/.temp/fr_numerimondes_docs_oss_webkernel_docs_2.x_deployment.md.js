import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Deployment","description":"Ship and operate Webkernel.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Deployment","sidebarTitle":"Deployment","icon":"cloud-arrow-up","description":"Ship and operate Webkernel.","search":false,"prev":{"text":"Demo","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/"},"next":{"text":"Getting started","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/"}},"headers":[],"relativePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment.md","filePath":"fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment.md"}');
const _sfc_main = { name: "fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="deployment" tabindex="-1">Deployment <a class="header-anchor" href="#deployment" aria-label="Permalink to &quot;Deployment&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deployment = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  deployment as default
};
