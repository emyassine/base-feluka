import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Neurobiologie de quand le travail est achevé","description":"What happens in the brain when a unit of work is completed — and why that moment is underrated in product and ops design.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Neurobiologie de quand le travail est achevé","sidebarTitle":"Neurobiologie de quand le travail est achevé","icon":"book-open","description":"What happens in the brain when a unit of work is completed — and why that moment is underrated in product and ops design.","search":false,"prev":{"text":"Job market: actual state","link":"/fr/research/publications/job-market-actual-state/"},"next":{"text":"Push technology to its farthest possible development","link":"/fr/research/publications/push-technology-farthest/"}},"headers":[],"relativePath":"fr/research/publications/neurobiologie-travail-acheve.md","filePath":"fr/research/publications/neurobiologie-travail-acheve.md"}');
const _sfc_main = { name: "fr/research/publications/neurobiologie-travail-acheve.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="neurobiologie-de-quand-le-travail-est-acheve" tabindex="-1">Neurobiologie de quand le travail est achevé <a class="header-anchor" href="#neurobiologie-de-quand-le-travail-est-acheve" aria-label="Permalink to &quot;Neurobiologie de quand le travail est achevé&quot;">​</a></h1><p>Part of the series <a href="/fr/research/publications/series/satisfaction-when-work-is-done/">Satisfaction when work is done</a>.</p><p>When a task ends — not “paused”, not “handed off”, but <strong>finished</strong> — the nervous system runs a different script. That moment is [[dopaminergic-closure|dopaminergic closure]]: the prediction-error loop settles, tension drops, and a clean boundary appears between “open loop” and “done”.</p><h2 id="why-this-matters-outside-the-lab" tabindex="-1">Why this matters outside the lab <a class="header-anchor" href="#why-this-matters-outside-the-lab" aria-label="Permalink to &quot;Why this matters outside the lab&quot;">​</a></h2><p>Product teams optimise for engagement loops. Ops teams optimise for throughput. Both often <strong>deny the organism a completion signal</strong>. The result is ambient unfinished work: tabs, tickets, half-ships, perpetual “almost”.</p><p>Designing for [[task-completion|task completion]] is not soft psychology. It is systems hygiene:</p><ul><li>smaller ship units so closure can fire more often</li><li>explicit “done” states (not only “in progress” and “blocked”)</li><li>recovery windows after hard closes, not more stimuli</li></ul><h2 id="draft-status" tabindex="-1">Draft status <a class="header-anchor" href="#draft-status" aria-label="Permalink to &quot;Draft status&quot;">​</a></h2><p>Body will expand with sources and diagrams. The linked concepts already carry short definitions for hover and full pages for deep reading.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/research/publications/neurobiologie-travail-acheve.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const neurobiologieTravailAcheve = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  neurobiologieTravailAcheve as default
};
