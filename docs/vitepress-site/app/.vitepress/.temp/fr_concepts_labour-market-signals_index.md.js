import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Signaux du marché du travail","description":"Définition de « Signaux du marché du travail », publiée dans la collection des concepts de recherche.","frontmatter":{"title":"Signaux du marché du travail","sidebarTitle":"Signaux du marché du travail","icon":"lightbulb","description":"Définition de « Signaux du marché du travail », publiée dans la collection des concepts de recherche.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"fr/concepts/labour-market-signals/index.md","filePath":"fr/concepts/labour-market-signals/index.md"}');
const _sfc_main = { name: "fr/concepts/labour-market-signals/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p><em>Article original en anglais; sa traduction est en préparation.</em></p><h1 id="labour-market-signals" tabindex="-1">Labour-market signals <a class="header-anchor" href="#labour-market-signals" aria-label="Permalink to &quot;Labour-market signals&quot;">​</a></h1><p>Vacancies, wage bands, time-to-hire, and related instruments. They are <strong>noisy</strong> and segmented; useful when paired with [[skill-obsolescence|skill obsolescence]], not when treated as one national thermometer.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/concepts/labour-market-signals/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
