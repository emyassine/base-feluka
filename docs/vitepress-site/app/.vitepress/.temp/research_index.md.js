import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Research","description":"Publications, concepts, and lab experiments from Numerimondes.","frontmatter":{"title":"Research","sidebarTitle":"Home","icon":"home","description":"Publications, concepts, and lab experiments from Numerimondes.","prev":false,"next":false},"headers":[],"relativePath":"research/index.md","filePath":"research/index.md"}');
const _sfc_main = { name: "research/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmConceptsIndex = resolveComponent("NmConceptsIndex");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="research" tabindex="-1">Research <a class="header-anchor" href="#research" aria-label="Permalink to &quot;Research&quot;">​</a></h1><p>Public thinking: <strong>publications</strong> (self-contained folders with optional attachments), <strong>concepts</strong> (glossary), <strong>lab</strong> (experiments). Authors are team <strong>members</strong>.</p><table tabindex="0"><thead><tr><th>Section</th><th>Intent</th></tr></thead><tbody><tr><td><a href="/research/publications">Publications</a></td><td>Essays, papers, guest pieces, market notes</td></tr><tr><td><a href="/concepts/">Concepts</a></td><td>Atomic definitions (wiki / hover)</td></tr><tr><td><a href="/research/lab">Lab</a></td><td>Prototypes and demos</td></tr></tbody></table><p>Commercial offers live under <a href="/services">Services</a> and the rest of the site — research does not host a product catalog.</p><h2 id="featured" tabindex="-1">Featured <a class="header-anchor" href="#featured" aria-label="Permalink to &quot;Featured&quot;">​</a></h2><ul><li><a href="/research/publications/push-technology-farthest">Push technology to its farthest possible development</a></li><li><a href="/research/publications/neurobiologie-travail-acheve">Neurobiologie de quand le travail est achevé</a></li><li><a href="/research/publications/job-market-actual-state">Job market: actual state</a></li></ul><p>Conventions (self-contained folders, members as authors, public/private attachments) live in this subsite’s <code>CONTENT.md</code> in the repo.</p><h2 id="concepts" tabindex="-1">Concepts <a class="header-anchor" href="#concepts" aria-label="Permalink to &quot;Concepts&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_NmConceptsIndex, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("research/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
