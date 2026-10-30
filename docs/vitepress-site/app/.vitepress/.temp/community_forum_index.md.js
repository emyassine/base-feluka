import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Education","description":"Courses, conferences, academic tracks — live forum threads.","frontmatter":{"title":"Education","sidebarTitle":"Education","icon":"graduation-cap","description":"Courses, conferences, academic tracks — live forum threads.","search":false,"prev":{"text":"Upcoming","link":"/community/events/upcoming/"},"next":{"text":"General","link":"/community/forum/general/"}},"headers":[],"relativePath":"community/forum/index.md","filePath":"community/forum/index.md"}');
const _sfc_main = { name: "community/forum/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="education" tabindex="-1">Education <a class="header-anchor" href="#education" aria-label="Permalink to &quot;Education&quot;">​</a></h1><p>Courses, conferences, academic tracks. Live threads for this category.</p><p><a href="https://www.numerimondes.com/app/forum-threads" target="_blank" rel="noreferrer">Open forum in portal</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community/forum/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
