import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Job market: actual state","description":"A plain reading of labour-market signals, skill obsolescence, and what operators can still plan for.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Job market: actual state","sidebarTitle":"Job market: actual state","icon":"book-open","description":"A plain reading of labour-market signals, skill obsolescence, and what operators can still plan for.","prev":{"text":"Publications","link":"/fr/research/publications/"},"next":{"text":"Neurobiologie de quand le travail est achevé","link":"/fr/research/publications/neurobiologie-travail-acheve/"}},"headers":[],"relativePath":"fr/research/publications/job-market-actual-state/index.md","filePath":"fr/research/publications/job-market-actual-state/index.md"}');
const _sfc_main = { name: "fr/research/publications/job-market-actual-state/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="job-market-actual-state" tabindex="-1">Job market: actual state <a class="header-anchor" href="#job-market-actual-state" aria-label="Permalink to &quot;Job market: actual state&quot;">​</a></h1><p>There is no single “job market”. There are <strong>overlapping markets</strong> — by geography, by skill stack, by institutional gatekeeping — that only look unified in headlines.</p><h2 id="what-to-watch" tabindex="-1">What to watch <a class="header-anchor" href="#what-to-watch" aria-label="Permalink to &quot;What to watch&quot;">​</a></h2><ol><li><strong>[[skill-obsolescence|Skill obsolescence]]</strong> — half-life of mid-stack skills under automation and platform churn.</li><li><strong>[[labour-market-signals|Labour-market signals]]</strong> — vacancies, wage dispersion, and time-to-hire as noisy but useful instruments.</li><li><strong>Institutional lag</strong> — schools, procurement, and HR systems that still hire for yesterday’s job descriptions.</li></ol><h2 id="working-claim" tabindex="-1">Working claim <a class="header-anchor" href="#working-claim" aria-label="Permalink to &quot;Working claim&quot;">​</a></h2><p>Operators who treat hiring as a <strong>capability portfolio</strong> (what we can train, what we buy, what we partner for) outperform those who treat it as a perpetual vacancy hunt.</p><p>Guest industry voices (e.g. logistics) land as publications with <code>author</code> pointing at a member folder (or a future external-contributor member under the same members path).</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/research/publications/job-market-actual-state/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
