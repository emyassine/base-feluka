import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"How to contribute","description":"Ways to contribute to Numerimondes projects and community.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"How to contribute","sidebarTitle":"How to contribute","icon":"hand","description":"Ways to contribute to Numerimondes projects and community.","search":false,"prev":{"text":"Hall of fame","link":"/fr/community/contributors/hall-of-fame/"},"next":{"text":"Past","link":"/fr/community/events/past/"}},"headers":[],"relativePath":"fr/community/contributors/how-to-contribute.md","filePath":"fr/community/contributors/how-to-contribute.md"}');
const _sfc_main = { name: "fr/community/contributors/how-to-contribute.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="how-to-contribute" tabindex="-1">How to contribute <a class="header-anchor" href="#how-to-contribute" aria-label="Permalink to &quot;How to contribute&quot;">​</a></h1><p>Several paths feed the live community models:</p><ol><li><strong>Forum</strong> — answer questions and open threads in <a href="/fr/community/forum/general">General</a>, <a href="/fr/community/forum/webkernel">Webkernel</a>, <a href="/fr/community/forum/education">Education</a>, or <a href="/fr/community/forum/jobs">Jobs</a>.</li><li><strong>Events</strong> — attend sessions and earn attestations via <a href="/fr/community/events/upcoming">upcoming events</a>.</li><li><strong>Missions</strong> — apply to published <a href="/fr/community/freelance-jobs">freelance jobs</a>.</li><li><strong>Consulting</strong> — join the expert network via <a href="/fr/community/become-consultant">become a consultant</a>.</li></ol><p>Recognition of outstanding contributors lives on the <a href="/fr/community/contributors/hall-of-fame">hall of fame</a>.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/contributors/how-to-contribute.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const howToContribute = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  howToContribute as default
};
