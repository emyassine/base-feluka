import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Community","description":"Community home.","frontmatter":{"title":"Community","sidebarTitle":"Community Subsite","icon":"home","description":"Community home.","search":false,"prev":false,"next":false},"headers":[],"relativePath":"community.md","filePath":"community.md"}');
const _sfc_main = { name: "community.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="community" tabindex="-1">Community <a class="header-anchor" href="#community" aria-label="Permalink to &quot;Community&quot;">​</a></h1><p>Welcome to the <strong>Community</strong> area of Numerimondes.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const community = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  community as default
};
