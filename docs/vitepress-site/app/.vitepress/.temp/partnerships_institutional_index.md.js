import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Institutional","description":"Institutional and university partnerships.","frontmatter":{"title":"Institutional","sidebarTitle":"Institutional","icon":"landmark","description":"Institutional and university partnerships.","prev":{"text":"Current partners","link":"/partnerships/current-partners/"},"next":{"text":"Overview","link":"/partnerships/overview/"}},"headers":[],"relativePath":"partnerships/institutional/index.md","filePath":"partnerships/institutional/index.md"}');
const _sfc_main = { name: "partnerships/institutional/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="institutional" tabindex="-1">Institutional <a class="header-anchor" href="#institutional" aria-label="Permalink to &quot;Institutional&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("partnerships/institutional/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
