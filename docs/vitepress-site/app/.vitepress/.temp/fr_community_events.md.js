import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Past events","description":"Archive of past Numerimondes academic and community events.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Past events","sidebarTitle":"Past","icon":"archive","description":"Archive of past Numerimondes academic and community events.","search":false,"prev":{"text":"How to contribute","link":"/fr/community/contributors/how-to-contribute/"},"next":{"text":"Upcoming","link":"/fr/community/events/upcoming/"}},"headers":[],"relativePath":"fr/community/events.md","filePath":"fr/community/events.md"}');
const _sfc_main = { name: "fr/community/events.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="past-events" tabindex="-1">Past events <a class="header-anchor" href="#past-events" aria-label="Permalink to &quot;Past events&quot;">​</a></h1><p>Archive of published sessions. Attestations remain verifiable from your <a href="https://www.numerimondes.com/app/my-events" target="_blank" rel="noreferrer">portal</a>.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/events.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const events = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  events as default
};
