import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Yassine El Moumen","description":"","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Yassine El Moumen","sidebarTitle":"Yassine El Moumen","icon":"user-round","prev":{"text":"Employees","link":"/fr/about/company/team/employees/"},"next":{"text":"Notice","link":"/fr/about/legal/notice/"}},"headers":[],"relativePath":"fr/about/company/team/employees/elmoumenyassine/index.md","filePath":"fr/about/company/team/employees/elmoumenyassine/index.md"}');
const _sfc_main = { name: "fr/about/company/team/employees/elmoumenyassine/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="yassine-el-moumen" tabindex="-1">Yassine El Moumen <a class="header-anchor" href="#yassine-el-moumen" aria-label="Permalink to &quot;Yassine El Moumen&quot;">​</a></h1><p>Founder and Managing Director of Numerimondes.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/team/employees/elmoumenyassine/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
