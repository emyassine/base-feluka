import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Webkernel","description":"Webkernel product and architecture discussion — live threads.","frontmatter":{"title":"Webkernel","sidebarTitle":"Webkernel","icon":"cube","description":"Webkernel product and architecture discussion — live threads.","search":false,"prev":{"text":"Jobs","link":"/community/forum/jobs/"},"next":{"text":"Freelance jobs","link":"/community/freelance-jobs/"}},"headers":[],"relativePath":"community/forum/webkernel.md","filePath":"community/forum/webkernel.md"}');
const _sfc_main = { name: "community/forum/webkernel.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="webkernel" tabindex="-1">Webkernel <a class="header-anchor" href="#webkernel" aria-label="Permalink to &quot;Webkernel&quot;">​</a></h1><p>Product and architecture discussion. Live threads for this category.</p><p><a href="https://www.numerimondes.com/app/forum-threads" target="_blank" rel="noreferrer">Open forum in portal</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community/forum/webkernel.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const webkernel = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  webkernel as default
};
