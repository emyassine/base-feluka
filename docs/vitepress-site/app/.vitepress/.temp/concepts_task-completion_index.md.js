import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Task completion","description":"Designing work so that done is a real, checkable boundary.","frontmatter":{"title":"Task completion","sidebarTitle":"Task completion","icon":"check-circle","description":"Designing work so that done is a real, checkable boundary.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/task-completion/index.md","filePath":"concepts/task-completion/index.md"}');
const _sfc_main = { name: "concepts/task-completion/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="task-completion" tabindex="-1">Task completion <a class="header-anchor" href="#task-completion" aria-label="Permalink to &quot;Task completion&quot;">​</a></h1><p>A <strong>clear end state</strong> for a work unit. Completion is binary enough that [[dopaminergic-closure|dopaminergic closure]] can fire and systems (tickets, releases, ops runbooks) can stop carrying open loops.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/task-completion/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
