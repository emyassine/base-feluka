import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Become a consultant","description":"Join the Numerimondes consultant network — live accepted experts.","frontmatter":{"title":"Become a consultant","sidebarTitle":"Become a consultant","icon":"id-card","description":"Join the Numerimondes consultant network — live accepted experts.","search":false,"prev":false,"next":{"text":"Hall of fame","link":"/community/contributors/hall-of-fame/"}},"headers":[],"relativePath":"community/become-consultant.md","filePath":"community/become-consultant.md"}');
const _sfc_main = { name: "community/become-consultant.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="become-a-consultant" tabindex="-1">Become a consultant <a class="header-anchor" href="#become-a-consultant" aria-label="Permalink to &quot;Become a consultant&quot;">​</a></h1><p>Apply to join the Numerimondes expert network. Accepted consultants appear below (public profile only: name, headline, expertise, city).</p><p><a href="https://www.numerimondes.com/app/consultant-applications/create" target="_blank" rel="noreferrer">Apply in portal</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a> · <a href="https://www.numerimondes.com/app/register" target="_blank" rel="noreferrer">Register</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("community/become-consultant.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const becomeConsultant = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  becomeConsultant as default
};
