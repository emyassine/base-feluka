import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"General","description":"General community discussion — live threads from the database.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"General","sidebarTitle":"General","icon":"message-circle","description":"General community discussion — live threads from the database.","search":false,"prev":{"text":"Education","link":"/fr/community/forum/education/"},"next":{"text":"Jobs","link":"/fr/community/forum/jobs/"}},"headers":[],"relativePath":"fr/community/forum/general.md","filePath":"fr/community/forum/general.md"}');
const _sfc_main = { name: "fr/community/forum/general.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="general" tabindex="-1">General <a class="header-anchor" href="#general" aria-label="Permalink to &quot;General&quot;">​</a></h1><p>Public overview of open threads in the <strong>General</strong> category. Reply and create threads in the authenticated portal.</p><p><a href="https://www.numerimondes.com/app/forum-threads" target="_blank" rel="noreferrer">Open forum in portal</a> · <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a> · <a href="https://www.numerimondes.com/app/register" target="_blank" rel="noreferrer">Register</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/forum/general.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const general = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  general as default
};
