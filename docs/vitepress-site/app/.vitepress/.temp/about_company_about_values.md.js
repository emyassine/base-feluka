import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Values","description":"Principles that guide our work.","frontmatter":{"title":"Values","sidebarTitle":"Values","icon":"heart","description":"Principles that guide our work.","search":false,"prev":{"text":"Story","link":"/about/company/about/story/"},"next":{"text":"Vision","link":"/about/company/about/vision/"}},"headers":[],"relativePath":"about/company/about/values.md","filePath":"about/company/about/values.md"}');
const _sfc_main = { name: "about/company/about/values.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="values" tabindex="-1">Values <a class="header-anchor" href="#values" aria-label="Permalink to &quot;Values&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/about/values.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const values = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  values as default
};
