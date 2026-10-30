import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Freelance jobs","description":"Live published opportunities and freelance missions — apply in the portal.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Freelance jobs","sidebarTitle":"Freelance jobs","icon":"briefcase","description":"Live published opportunities and freelance missions — apply in the portal.","prev":{"text":"Webkernel","link":"/fr/community/forum/webkernel/"},"next":false},"headers":[],"relativePath":"fr/community/freelance-jobs/index.md","filePath":"fr/community/freelance-jobs/index.md"}');
const _sfc_main = { name: "fr/community/freelance-jobs/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="freelance-jobs" tabindex="-1">Freelance jobs <a class="header-anchor" href="#freelance-jobs" aria-label="Permalink to &quot;Freelance jobs&quot;">​</a></h1><p>Commercial and freelance missions from the live <strong>job listings</strong> database. Apply and manage applications in the portal.</p><p><a href="https://www.numerimondes.com/app/job-listings" target="_blank" rel="noreferrer">Browse in portal</a> · <a href="https://www.numerimondes.com/app/job-applications" target="_blank" rel="noreferrer">My applications</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/freelance-jobs/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
