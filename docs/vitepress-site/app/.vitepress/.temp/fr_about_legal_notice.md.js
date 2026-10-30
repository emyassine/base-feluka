import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Legal notice","description":"Company legal information.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Legal notice","sidebarTitle":"Notice","icon":"file-text","description":"Company legal information.","search":false,"prev":{"text":"Yassine El Moumen","link":"/fr/about/company/team/employees/elmoumenyassine/"},"next":{"text":"Overview","link":"/fr/about/legal/overview/"}},"headers":[],"relativePath":"fr/about/legal/notice.md","filePath":"fr/about/legal/notice.md"}');
const _sfc_main = { name: "fr/about/legal/notice.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="legal-notice" tabindex="-1">Legal notice <a class="header-anchor" href="#legal-notice" aria-label="Permalink to &quot;Legal notice&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/legal/notice.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const notice = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  notice as default
};
