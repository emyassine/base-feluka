import { ssrRenderAttrs } from "@vue/server-renderer";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Feluqa Guides","description":"Start here for Feluqa product, application, and contributor documentation.","frontmatter":{"sidebarTitle":"Feluqa","icon":"book-open","title":"Feluqa Guides","description":"Start here for Feluqa product, application, and contributor documentation.","prev":{"text":"HTTP & Live","link":"/deployment/http-and-live-actions"},"next":false},"headers":[],"relativePath":"feluqa/index.md","filePath":"feluqa/index.md"}');
const _sfc_main = { name: "feluqa/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="feluqa-guides" tabindex="-1">Feluqa Guides <a class="header-anchor" href="#feluqa-guides" aria-label="Permalink to &quot;Feluqa Guides&quot;">​</a></h1><p>Choose a section to continue.</p><h2 id="start-building" tabindex="-1">Start building <a class="header-anchor" href="#start-building" aria-label="Permalink to &quot;Start building&quot;">​</a></h2><ul><li><a href="/get-started/introduction">Get started</a>: learn the Feluqa model, prepare a development environment, and build an application.</li><li><a href="/security/authorization-model">Security</a>: understand authorization, privilege levels, gates, and Rust security boundaries.</li><li><a href="/storage/data-layers">Storage</a>: choose data layers, storage backends, and paths.</li><li><a href="/deployment/installing-an-app-with-the-cli">Deployment</a>: install an application and expose HTTP and Live actions.</li></ul><h2 id="contribute-to-feluqa" tabindex="-1">Contribute to Feluqa <a class="header-anchor" href="#contribute-to-feluqa" aria-label="Permalink to &quot;Contribute to Feluqa&quot;">​</a></h2><ul><li><a href="/internals/">Core contribution</a>: explore workspaces, runtimes, compile-time guarantees, and contributor rules.</li><li><a href="/prologue/release-notes">Prologue</a>: read the release notes, license, contribution guide, and capabilities overview.</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("feluqa/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
