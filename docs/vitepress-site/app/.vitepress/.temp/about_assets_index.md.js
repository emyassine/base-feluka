import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Brand kit","description":"Logos and brand assets.","frontmatter":{"title":"Brand kit","sidebarTitle":"Brand kit","icon":"paint-brush","description":"Logos and brand assets.","search":false,"prev":false,"next":{"text":"Culture","link":"/about/company/about/culture/"}},"headers":[],"relativePath":"about/assets/index.md","filePath":"about/assets/index.md"}');
const _sfc_main = { name: "about/assets/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="brand-kit" tabindex="-1">Brand kit <a class="header-anchor" href="#brand-kit" aria-label="Permalink to &quot;Brand kit&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/assets/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
