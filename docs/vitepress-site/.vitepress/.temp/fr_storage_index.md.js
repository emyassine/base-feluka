import { ssrRenderAttrs, ssrRenderAttr } from "@vue/server-renderer";
import { _ as _imports_0 } from "./e0369edb57bc98d5.BydRBB3U.js";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Data Layers: TOML, SQLite, JSON and Memory","description":"Which format or store to use for manifests, runtime settings, business data, exchanges and temporary state.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version en anglais est affichée.","sidebarTitle":"Data Layers","icon":"layers","title":"Data Layers: TOML, SQLite, JSON and Memory","description":"Which format or store to use for manifests, runtime settings, business data, exchanges and temporary state.","summary":"Maps TOML, SQLite, JSON, and in-memory storage to manifests, runtime settings, business data, exchanges, and temporary state. It explains how interface changes are persisted and applied, when to use typed columns or validated JSON, and why synchronization across devices requires a separate design.","date":"2026-10-29T00:00:00.000Z","lastmod":"2026-10-29T00:00:00.000Z","weight":1,"status":"Target","tags":["feluqa","storage","sqlite","toml","json"],"draft":true,"author":{"name":"El Moumen Yassine","url":"https://numerimondes.com","linkedin":"https://www.linkedin.com/in/elmoumenyassine","email":"yassine@numerimondes.com"},"search":false,"prev":{"text":"Rust Boundaries","link":"/fr/security/rust-security-boundaries"},"next":{"text":"Storage Paths","link":"/fr/storage/storage-backends-and-paths"}},"headers":[],"relativePath":"fr/storage/index.md","filePath":"fr/storage/index.md"}');
const _sfc_main = { name: "fr/storage/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="data-layers" tabindex="-1">Data Layers <a class="header-anchor" href="#data-layers" aria-label="Permalink to &quot;Data Layers&quot;">​</a></h1><table tabindex="0"><thead><tr><th>Layer</th><th>Used for</th></tr></thead><tbody><tr><td><strong>TOML</strong></td><td>Manifest and rarely changed deployment settings, such as <code>feluqa.toml</code>.</td></tr><tr><td><strong>SQLite</strong></td><td>Settings editable in the UI, persistent module state, and business data that changes at runtime.</td></tr><tr><td><strong>JSON</strong></td><td>Exchanges: APIs, structured CLI output, exported documents.</td></tr><tr><td><strong>Memory</strong></td><td>Temporary state that does not need to survive a restart.</td></tr></tbody></table><p><img${ssrRenderAttr("src", _imports_0)} alt="Mermaid diagram"></p><h2 id="rule" tabindex="-1">Rule <a class="header-anchor" href="#rule" aria-label="Permalink to &quot;Rule&quot;">​</a></h2><p>A value changed in the interface <strong>does not rewrite the TOML file</strong>. The app saves the change in SQLite, commits the transaction, then applies the new value to the runtime.</p><p>For structured settings use typed columns or validated JSON, depending on need. Important, frequently searched business data deserves a relational schema.</p><h2 id="practical-rules" tabindex="-1">Practical rules <a class="header-anchor" href="#practical-rules" aria-label="Permalink to &quot;Practical rules&quot;">​</a></h2><ul><li>Versioned migrations.</li><li>Transactions for related changes.</li><li>Consistent backups.</li><li>Server-side validation.</li><li>Authorization on every mutation.</li></ul><p>Synchronization between several devices is a <strong>separate rule to define</strong>. Local SQLite does not provide it by itself.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/storage/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
