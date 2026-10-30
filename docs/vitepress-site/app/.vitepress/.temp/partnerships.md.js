import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Partnerships","description":"Partnerships home.","frontmatter":{"title":"Partnerships","sidebarTitle":"Partners Subsite","icon":"home","description":"Partnerships home.","search":false,"prev":false,"next":false},"headers":[],"relativePath":"partnerships.md","filePath":"partnerships.md"}');
const _sfc_main = { name: "partnerships.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="partnerships" tabindex="-1">Partnerships <a class="header-anchor" href="#partnerships" aria-label="Permalink to &quot;Partnerships&quot;">​</a></h1><p>Welcome to the <strong>Partnerships</strong> area of Numerimondes.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("partnerships.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const partnerships = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  partnerships as default
};
