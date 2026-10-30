import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Employees","description":"Core team members at Numerimondes.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Employees","sidebarTitle":"Employees","icon":"id-card","description":"Core team members at Numerimondes.","search":false,"prev":{"text":"Press","link":"/fr/about/company/press/"},"next":{"text":"Yassine El Moumen","link":"/fr/about/company/team/employees/elmoumenyassine/"}},"headers":[],"relativePath":"fr/about/company/team/employees.md","filePath":"fr/about/company/team/employees.md"}');
const _sfc_main = { name: "fr/about/company/team/employees.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="employees" tabindex="-1">Employees <a class="header-anchor" href="#employees" aria-label="Permalink to &quot;Employees&quot;">​</a></h1><p>Core team. Each member is a self-contained folder under this hub; publications reference them by <code>member_id</code> (folder name).</p><ul><li><a href="/fr/about/company/team/employees/elmoumenyassine">Yassine El Moumen</a> — Founder &amp; MD</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/about/company/team/employees.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const employees = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  employees as default
};
