import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Story","description":"How Numerimondes started and where we are going.","frontmatter":{"title":"Story","sidebarTitle":"Story","icon":"book-open","description":"How Numerimondes started and where we are going.","prev":{"text":"Culture","link":"/about/company/about/culture/"},"next":{"text":"Values","link":"/about/company/about/values/"}},"headers":[],"relativePath":"about/company/about/story/index.md","filePath":"about/company/about/story/index.md"}');
const _sfc_main = { name: "about/company/about/story/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="story" tabindex="-1">Story <a class="header-anchor" href="#story" aria-label="Permalink to &quot;Story&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/about/story/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
