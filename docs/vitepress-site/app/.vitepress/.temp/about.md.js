import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"About Numerimondes","description":"Company identity, legal information, and brand assets.","frontmatter":{"title":"About Numerimondes","sidebarTitle":"Home","icon":"building-2","description":"Company identity, legal information, and brand assets.","search":false,"prev":false,"next":false},"headers":[],"relativePath":"about.md","filePath":"about.md"}');
const _sfc_main = { name: "about.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="about-numerimondes" tabindex="-1">About Numerimondes <a class="header-anchor" href="#about-numerimondes" aria-label="Permalink to &quot;About Numerimondes&quot;">​</a></h1><p>Who we are, how we are registered, and the rules that apply to our work and brand.</p><table tabindex="0"><thead><tr><th>Area</th><th>What you will find</th></tr></thead><tbody><tr><td><a href="/about/company">Company</a></td><td>Story, group, team, careers, press</td></tr><tr><td><a href="/about/legal">Legal</a></td><td>Identity, privacy, notice, terms, licences, payment methods</td></tr><tr><td><a href="/about/assets">Assets</a></td><td>Brand kit and institutional materials</td></tr></tbody></table><p>For services and commercial offers, see the <a href="/">main site</a> and <a href="/services">Services</a>.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  about as default
};
