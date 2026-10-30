import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Jobs","description":"Freelance and opportunity discussion — live forum threads.","frontmatter":{"title":"Jobs","sidebarTitle":"Jobs","icon":"briefcase","description":"Freelance and opportunity discussion — live forum threads.","search":false,"prev":{"text":"General","link":"/community/forum/general/"},"next":{"text":"Webkernel","link":"/community/forum/webkernel/"}},"headers":[],"relativePath":"community/forum/jobs.md","filePath":"community/forum/jobs.md"}');
const _sfc_main = { name: "community/forum/jobs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="jobs" tabindex="-1">Jobs <a class="header-anchor" href="#jobs" aria-label="Permalink to &quot;Jobs&quot;">​</a></h1><p>Freelance and opportunity talk. Live threads for this category.</p><p><a href="https://www.numerimondes.com/app/forum-threads" target="_blank" rel="noreferrer">Open forum in portal</a> · <a href="/community/freelance-jobs">Browse job listings</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community/forum/jobs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const jobs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  jobs as default
};
