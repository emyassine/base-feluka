import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { ssrRenderAttrs, ssrRenderComponent } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { resolveComponent, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Articles","description":"Articles courts sur la création avec Feluqa.","frontmatter":{"title":"Articles","sidebarTitle":"Articles","description":"Articles courts sur la création avec Feluqa.","layout":"doc","collectionIndex":"articles","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"fr/articles/index.md","filePath":"fr/articles/index.md"}');
const _sfc_main = { name: "fr/articles/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_CollectionSpotlightCards = resolveComponent("CollectionSpotlightCards");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="articles" tabindex="-1">Articles <a class="header-anchor" href="#articles" aria-label="Permalink to &quot;Articles&quot;">​</a></h1><p>Articles courts sur la création avec Feluqa.</p>`);
  _push(ssrRenderComponent(_component_CollectionSpotlightCards, { "collection-id": "articles" }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/articles/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
