import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Skill obsolescence","description":"How fast mid-stack skills lose economic relevance.","frontmatter":{"title":"Skill obsolescence","sidebarTitle":"Skill obsolescence","icon":"graduation-cap","description":"How fast mid-stack skills lose economic relevance.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/skill-obsolescence/index.md","filePath":"concepts/skill-obsolescence/index.md"}');
const _sfc_main = { name: "concepts/skill-obsolescence/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="skill-obsolescence" tabindex="-1">Skill obsolescence <a class="header-anchor" href="#skill-obsolescence" aria-label="Permalink to &quot;Skill obsolescence&quot;">​</a></h1><p>The rate at which a skill’s <strong>market value decays</strong>. Driven by automation, tool churn, and slow institutions. Central to reading [[labour-market-signals|labour-market signals]].</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/skill-obsolescence/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
