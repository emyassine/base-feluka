import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Education","description":"Education home.","frontmatter":{"title":"Education","sidebarTitle":"Education Subsite","icon":"home","description":"Education home.","search":false,"prev":false,"next":false},"headers":[],"relativePath":"education.md","filePath":"education.md"}');
const _sfc_main = { name: "education.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="education" tabindex="-1">Education <a class="header-anchor" href="#education" aria-label="Permalink to &quot;Education&quot;">​</a></h1><p>Welcome to the <strong>Education</strong> area of Numerimondes.</p><p>//x</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("education.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const education = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  education as default
};
