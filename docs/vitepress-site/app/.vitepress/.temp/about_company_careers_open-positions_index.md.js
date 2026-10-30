import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Open positions","description":"Current job openings at Numerimondes.","frontmatter":{"title":"Open positions","sidebarTitle":"Open positions","icon":"briefcase","description":"Current job openings at Numerimondes.","prev":{"text":"Apply","link":"/about/company/careers/apply/"},"next":{"text":"Programs","link":"/about/company/careers/programs/"}},"headers":[],"relativePath":"about/company/careers/open-positions/index.md","filePath":"about/company/careers/open-positions/index.md"}');
const _sfc_main = { name: "about/company/careers/open-positions/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="open-positions" tabindex="-1">Open positions <a class="header-anchor" href="#open-positions" aria-label="Permalink to &quot;Open positions&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/careers/open-positions/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
