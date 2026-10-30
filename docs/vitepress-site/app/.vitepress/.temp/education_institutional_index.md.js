import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Institutional","description":"University partnerships and institutional programmes.","frontmatter":{"title":"Institutional","sidebarTitle":"Institutional","icon":"landmark","description":"University partnerships and institutional programmes.","prev":{"text":"Catalogue","link":"/education/catalogue/"},"next":false},"headers":[],"relativePath":"education/institutional/index.md","filePath":"education/institutional/index.md"}');
const _sfc_main = { name: "education/institutional/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="institutional" tabindex="-1">Institutional <a class="header-anchor" href="#institutional" aria-label="Permalink to &quot;Institutional&quot;">​</a></h1><p>Numerimondes works with universities and schools under an <strong>academic accompaniment</strong> framework: filmed conferences and complementary lectures at no direct cost to the establishment, with student registration and verifiable attestations on this site.</p><h2 id="for-students" tabindex="-1">For students <a class="header-anchor" href="#for-students" aria-label="Permalink to &quot;For students&quot;">​</a></h2><ol><li>Browse <a href="/community/events/upcoming">upcoming events</a></li><li><a href="https://www.numerimondes.com/app/register" target="_blank" rel="noreferrer">Create an account</a> or <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">log in</a></li><li>Register for the session, attend, and receive an online attestation</li></ol><h2 id="for-establishments" tabindex="-1">For establishments <a class="header-anchor" href="#for-establishments" aria-label="Permalink to &quot;For establishments&quot;">​</a></h2><p>Partner schools get a dedicated operational contact, event pages for SEO, attendance reports, and content for their own communication — under the written convention.</p><p><a href="/partnerships/institutional">Current partners</a> · <a href="https://www.numerimondes.com/app" target="_blank" rel="noreferrer">Portal</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("education/institutional/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
