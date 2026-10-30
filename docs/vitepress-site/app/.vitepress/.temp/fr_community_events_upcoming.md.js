import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Upcoming events","description":"Live academic and community events — register for attestations.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Upcoming events","sidebarTitle":"Upcoming","icon":"calendar","description":"Live academic and community events — register for attestations.","search":false,"prev":{"text":"Past","link":"/fr/community/events/past/"},"next":{"text":"Education","link":"/fr/community/forum/education/"}},"headers":[],"relativePath":"fr/community/events/upcoming.md","filePath":"fr/community/events/upcoming.md"}');
const _sfc_main = { name: "fr/community/events/upcoming.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="upcoming-events" tabindex="-1">Upcoming events <a class="header-anchor" href="#upcoming-events" aria-label="Permalink to &quot;Upcoming events&quot;">​</a></h1><p>Pre-register on Numerimondes.</p><ul><li>Presence is checked at the start and end of each session;</li><li>participants receive a <strong>verifiable online attestation</strong>.</li></ul><p>Need an account? <a href="https://www.numerimondes.com/app/login" target="_blank" rel="noreferrer">Log in</a> · <a href="https://www.numerimondes.com/app/register" target="_blank" rel="noreferrer">Create account</a> · <a href="https://www.numerimondes.com/app/my-events" target="_blank" rel="noreferrer">My events (portal)</a></p><br><h2 id="how-it-works" tabindex="-1">How it works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How it works&quot;">​</a></h2><ol><li>Open an event and register (free for convention formats).</li><li>Show up and get checked in / out by the Numerimondes team.</li><li>Receive a link to verify your attestation online.</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/community/events/upcoming.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const upcoming = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  upcoming as default
};
