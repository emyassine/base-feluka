import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Press","description":"Media kit and press releases.","frontmatter":{"title":"Press","sidebarTitle":"Press","icon":"megaphone","description":"Media kit and press releases.","prev":{"text":"Group","link":"/about/company/group/"},"next":{"text":"Employees","link":"/about/company/team/employees/"}},"headers":[],"relativePath":"about/company/press/index.md","filePath":"about/company/press/index.md"}');
const _sfc_main = { name: "about/company/press/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="press" tabindex="-1">Press <a class="header-anchor" href="#press" aria-label="Permalink to &quot;Press&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/company/press/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
