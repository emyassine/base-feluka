import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Satisfaction when work is done","description":"Multi-part series on completion, reward, and the neurobiology of finishing work.","frontmatter":{"title":"Satisfaction when work is done","sidebarTitle":"Satisfaction when work is done","icon":"list","description":"Multi-part series on completion, reward, and the neurobiology of finishing work.","search":false,"prev":{"text":"Push technology to its farthest possible development","link":"/research/publications/push-technology-farthest/"},"next":false},"headers":[],"relativePath":"research/publications/series.md","filePath":"research/publications/series.md"}');
const _sfc_main = { name: "research/publications/series.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="satisfaction-when-work-is-done" tabindex="-1">Satisfaction when work is done <a class="header-anchor" href="#satisfaction-when-work-is-done" aria-label="Permalink to &quot;Satisfaction when work is done&quot;">​</a></h1><p>Series hub. First piece: <a href="/research/publications/neurobiologie-travail-acheve">Neurobiologie de quand le travail est achevé</a>.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("research/publications/series.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const series = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  series as default
};
