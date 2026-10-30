import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Programs","description":"Internships, apprenticeships, and early-career programmes.","frontmatter":{"title":"Programs","sidebarTitle":"Programs","icon":"graduation-cap","description":"Internships, apprenticeships, and early-career programmes.","search":false,"prev":{"text":"Open positions","link":"/about/company/careers/open-positions/"},"next":{"text":"Group","link":"/about/company/group/"}},"headers":[],"relativePath":"about/company/careers/programs.md","filePath":"about/company/careers/programs.md"}');
const _sfc_main = { name: "about/company/careers/programs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="programs" tabindex="-1">Programs <a class="header-anchor" href="#programs" aria-label="Permalink to &quot;Programs&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/careers/programs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const programs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  programs as default
};
