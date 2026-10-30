import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Privacy policy","description":"How we handle personal data.","frontmatter":{"title":"Privacy policy","sidebarTitle":"Privacy","icon":"shield-check","description":"How we handle personal data.","search":false,"prev":{"text":"Payment methods","link":"/about/legal/payment-methods/"},"next":{"text":"Terms","link":"/about/legal/terms/"}},"headers":[],"relativePath":"about/legal/privacy.md","filePath":"about/legal/privacy.md"}');
const _sfc_main = { name: "about/legal/privacy.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="privacy-policy" tabindex="-1">Privacy policy <a class="header-anchor" href="#privacy-policy" aria-label="Permalink to &quot;Privacy policy&quot;">​</a></h1><p><em>Coming soon.</em></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/legal/privacy.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const privacy = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  privacy as default
};
