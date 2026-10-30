import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Clôture dopaminergique","description":"Définition de « Clôture dopaminergique », publiée dans la collection des concepts de recherche.","frontmatter":{"title":"Clôture dopaminergique","sidebarTitle":"Clôture dopaminergique","icon":"lightbulb","description":"Définition de « Clôture dopaminergique », publiée dans la collection des concepts de recherche.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"fr/concepts/dopaminergic-closure/index.md","filePath":"fr/concepts/dopaminergic-closure/index.md"}');
const _sfc_main = { name: "fr/concepts/dopaminergic-closure/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p><em>Article original en anglais; sa traduction est en préparation.</em></p><h1 id="dopaminergic-closure" tabindex="-1">Dopaminergic closure <a class="header-anchor" href="#dopaminergic-closure" aria-label="Permalink to &quot;Dopaminergic closure&quot;">​</a></h1><p>When a unit of work is <strong>actually finished</strong>, reward-prediction circuits can settle: the gap between “expected done” and “done” collapses. That settling is what we call dopaminergic closure here — a practical label, not a clinical diagnosis.</p><p>See also [[task-completion|task completion]].</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/concepts/dopaminergic-closure/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
