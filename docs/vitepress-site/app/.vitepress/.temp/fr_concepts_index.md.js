import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Concepts","description":"Définitions atomiques utilisées dans les publications de recherche.","frontmatter":{"title":"Concepts","sidebarTitle":"Concepts","description":"Définitions atomiques utilisées dans les publications de recherche.","layout":"doc","collectionIndex":"concepts","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"fr/concepts/index.md","filePath":"fr/concepts/index.md"}');
const _sfc_main = { name: "fr/concepts/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="concepts" tabindex="-1">Concepts <a class="header-anchor" href="#concepts" aria-label="Permalink to &quot;Concepts&quot;">​</a></h1><p>Définitions atomiques utilisées dans les publications de recherche.</p><ul><li><a href="/fr/concepts/technological-acceleration/">Accélération technologique</a> — Définition de « Accélération technologique », publiée dans la collection des concepts de recherche.</li><li><a href="/fr/concepts/task-completion/">Achèvement de tâche</a> — Définition de « Achèvement de tâche », publiée dans la collection des concepts de recherche.</li><li><a href="/fr/concepts/dopaminergic-closure/">Clôture dopaminergique</a> — Définition de « Clôture dopaminergique », publiée dans la collection des concepts de recherche.</li><li><a href="/fr/concepts/kardashev-scale/">Échelle de Kardashev</a> — Définition de « Échelle de Kardashev », publiée dans la collection des concepts de recherche.</li><li><a href="/fr/concepts/skill-obsolescence/">Obsolescence des compétences</a> — Définition de « Obsolescence des compétences », publiée dans la collection des concepts de recherche.</li><li><a href="/fr/concepts/labour-market-signals/">Signaux du marché du travail</a> — Définition de « Signaux du marché du travail », publiée dans la collection des concepts de recherche.</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/concepts/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
