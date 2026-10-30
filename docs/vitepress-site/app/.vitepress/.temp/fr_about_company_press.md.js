import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Press","description":"Media kit and press releases.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Press","sidebarTitle":"Press","icon":"megaphone","description":"Media kit and press releases.","search":false,"prev":{"text":"Group","link":"/fr/about/company/group/"},"next":{"text":"Employees","link":"/fr/about/company/team/employees/"}},"headers":[],"relativePath":"fr/about/company/press.md","filePath":"fr/about/company/press.md"}');
const _sfc_main = { name: "fr/about/company/press.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="press" tabindex="-1">Press <a class="header-anchor" href="#press" aria-label="Permalink to &quot;Press&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/press.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const press = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  press as default
};
