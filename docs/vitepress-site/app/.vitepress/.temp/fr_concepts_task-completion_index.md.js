import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Achèvement de tâche","description":"Définition de « Achèvement de tâche », publiée dans la collection des concepts de recherche.","frontmatter":{"title":"Achèvement de tâche","sidebarTitle":"Achèvement de tâche","icon":"lightbulb","description":"Définition de « Achèvement de tâche », publiée dans la collection des concepts de recherche.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"fr/concepts/task-completion/index.md","filePath":"fr/concepts/task-completion/index.md"}');
const _sfc_main = { name: "fr/concepts/task-completion/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p><em>Article original en anglais; sa traduction est en préparation.</em></p><h1 id="task-completion" tabindex="-1">Task completion <a class="header-anchor" href="#task-completion" aria-label="Permalink to &quot;Task completion&quot;">​</a></h1><p>A <strong>clear end state</strong> for a work unit. Completion is binary enough that [[dopaminergic-closure|dopaminergic closure]] can fire and systems (tickets, releases, ops runbooks) can stop carrying open loops.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/concepts/task-completion/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
