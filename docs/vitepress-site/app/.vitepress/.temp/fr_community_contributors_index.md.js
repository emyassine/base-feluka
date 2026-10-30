import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Hall of fame","description":"Recognising outstanding accepted consultants and community experts.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Hall of fame","sidebarTitle":"Hall of fame","icon":"trophy","description":"Recognising outstanding accepted consultants and community experts.","search":false,"prev":{"text":"Become a consultant","link":"/fr/community/become-consultant/"},"next":{"text":"How to contribute","link":"/fr/community/contributors/how-to-contribute/"}},"headers":[],"relativePath":"fr/community/contributors/index.md","filePath":"fr/community/contributors/index.md"}');
const _sfc_main = { name: "fr/community/contributors/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="hall-of-fame" tabindex="-1">Hall of fame <a class="header-anchor" href="#hall-of-fame" aria-label="Permalink to &quot;Hall of fame&quot;">​</a></h1><p>Live roster of <strong>accepted</strong> consultants from the database. Private application notes are never shown publicly.</p><p><a href="/fr/community/become-consultant">Become a consultant</a> · <a href="/fr/community/contributors/how-to-contribute">How to contribute</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/contributors/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
