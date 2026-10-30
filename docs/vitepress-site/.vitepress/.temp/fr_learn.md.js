import { ssrRenderAttrs } from "@vue/server-renderer";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Learn Feluqa","description":"Practical learning paths and tutorials for Feluqa.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version en anglais est affichée.","title":"Learn Feluqa","sidebarTitle":"Learn","icon":"graduation-cap","lang":"fr","description":"Practical learning paths and tutorials for Feluqa.","search":false,"prev":false,"next":{"text":"First App","link":"/fr/learn/get-started/first-application/create-your-first-application"}},"headers":[],"relativePath":"fr/learn.md","filePath":"fr/learn.md"}');
const _sfc_main = { name: "fr/learn.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="learn-feluqa" tabindex="-1">Learn Feluqa <a class="header-anchor" href="#learn-feluqa" aria-label="Permalink to &quot;Learn Feluqa&quot;">​</a></h1><p>Follow a practical path from your first application to a working local service.</p><ul><li><a href="/fr/learn/get-started/first-application/create-your-first-application">Create your first application</a></li><li><a href="/fr/learn/get-started/hello-cli/program-0-hello-cli">Program 0: Hello CLI</a></li><li><a href="/fr/learn/get-started/weather-watcher/build-the-weather-watcher">Build the weather watcher</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/learn.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const learn = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  learn as default
};
