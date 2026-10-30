import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Concepts","description":"Atomic definitions used across research publications.","frontmatter":{"title":"Concepts","sidebarTitle":"Concepts","description":"Atomic definitions used across research publications.","layout":"doc","collectionIndex":"concepts","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/index.md","filePath":"concepts/index.md"}');
const _sfc_main = { name: "concepts/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="concepts" tabindex="-1">Concepts <a class="header-anchor" href="#concepts" aria-label="Permalink to &quot;Concepts&quot;">​</a></h1><p>Atomic definitions used across research publications.</p><ul><li><a href="/concepts/dopaminergic-closure/">Dopaminergic closure</a> — Completion as a distinct dopaminergic event at the end of a work unit.</li><li><a href="/concepts/kardashev-scale/">Kardashev Scale</a> — Method of ranking civilizations by energy capture — from planetary to stellar to galactic scales.</li><li><a href="/concepts/labour-market-signals/">Labour-market signals</a> — How to read noisy labour data without treating headlines as a single market.</li><li><a href="/concepts/skill-obsolescence/">Skill obsolescence</a> — How fast mid-stack skills lose economic relevance.</li><li><a href="/concepts/task-completion/">Task completion</a> — Designing work so that done is a real, checkable boundary.</li><li><a href="/concepts/technological-acceleration/">Technological acceleration</a> — Acceleration as a systems property — not mere feature velocity.</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
