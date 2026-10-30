import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Dopaminergic closure","description":"Completion as a distinct dopaminergic event at the end of a work unit.","frontmatter":{"title":"Dopaminergic closure","sidebarTitle":"Dopaminergic closure","icon":"bolt","description":"Completion as a distinct dopaminergic event at the end of a work unit.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/dopaminergic-closure/index.md","filePath":"concepts/dopaminergic-closure/index.md"}');
const _sfc_main = { name: "concepts/dopaminergic-closure/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="dopaminergic-closure" tabindex="-1">Dopaminergic closure <a class="header-anchor" href="#dopaminergic-closure" aria-label="Permalink to &quot;Dopaminergic closure&quot;">​</a></h1><p>When a unit of work is <strong>actually finished</strong>, reward-prediction circuits can settle: the gap between “expected done” and “done” collapses. That settling is what we call dopaminergic closure here — a practical label, not a clinical diagnosis.</p><p>See also [[task-completion|task completion]].</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/dopaminergic-closure/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
