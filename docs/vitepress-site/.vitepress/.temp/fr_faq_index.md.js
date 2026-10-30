import { ssrRenderAttrs } from "@vue/server-renderer";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"FAQ Feluqa","description":"Questions fréquentes et liens vers les guides de documentation Feluqa.","frontmatter":{"title":"FAQ Feluqa","sidebarTitle":"FAQ","icon":"circle-help","description":"Questions fréquentes et liens vers les guides de documentation Feluqa.","lang":"fr","prev":false,"next":false},"headers":[],"relativePath":"fr/faq/index.md","filePath":"fr/faq/index.md"}');
const _sfc_main = { name: "fr/faq/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="faq-feluqa" tabindex="-1">FAQ Feluqa <a class="header-anchor" href="#faq-feluqa" aria-label="Permalink to &quot;FAQ Feluqa&quot;">​</a></h1><h2 id="guides-populaires" tabindex="-1">Guides populaires <a class="header-anchor" href="#guides-populaires" aria-label="Permalink to &quot;Guides populaires&quot;">​</a></h2><ul><li><a href="/fr/get-started/">Bien démarrer</a> — Comprendre Feluqa et créer une première application.</li><li><a href="/fr/internals/">Les internes de Feluqa</a> — Explorer l’architecture du runtime, du workspace et de la compilation.</li><li><a href="/fr/agents/">Agents</a> — Consulter les consignes de contribution pour les agents de codage IA.</li><li><a href="/fr/learn/">Apprendre</a> — Suivre des tutoriels pratiques de développement d’applications.</li></ul><h2 id="reponses-rapides" tabindex="-1">Réponses rapides <a class="header-anchor" href="#reponses-rapides" aria-label="Permalink to &quot;Réponses rapides&quot;">​</a></h2><h3 id="qu-est-ce-que-feluqa" tabindex="-1">Qu’est-ce que Feluqa ? <a class="header-anchor" href="#qu-est-ce-que-feluqa" aria-label="Permalink to &quot;Qu’est-ce que Feluqa ?&quot;">​</a></h3><p>Feluqa est une plateforme propriétaire et un espace de noms unifié pour créer des applications web, poste de travail, mobiles, de jeux, des API et des systèmes temps réel. L’architecture cible est encore en développement.</p><h3 id="par-ou-commencer" tabindex="-1">Par où commencer ? <a class="header-anchor" href="#par-ou-commencer" aria-label="Permalink to &quot;Par où commencer ?&quot;">​</a></h3><p>Commencez par Bien démarrer pour comprendre l’orientation actuelle du produit, préparer votre environnement et suivre les guides de développement.</p><h3 id="la-plateforme-complete-est-elle-disponible-aujourd-hui" tabindex="-1">La plateforme complète est-elle disponible aujourd’hui ? <a class="header-anchor" href="#la-plateforme-complete-est-elle-disponible-aujourd-hui" aria-label="Permalink to &quot;La plateforme complète est-elle disponible aujourd’hui ?&quot;">​</a></h3><p>Non. Le dépôt fournit certaines fondations du framework, tandis que plusieurs capacités cibles, dont l’installation dynamique de modules et les shells runtime complets, sont encore en développement.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/faq/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
