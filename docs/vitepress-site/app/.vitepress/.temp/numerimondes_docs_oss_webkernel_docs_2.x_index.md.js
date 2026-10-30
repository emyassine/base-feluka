import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"API reference","description":"Public APIs and contracts.","frontmatter":{"title":"API reference","sidebarTitle":"API reference","icon":"code-square","description":"Public APIs and contracts.","search":false,"prev":{"text":"Webkernel","link":"/numerimondes/docs/oss/webkernel/"},"next":{"text":"Architecture","link":"/numerimondes/docs/oss/webkernel/docs/2.x/architecture/"}},"headers":[],"relativePath":"numerimondes/docs/oss/webkernel/docs/2.x/index.md","filePath":"numerimondes/docs/oss/webkernel/docs/2.x/index.md"}');
const _sfc_main = { name: "numerimondes/docs/oss/webkernel/docs/2.x/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="api-reference" tabindex="-1">API reference <a class="header-anchor" href="#api-reference" aria-label="Permalink to &quot;API reference&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("numerimondes/docs/oss/webkernel/docs/2.x/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
