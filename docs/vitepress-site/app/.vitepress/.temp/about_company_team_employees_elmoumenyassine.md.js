import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Yassine El Moumen","description":"","frontmatter":{"title":"Yassine El Moumen","sidebarTitle":"Yassine El Moumen","icon":"user-round","search":false,"prev":{"text":"Employees","link":"/about/company/team/employees/"},"next":{"text":"Notice","link":"/about/legal/notice/"}},"headers":[],"relativePath":"about/company/team/employees/elmoumenyassine.md","filePath":"about/company/team/employees/elmoumenyassine.md"}');
const _sfc_main = { name: "about/company/team/employees/elmoumenyassine.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="yassine-el-moumen" tabindex="-1">Yassine El Moumen <a class="header-anchor" href="#yassine-el-moumen" aria-label="Permalink to &quot;Yassine El Moumen&quot;">​</a></h1><p>Founder and Managing Director of Numerimondes.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/team/employees/elmoumenyassine.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const elmoumenyassine = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  elmoumenyassine as default
};
