import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Technological acceleration","description":"Acceleration as a systems property — not mere feature velocity.","frontmatter":{"title":"Technological acceleration","sidebarTitle":"Technological acceleration","icon":"rocket-launch","description":"Acceleration as a systems property — not mere feature velocity.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/technological-acceleration/index.md","filePath":"concepts/technological-acceleration/index.md"}');
const _sfc_main = { name: "concepts/technological-acceleration/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="technological-acceleration" tabindex="-1">Technological acceleration <a class="header-anchor" href="#technological-acceleration" aria-label="Permalink to &quot;Technological acceleration&quot;">​</a></h1><p>The compounding speed at which a society moves from <strong>discovery → infrastructure → deployment</strong>. Distinct from “shipping more tickets”.</p><p>Tied to the [[kardashev-scale|Kardashev Scale]] when the bottleneck is energy and coordination, not marketing cadence.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/technological-acceleration/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
