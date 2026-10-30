import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Freelance jobs","description":"Live published opportunities and freelance missions — apply in the portal.","frontmatter":{"title":"Freelance jobs","sidebarTitle":"Freelance jobs","icon":"briefcase","description":"Live published opportunities and freelance missions — apply in the portal.","search":false,"prev":{"text":"Webkernel","link":"/community/forum/webkernel/"},"next":false},"headers":[],"relativePath":"community/freelance-jobs.md","filePath":"community/freelance-jobs.md"}');
const _sfc_main = { name: "community/freelance-jobs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="freelance-jobs" tabindex="-1">Freelance jobs <a class="header-anchor" href="#freelance-jobs" aria-label="Permalink to &quot;Freelance jobs&quot;">​</a></h1><p>Commercial and freelance missions from the live <strong>job listings</strong> database. Apply and manage applications in the portal.</p><p><a href="https://www.numerimondes.com/app/job-listings" target="_blank" rel="noreferrer">Browse in portal</a> · <a href="https://www.numerimondes.com/app/job-applications" target="_blank" rel="noreferrer">My applications</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community/freelance-jobs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const freelanceJobs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  freelanceJobs as default
};
