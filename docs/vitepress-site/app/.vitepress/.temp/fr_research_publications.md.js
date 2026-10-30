import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Publications","description":"Essays, papers, guest industry pieces, and market notes.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Publications","sidebarTitle":"Publications","icon":"file-text","description":"Essays, papers, guest industry pieces, and market notes.","search":false,"prev":{"text":"Lab","link":"/fr/research/lab/"},"next":{"text":"Job market: actual state","link":"/fr/research/publications/job-market-actual-state/"}},"headers":[],"relativePath":"fr/research/publications.md","filePath":"fr/research/publications.md"}');
const _sfc_main = { name: "fr/research/publications.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="publications" tabindex="-1">Publications <a class="header-anchor" href="#publications" aria-label="Permalink to &quot;Publications&quot;">​</a></h1><p>One stream for written work. Format is <code>meta.kind</code>, not a folder.</p><p>Each piece is a <strong>self-contained folder</strong> (<code>index.{lang}.md</code> + optional <code>files/</code> / <code>__private/</code> attachments). Authors are <strong>team members</strong> (<code>meta.author: elmoumenyassine</code>), not a parallel authors tree.</p><h2 id="pieces" tabindex="-1">Pieces <a class="header-anchor" href="#pieces" aria-label="Permalink to &quot;Pieces&quot;">​</a></h2><ul><li><a href="/fr/research/publications/push-technology-farthest">Push technology to its farthest possible development</a></li><li><a href="/fr/research/publications/neurobiologie-travail-acheve">Neurobiologie de quand le travail est achevé</a></li><li><a href="/fr/research/publications/job-market-actual-state">Job market: actual state</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/research/publications.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const publications = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  publications as default
};
