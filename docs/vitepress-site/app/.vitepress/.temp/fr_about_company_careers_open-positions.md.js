import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Open positions","description":"Current job openings at Numerimondes.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Open positions","sidebarTitle":"Open positions","icon":"briefcase","description":"Current job openings at Numerimondes.","search":false,"prev":{"text":"Apply","link":"/fr/about/company/careers/apply/"},"next":{"text":"Programs","link":"/fr/about/company/careers/programs/"}},"headers":[],"relativePath":"fr/about/company/careers/open-positions.md","filePath":"fr/about/company/careers/open-positions.md"}');
const _sfc_main = { name: "fr/about/company/careers/open-positions.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="open-positions" tabindex="-1">Open positions <a class="header-anchor" href="#open-positions" aria-label="Permalink to &quot;Open positions&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/careers/open-positions.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const openPositions = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  openPositions as default
};
